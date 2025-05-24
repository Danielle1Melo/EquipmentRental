import Reserva from '../models/Reserva.js';
import Equipamento from "../models/Equipamento.js"
import Usuario from "../models/Usuario.js"
import mongoose from 'mongoose';
import { CommonResponse, CustomError, HttpStatusCodes, errorHandler, messages, StatusService, asyncWrapper } from '../utils/helpers/index.js';
import ReservaFilterBuilder from './filters/ReservaFilterBuilder.js';

class ReservaRepository {
    constructor({
        reservaModel = Reserva,
        equipamentoModel = Equipamento,
        usuarioModel = Usuario,
    } = {}) {
        this.reservaModel = reservaModel;
        this.equipamentoModel = equipamentoModel;
        this.usuarioModel = usuarioModel;
    }


    // async buscarPorID(id, includeTokens = false) {
    //     let query = this.reservaModel.findOne(id);

    //     if (includeTokens) {
    //         query = query.select('+refreshtoken +accesstoken');
    //     }

    //     const user = await query;

    //     if (!user) {
    //         throw new CustomError({
    //             statusCode: 404,
    //             errorType: 'resourceNotFound',
    //             field: 'Reserva',
    //             details: [],
    //             customMessage: messages.error.resourceNotFound('Reserva')
    //         });
    //     }
    // } 



    async listar(req) {
        const { id } = req.params;

        if (id) {
            const data = await this.reservaModel
                .findById(id)
                .populate([
                    { path: 'equipamentos', select: 'nome' },
                    { path: 'usuarios', select: 'nome' }
                ]);

            if (!data) {
                throw new CustomError({
                    statusCode: 404,
                    errorType: 'resourceNotFound',
                    field: 'Reserva',
                    details: [],
                    customMessage: messages.error.resourceNotFound('Reserva')
                });
            }

            return data;
        }

        const { dataInicial, dataFinal, dataFinalAtrasada, quantidadeEquipamento, valorEquipamento, enderecoEquipamento, statusReserva} = req.query
        const limite = Math.min(parseInt(req.query.limite, 10) || 10, 100)
        const page = parseInt(req.query.page, 10) || 1;

        const filterBuild = new ReservaFilterBuilder()
            .comDataInicial(dataInicial || '')
            .comDataFinal(dataFinal || '')
            .comDataFinalAtrasada(dataFinalAtrasada || '')
            .comQuantidadeEquipamento(quantidadeEquipamento || '')
            .comValorEquipamento(valorEquipamento || '')
            .comEnderecoEquipamento(enderecoEquipamento || '')
            .comStatus(statusReserva || '')

        if(typeof filterBuild.build !== 'function') {
            throw new CustomError({
                statusCode: 500,
                errorType: 'internalServerError',
                field: 'Reserva',
                details: [],
                customMessage: messages.error.internalServerError("Reserva")
            });
        }

        const filtros = filterBuild.build();

        const options = {
            page: parseInt(page, 10),
            limit: parseInt(limite, 10),
            sort: { nome: 1 },
        };

        const resultado = await this.reservaModel.paginate(filtros, options);

        resultado.docs = resultado.docs.map(doc => {
            const reservaObj = typeof doc.toObject === 'function' ? doc.toObject() : doc;
            return reservaObj;
        });

        return resultado;

        // return this.reservaModel
        //     .find()
        //     .populate([
        //         { path: 'equipamentos', select: 'nome' },
        //         { path: 'usuarios', select: 'nome' },
        //     ]);
    }

    async criar(dadosReserva) {
        const reserva = new this.reservaModel(dadosReserva);
        return await reserva.save()
    }

    async atualizar(id, parsedData) {
        const reserva = await this.reservaModel
            .findByIdAndUpdate(id, parsedData, { new: true })

        if (!reserva) {
            throw new CustomError({
                statusCode: 404,
                errorType: 'resourceNotFound',
                field: 'Reserva',
                details: [],
                customMessage: messages.error.resourceNotFound('Reserva')
            });
        }

        return reserva;
    }

    async findReservasSobrepostas(equipamentoId, dataInicial, dataFinal) {
        try {
            return await this.reservaModel.find({
                equipamento: { $in: [equipamentoId] }, // Suporta array de equipamentos
                dataInicial: { $lte: dataFinal },
                dataFinal: { $gte: dataInicial },
            });
        } catch (error) {
            throw new CustomError({
                statusCode: 500,
                errorType: 'databaseError',
                field: 'Reserva',
                details: [error.message],
                customMessage: 'Erro ao buscar reservas sobrepostas.'
            });
        }
    }

}

export default ReservaRepository;
