import ReservaService from '../services/ReservaService.js';
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
import { ReservaIdSchema, ReservaQuerySchema } from '../utils/validators/schemas/zod/querys/ReservaQuerySchema.js';

class ReservaController {
    constructor() {
        this.service = new ReservaService();
    }

    async listar(req, res) {
        const { id } = req.params || {};
        if (id) {
            ReservaIdSchema.parse(id);
        }

        const query = Object.keys(req.query || {}).length !== 0 
        ? await ReservaQuerySchema.parseAsync(req.query)
        : {};

        const data = await this.service.listar(req);
        const message = id ? 'Reserva encontrada com sucesso.' : 'Reservas listadas com sucesso.';
        return CommonResponse.success(res, { message, dados: data });
    }

    async criar(req, res) {

        let data = await this.service.criar(req.body);

        let reservaLimpa = data.toObject();

        return CommonResponse.created(res, reservaLimpa);
    }

    async atualizar(req, res) {

        const { id } = req.params;
        ReservaIdSchema.parse(id);

        // const parsedData = UsuarioUpdateSchema.parse(req.body);
        const parsedData = req.body;

        const data = await this.service.atualizar(id, parsedData);

        return CommonResponse.success(res, data, 200, 'Reserva atualizada com sucesso.');
    }

}

export default ReservaController;
