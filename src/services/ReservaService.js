import mongoose from 'mongoose';
import ReservaRepository from '../repository/ReservaRepository.js';
import { parse } from 'dotenv';

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


    // async ensureReservaExists(id){
    //     const reservaExistente = await this.repository.buscarPorID(id);
    //     if (!reservaExistente) {
    //         throw new CustomError({
    //             statusCode: 404,
    //             errorType: 'resourceNotFound',
    //             field: 'Reserva',
    //             details: [],
    //             customMessage: messages.error.resourceNotFound('Reserva'),
    //         });
    //     }

    //     return reservaExistente;
    // }
}

export default ReservaService;
