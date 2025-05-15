import ReservaService from '../service/ReservaService.js';
import mongoose from 'mongoose';

import {
    CommonResponse,
    CustomError,
    HttpStatusCodes,
    errorHandler,
    messages,
    StatusService,
    asyncWrapper
} from '../utils/helpers/index.js';
import { UsuarioIdSchema } from '../utils/validators/schemas/zod/querys/UsuarioQuerySchema.js';

class ReservaController {
    constructor() {
        this.service = new ReservaService();
    }

    async listar(req, res) {
        console.log('Estou no listar em ReservaController');

        const { id } = req.params || {};
        if (id) {
            UsuarioIdSchema.parse(id);
        }

        const data = await this.service.listar(req);
        const message = id ? 'Reserva encontrada com sucesso.' : 'Reservas listadas com sucesso.';
        return CommonResponse.success(res, { message, dados: data });
    }

    async criar(req, res) {
        console.log('Estou no criar em ReservaController');

        let data = await this.service.criar(req.body);

        let reservaLimpa = data.toObject();

        return CommonResponse.created(res, reservaLimpa);
    }

    async atualizar(req, res) {
        console.log('Estou no atualizar em ReservaController');

        const { id } = req.params;
        UsuarioIdSchema.parse(id);

        // const parsedData = UsuarioUpdateSchema.parse(req.body);
        const parsedData = req.body;

        const data = await this.service.atualizar(id, parsedData);


        return CommonResponse.success(res, data, 200, 'Usuário atualizado com sucesso.');
    }

}

export default ReservaController;