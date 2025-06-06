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

        if (dataInicial >= dataFinal) {
            throw new CustomError({
                statusCode: 400,
                errorType: 'invalidData',
                field: 'dataInicial',
                details: [],
                customMessage: 'A data inicial deve ser anterior à data final.',
            });
        }
        if (dataFinalAtrasada <= dataFinal) {
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

        console.log(dataZerada);
        if (dataInicial < dataZerada) {
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

        if (!equipamentos || !equipamentos.length) {
            throw new CustomError({
                statusCode: 400,
                errorType: 'invalidData',
                field: 'equipamentos',
                details: [],
                customMessage: 'Pelo menos um equipamento deve ser especificado.',
            });
        }

        if (!usuarios || !usuarios.length) {
            throw new CustomError({
                statusCode: 400,
                errorType: 'invalidData',
                field: 'usuarios',
                details: [],
                customMessage: 'Pelo menos um usuário deve ser especificado.',
            });
        }

        const equipamentoId = equipamentos;
        const usuariosId = usuarios;
        
        if (!mongoose.Types.ObjectId.isValid(equipamentoId)) {
            throw new CustomError({
                statusCode: 400,
                errorType: 'invalidData',
                field: 'equipamentos',
                details: [],
                customMessage: `ID de equipamento inválido: ${equipamentoId}`,
            });
        }

        if (!mongoose.Types.ObjectId.isValid(usuariosId)) {
            throw new CustomError({
                statusCode: 400,
                errorType: 'invalidData',
                field: 'usuarios',
                details: [],
                customMessage: `ID de usuário inválido: ${usuariosId}`,
            });
        }
        const equipamentoObjectId = new mongoose.Types.ObjectId(equipamentoId);
        const equipamentoDoc = await Equipamento.findById(equipamentoObjectId);
        if (!equipamentoDoc) {
            throw new CustomError({
                statusCode: 404,
                errorType: 'resourceNotFound',
                field: 'equipamentos',
                details: [],
                customMessage: 'Equipamento não encontrado.',
            });
        }

        const usuarioObjectId = new mongoose.Types.ObjectId(usuariosId);
        const usuarioDoc = await Usuario.findById(usuarioObjectId);
        if (!usuarioDoc) {
            throw new CustomError({
                statusCode: 404,
                errorType: 'resourceNotFound',
                field: 'usuarios',
                details: [],
                customMessage: 'Usuário não encontrado.',
            });
        }

        if (equipamentoDoc.equiQuantidadeDisponivel < quantidadeEquipamento) {
            throw new CustomError({
                statusCode: 400,
                errorType: 'invalidData',
                field: 'quantidadeEquipamento',
                details: [],
                customMessage: 'Quantidade solicitada excede a quantidade disponível do equipamento.',
            });
        }

        const reservasSobrepostas = await this.repository.findReservasSobrepostas(
            equipamentoId,
            dataInicial,
            dataFinal
        );

        if (reservasSobrepostas.length > 0) {
            throw new CustomError({
                statusCode: 409,
                errorType: 'conflict',
                field: 'equipamento',
                details: [],
                customMessage: 'Já existe uma reserva para este equipamento no período solicitado.',
            });
        }


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

}

export default ReservaService;
