import Reserva from '../models/Reserva.js';
import Equipamento from "../models/Equipamento.js"
import Usuario from "../models/Usuario.js"
import mongoose from 'mongoose';
import { CommonResponse, CustomError, HttpStatusCodes, errorHandler, messages, StatusService, asyncWrapper } from '../utils/helpers/index.js';

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

        if(id) {
            const data = await this.reservaModel.findById(id);

            if (!data) {
                throw new CustomError({
                    statusCode: 404,
                    errorType: 'resourceNotFound',
                    field: 'Reserva',
                    details: [],
                    customMessage: messages.error.resourceNotFound('Reserva')
                });
            }

            return Reserva.findById(id);
        }

        return Reserva.find()
    }

    async criar(dadosReserva){
        const reserva = new this.reservaModel(dadosReserva);
        return await reserva.save()
    }

    async atualizar(id, parsedData) {
        const reserva = await this.reservaModel.findByIdAndUpdate(id, parsedData, { new: true });

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

}

export default ReservaRepository;
