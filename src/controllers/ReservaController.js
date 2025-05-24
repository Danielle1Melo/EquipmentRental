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
import { ReservaIdSchema, ReservaQuerySchema } from '../utils/validators/schemas/zod/querys/ReservaQuerySchema.js';

class ReservaController {
    constructor() {
        this.service = new ReservaService();
    }

    async listar(req, res) {
        console.log('Estou no listar em ReservaController');
        console.log('req.query:', req.query);
        console.log('req.params:', req.params);
        console.log('typeof req.query:', typeof req.query);
        console.log('Object.keys(req.query):', Object.keys(req.query || {}));

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
        console.log('Estou no criar em ReservaController');

        let data = await this.service.criar(req.body);

        let reservaLimpa = data.toObject();

        return CommonResponse.created(res, reservaLimpa);
    }

    async atualizar(req, res) {
        console.log('Estou no atualizar em ReservaController');

        const { id } = req.params;
        ReservaIdSchema.parse(id);

        // const parsedData = UsuarioUpdateSchema.parse(req.body);
        const parsedData = req.body;

        const data = await this.service.atualizar(id, parsedData);


        return CommonResponse.success(res, data, 200, 'Reserva atualizada com sucesso.');
    }

}

export default ReservaController;
