import Reserva from '../models/Reserva.js';
import Equipamento from '../models/Equipamento.js';
import Usuario from '../models/Usuario.js';
import mongoose from 'mongoose';
import { CustomError } from '../utils/helpers/index.js';
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

    async listar(req) {
        const query = new ReservaFilterBuilder(req.query).build();
        const options = {
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 10,
            populate: [
                { path: 'equipamentos', select: 'equiNome' },
                { path: 'usuarios', select: 'nome' }
            ]
        };
        return await this.reservaModel.paginate(query, options);
    }

    async criar(dadosReserva) {
        try {
            return await this.reservaModel.create(dadosReserva);
        } catch (error) {
            throw new CustomError({
                statusCode: 500,
                errorType: 'databaseError',
                field: 'Reserva',
                details: [error.message],
                customMessage: 'Erro ao criar reserva.'
            });
        }
    }

    async atualizar(id, dadosReserva) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new CustomError({
                    statusCode: 400,
                    errorType: 'invalidData',
                    field: 'id',
                    customMessage: `ID inválido: ${id}`,
                });
            }
            const reserva = await this.reservaModel.findByIdAndUpdate(id, dadosReserva, { new: true });
            if (!reserva) {
                throw new CustomError({
                    statusCode: 404,
                    errorType: 'resourceNotFound',
                    field: 'Reserva',
                    customMessage: 'Reserva não encontrada.',
                });
            }
            return reserva;
        } catch (error) {
            throw error.statusCode ? error : new CustomError({
                statusCode: 500,
                errorType: 'databaseError',
                field: 'Reserva',
                details: [error.message],
                customMessage: 'Erro ao atualizar reserva.'
            });
        }
    }

    async buscarPorID(id) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new CustomError({
                    statusCode: 400,
                    errorType: 'invalidData',
                    field: 'id',
                    customMessage: `ID inválido: ${id}`,
                });
            }
            const reserva = await this.reservaModel.findById(id)
                .populate('equipamentos', 'equiNome')
                .populate('usuarios', 'nome');
            return reserva;
        } catch (error) {
            throw error.statusCode ? error : new CustomError({
                statusCode: 500,
                errorType: 'databaseError',
                field: 'Reserva',
                details: [error.message],
                customMessage: 'Erro ao buscar reserva por ID.'
            });
        }
    }

    async findReservasAtrasadas(equipamentoId, currentDate) {
        try {
            const equipamentoObjectId = new mongoose.Types.ObjectId(equipamentoId);
            return await this.reservaModel.find({
                equipamentos: equipamentoObjectId,
                statusReserva: { $in: ['pendente', 'confirmada', 'atrasada'] },
                dataFinalAtrasada: { $lt: currentDate, $ne: null }
            });
        } catch (error) {
            throw new CustomError({
                statusCode: 500,
                errorType: 'databaseError',
                field: 'Reserva',
                details: [error.message],
                customMessage: 'Erro ao buscar reservas atrasadas.'
            });
        }
    }

    async findReservasSobrepostas(equipamentoId, dataInicial, dataFinal) {
        try {
            const equipamentoObjectId = new mongoose.Types.ObjectId(equipamentoId);
            return await this.reservaModel.find({
                equipamentos: equipamentoObjectId,
                statusReserva: { $in: ['pendente', 'confirmada'] },
                $or: [
                    { dataInicial: { $lte: dataFinal }, dataFinal: { $gte: dataInicial } },
                    { dataInicial: { $lte: dataFinal }, dataFinalAtrasada: { $gte: dataInicial } },
                    { dataFinalAtrasada: { $gte: dataInicial, $lte: dataFinal } }
                ]
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

    async findReservasParaMarcarAtrasada(currentDate) {
        try {
            return await this.reservaModel.find({
                statusReserva: { $in: ['pendente', 'confirmada'] },
                dataFinal: { $lt: currentDate },
                dataFinalAtrasada: { $exists: false }
            });
        } catch (error) {
            throw new CustomError({
                statusCode: 500,
                errorType: 'databaseError',
                field: 'Reserva',
                details: [error.message],
                customMessage: 'Erro ao buscar reservas para marcar como atrasadas.'
            });
        }
    }

    async marcarReservasComoAtrasadas(reservaIds) {
        try {
            return await this.reservaModel.updateMany(
                { _id: { $in: reservaIds } },
                { $set: { statusReserva: 'atrasada' } }
            );
        } catch (error) {
            throw new CustomError({
                statusCode: 500,
                errorType: 'databaseError',
                field: 'Reserva',
                details: [error.message],
                customMessage: 'Erro ao marcar reservas como atrasadas.'
            });
        }
    }
}

export default ReservaRepository;