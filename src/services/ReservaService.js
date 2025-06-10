import mongoose from 'mongoose';

import ReservaRepository from '../repositories/ReservaRepository.js';
import CustomError from '../utils/helpers/CustomError.js'
import { parse } from 'dotenv';
import Equipamento from '../models/Equipamento.js';
import Usuario from '../models/Usuario.js';

class ReservaService {
    constructor() {
        this.repository = new ReservaRepository();
    }
    async listar(req) {
        const data = await this.repository.listar(req);
        return data;
    }

async criar(parsedData) {
    const { dataInicial, dataFinal, dataFinalAtrasada, quantidadeEquipamento, equipamentos, usuarios } = parsedData;

    const dataInicialDate = new Date(dataInicial);
    const dataFinalDate = new Date(dataFinal);
    const dataFinalAtrasadaDate = dataFinalAtrasada ? new Date(dataFinalAtrasada) : null;

    if (isNaN(dataInicialDate.getTime()) || isNaN(dataFinalDate.getTime()) || (dataFinalAtrasada && isNaN(dataFinalAtrasadaDate.getTime()))) {
        throw new CustomError({
            statusCode: 400,
            errorType: 'invalidData',
            field: 'datas',
            customMessage: 'As datas fornecidas são inválidas.',
        });
    }

    if (!equipamentos) {
        throw new CustomError({
            statusCode: 400,
            errorType: 'invalidData',
            field: 'equipamentos',
            customMessage: 'O campo equipamentos é obrigatório.',
        });
    }

    if (dataInicialDate >= dataFinalDate) {
        throw new CustomError({
            statusCode: 400,
            errorType: 'invalidData',
            field: 'dataInicial',
            details: [],
            customMessage: 'A data inicial deve ser anterior à data final.',
        });
    }

    if (dataFinalAtrasadaDate && dataFinalAtrasadaDate <= dataFinalDate) {
        throw new CustomError({
            statusCode: 400,
            errorType: 'invalidData',
            field: 'dataFinalAtrasada',
            details: [],
            customMessage: 'A data final atrasada deve ser posterior à data final.',
        });
    }

    const agora = new Date();
    const dataZerada = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());

    if (dataInicialDate < dataZerada) {
        throw new CustomError({
        statusCode: 400,
        errorType: 'invalidData',
        field: 'dataInicial',
        details: [],
        customMessage: 'A data inicial não pode ser no passado.',
        });
    }

    if (quantidadeEquipamento <= 0) {
        throw new CustomError({
            statusCode: 400,
            errorType: 'invalidData',
            field: 'quantidadeEquipamento',
            details: [],
            customMessage: 'A quantidade de equipamento deve ser um número inteiro positivo.',
        });
    }

    if (!mongoose.Types.ObjectId.isValid(equipamentos)) {
        throw new CustomError({
            statusCode: 400,
            errorType: 'invalidData',
            field: 'equipamentos',
            customMessage: `ID de equipamento inválido: ${equipamentos}`,
        });
    }
    const equipamentoObjectId = new mongoose.Types.ObjectId(equipamentos);
    const equipamentoDoc = await Equipamento.findById(equipamentoObjectId);
    if (!equipamentoDoc) {
        throw new CustomError({
            statusCode: 404,
            errorType: 'resourceNotFound',
            field: 'equipamentos',
            customMessage: 'Equipamento não encontrado.',
        });
    }
    if (!equipamentoDoc.equiStatus) {
        throw new CustomError({
            statusCode: 400,
            errorType: 'invalidData',
            field: 'equipamentos',
            customMessage: 'O equipamento não está disponível para reserva.',
        });
    }
    if (equipamentoDoc.equiQuantidadeDisponivel < quantidadeEquipamento) {
        throw new CustomError({
            statusCode: 400,
            errorType: 'invalidData',
            field: 'quantidadeEquipamento',
            customMessage: 'Quantidade solicitada excede a quantidade disponível do equipamento.',
        });
    }

    if (usuarios) {
        if (!mongoose.Types.ObjectId.isValid(usuarios)) {
            throw new CustomError({
                statusCode: 400,
                errorType: 'invalidData',
                field: 'usuarios',
                customMessage: `ID de usuário inválido: ${usuarios}`,
            });
        }
        const usuarioObjectId = new mongoose.Types.ObjectId(usuarios);
        const usuarioDoc = await Usuario.findById(usuarioObjectId);
        if (!usuarioDoc) {
            throw new CustomError({
                statusCode: 404,
                errorType: 'resourceNotFound',
                field: 'usuarios',
                customMessage: 'Usuário não encontrado.',
            });
        }
    }

    const reservasAtrasadas = await this.repository.findReservasAtrasadas(
            equipamentoObjectId,
            new Date()
        );
        if (reservasAtrasadas.length > 0) {
            throw new CustomError({
                statusCode: 409,
                errorType: 'conflict',
                field: 'equipamento',
                customMessage: 'Equipamento ainda não devolvido de reserva anterior.',
            });
    }

    const reservasSobrepostas = await this.repository.findReservasSobrepostas(
            equipamentoObjectId,
            dataInicial,
            dataFinalAtrasada || dataFinal
    )
    ;
    if (reservasSobrepostas.length > 0) {
            throw new CustomError({
                statusCode: 409,
                errorType: 'conflict',
                field: 'equipamento',
                customMessage: 'Conflito com reservas existentes, incluindo período de atraso.',
            });
    }
    await Equipamento.findByIdAndUpdate(equipamentoObjectId, {
            $inc: { equiQuantidadeDisponivel: -quantidadeEquipamento }
    });

    const data = await this.repository.criar(parsedData);

    return data;
}

    async atualizar(id, parsedData) {
        const data = await this.repository.atualizar(id, parsedData);
        return data;
    }

    async ensureReservaExists(id) {
        const reservaExistente = await this.repository.buscarPorID(id);
        if (!reservaExistente) {
            throw new CustomError({
                statusCode: 404,
                errorType: 'resourceNotFound',
                field: 'Reserva',
                details: [],
                customMessage: 'Reserva não encontrada.',
            });
        }
        return reservaExistente;
    }

    async marcarReservasAtrasadas() {
        const currentDate = new Date();
        const reservasAtrasadas = await this.repository.findReservasParaMarcarAtrasada(currentDate);
        const reservaIds = reservasAtrasadas.map(reserva => reserva._id);
        if (reservaIds.length > 0) {
            await this.repository.marcarReservasComoAtrasadas(reservaIds);
        }
        return { message: `${reservaIds.length} reservas marcadas como atrasadas.` };
    }

}

export default ReservaService;
