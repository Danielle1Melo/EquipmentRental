import mongoose from 'mongoose';
import ReservaRepository from '../repository/ReservaRepository.js';
import CustomError from '../utils/helpers/CustomError.js'
import { parse } from 'dotenv';
import Equipamento from '../models/Equipamento.js';

class ReservaService {
    constructor() {
        this.repository = new ReservaRepository();
    }


    async listar(req) {
        console.log("Estou no ReservaService");
        const data = await this.repository.listar(req);
        console.log('Estou retornando os dados em ReservaService para o controller');
        return data;
    }

    async criar(parsedData) {
        console.log("Estou em criar no ReservaService")

        //chama o repositório
        const { dataInicial, dataFinal, dataFinalAtrasada, quantidadeEquipamento, equipamento } = parsedData;

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

        const dataAtual = new Date();
        if (dataInicial < dataAtual) {
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

        if (!equipamento || !equipamento.length) {
            throw new CustomError({
                statusCode: 400,
                errorType: 'invalidData',
                field: 'equipamento',
                details: [],
                customMessage: 'Pelo menos um equipamento deve ser especificado.',
            });
        }

        const equipamentoId = equipamento; //Assumindo equipamento único para simplificar

        if (!mongoose.Types.ObjectId.isValid(equipamentoId)) {
            throw new CustomError({
                statusCode: 400,
                errorType: 'invalidData',
                field: 'equipamento',
                details: [],
                customMessage: `ID de equipamento inválido: ${equipamentoId}`,
            });
        }
        const equipamentoObjectId = new mongoose.Types.ObjectId(equipamentoId);
        const equipamentoDoc = await Equipamento.findById(equipamentoObjectId);
        if (!equipamentoDoc) {
            throw new CustomError({
                statusCode: 404,
                errorType: 'resourceNotFound',
                field: 'equipamento',
                details: [],
                customMessage: 'Equipamento não encontrado.',
            });
        }

        if (equipamentoDoc.quantidadeDisponivel < quantidadeEquipamento) {
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
        console.log('Estou no atualizar em ReservaService');

        // Garante que a reserva existe
        //await this.ensureReservaExists(id);

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
