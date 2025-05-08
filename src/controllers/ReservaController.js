import ReservaService from '../services/ReservaService.js';
import { ReservaIdSchema, ReservaQuerySchema } from '../utils/validators/schemas/zod/querys/ReservaQuerySchema.js';
import { ReservaSchema, ReservaUpdateSchema } from '../utils/validators/schemas/zod/ReservaSchema.js';
import {
    CommonResponse,
    CustomError,
    HttpStatusCodes,
    errorHandler,
    messages,
    StatusService,
    asyncWrapper
} from '../utils/helpers/index.js';

class ReservaController {
    constructor() {
        this.service = new ReservaService();
    }

    async listar(req, res) {
        console.log('Estou no listar em ReservaController');

        const { id } = req.params || {};
        if (id) {
            ReservaIdSchema.parse(id);
        
            const existe = await this.service.existe(id);
            if (!existe) {
                throw new CustomError({
                    statusCode: HttpStatusCodes.NOT_FOUND.code,
                    errorType: 'notFound',
                    field: 'id',
                    details: [],
                    customMessage: 'Reserva não encontrada.'
                });
            }
        }

        const query = req.query || {};
        if (Object.keys(query).length !== 0) {
            await ReservaQuerySchema.parseAsync(query);
        }

        const data = await this.service.listar(req);
        const message = id ? 'Reserva encontrada com sucesso.' : 'Reservas listadas com sucesso.';
        return CommonResponse.success(res, { message, dados: data });
    }

    async criar(req, res) {
        console.log('Estou no criar em ReservaController');

        const parsedData = ReservaSchema.parse(req.body);
        const data = await this.service.criar(parsedData);

        const reservaLimpa = data.toObject();
        delete reservaLimpa.__v;

        return CommonResponse.created(res, { message: 'Reserva criada com sucesso.', dados: reservaLimpa });
    }

    async atualizar(req, res) {
        console.log('Estou no atualizar em ReservaController');

        const { id } = req.params;
        ReservaIdSchema.parse(id);

        const parsedData = ReservaUpdateSchema.parse(req.body);
        const data = await this.service.atualizar(id, parsedData);

        const reservaLimpa = data.toObject();
        delete reservaLimpa.__v;

        return CommonResponse.success(res, { message: 'Reserva atualizada com sucesso.', dados: reservaLimpa }, 200);
    }
}

export default ReservaController;