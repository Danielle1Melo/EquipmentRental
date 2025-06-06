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

        let equipamentoDoc = null;
        if (equipamentos) {
            if (!mongoose.Types.ObjectId.isValid(equipamentos)) {
                throw new CustomError({
                    statusCode: 400,
                    errorType: 'invalidData',
                    field: 'equipamentos',
                    customMessage: `ID de equipamento inválido: ${equipamentos}`,
                });
            }
            const equipamentoObjectId = new mongoose.Types.ObjectId(equipamentos);
            equipamentoDoc = await Equipamento.findById(equipamentoObjectId);
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
            if (quantidadeEquipamento && equipamentoDoc.equiQuantidadeDisponivel < quantidadeEquipamento) {
                throw new CustomError({
                    statusCode: 400,
                    errorType: 'invalidData',
                    field: 'quantidadeEquipamento',
                    customMessage: 'Quantidade solicitada excede a quantidade disponível do equipamento.',
                });
            }
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
