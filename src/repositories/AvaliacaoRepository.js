import Avaliacao from "../models/Avaliacao";
import Equipamento from "../models/Equipamento";
import Usuario from "../models/Usuario";
import mongoose from 'mongoose';
import { CustomError } from '../utils/helpers/index.js';
import AvaliacaoFilterBuilder from "./filters/AvaliacaoFilterBuilder.js";

class AvaliacaoRepository {
    constructor({
        avaliacaoModel = Avaliacao,
        equipamentoModel = Equipamento,
        usuarioModel = Usuario,
    } = {}) {
        this.avaliacaoModel = avaliacaoModel;
        this.equipamentoModel = equipamentoModel;
        this.usuarioModel = usuarioModel;
    }

    async listar(req) {
        const { equipamentoId } = req.query;

        if (!mongoose.Types.ObjectId.isValid(equipamentoId)) {
            throw new CustomError({
                statusCode: 400,
                errorType: 'invalidData',
                field: 'equipamentoId',
                customMessage: 'ID de equipamento inválido'
            });
        }

        const { filtros, ordenacao } = new AvaliacaoFilterBuilder(req.query)
            .comOrdemNota()
            .comNotaMinima()
            .comNotaMaxima()

        const query = { equipamentos: equipamentoId, ...filtros };

        const options = {
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 10,
            sort: ordenacao,
            populate: [
                { path: 'equipamentos', select: 'equiNome' },
                { path: 'usuarios', select: 'nome' }
            ]
        };

        return await this.avaliacaoModel.paginate(query, options);
    }

    async criar({ nota, descricao, usuarioId, equipamentoId }) {
        try {
            if (!mongoose.Types.ObjectId.isValid(usuarioId) || !mongoose.Types.ObjectId.isValid(equipamentoId)) {
                throw new CustomError({
                    statusCode: 400,
                    errorType: 'invalidData',
                    field: 'IDs',
                    customMessage: 'ID de usuário ou equipamento inválido.',
                });
            }

            const avaliacaoExistente = await this.avaliacaoModel.findOne({
                usuarios: usuarioId,
                equipamentos: equipamentoId,
            });

            if (avaliacaoExistente) {
                throw new CustomError({
                    statusCode: 409,
                    errorType: 'conflict',
                    field: 'avaliacao',
                    customMessage: 'Usuário já avaliou este equipamento.',
                });
            }

            const novaAvaliacao = await this.avaliacaoModel.create({
                nota,
                descricao,
                usuarios: usuarioId,
                equipamentos: equipamentoId,
            });

            await this.equipamentoModel.findByIdAndUpdate(equipamentoId, {
                $push: { equiAvaliacoes: novaAvaliacao._id },
            });

            await this.recalcularMedia(equipamentoId);

            return novaAvaliacao;
        } catch (error) {
            throw error.statusCode ? error : new CustomError({
                statusCode: 500,
                errorType: 'databaseError',
                field: 'Avaliacao',
                details: [error.message],
                customMessage: 'Erro ao criar avaliação.'
            });
        }
    }

    async recalcularMedia(equipamentoId) {
        const equipamento = await this.equipamentoModel
            .findById(equipamentoId)
            .populate('equiAvaliacoes');

        if (!equipamento) return;

        const notas = equipamento.equiAvaliacoes.map(av => av.nota);
        const media = notas.length ? notas.reduce((a, b) => a + b, 0) / notas.length : 0;

        await this.equipamentoModel.findByIdAndUpdate(equipamentoId, {
            equiNotaMediaAvaliacao: media.toFixed(1),
        });
    }

    async verificarSeJaAvaliou(usuarioId, equipamentoId) {
        return this.avaliacaoModel.exists({
            usuarios: usuarioId,
            equipamentos: equipamentoId,
        });
    }

    async atualizar(avaliacaoId, usuarioId, { nota, descricao }) {
        try {
            if (!mongoose.Types.ObjectId.isValid(avaliacaoId) || !mongoose.Types.ObjectId.isValid(usuarioId)) {
                throw new CustomError({
                    statusCode: 400,
                    errorType: 'invalidData',
                    field: 'IDs',
                    customMessage: 'ID inválido.',
                });
            }

            const avaliacao = await this.avaliacaoModel.findById(avaliacaoId);
            if (!avaliacao) {
                throw new CustomError({
                    statusCode: 404,
                    errorType: 'resourceNotFound',
                    field: 'Avaliacao',
                    customMessage: 'Avaliação não encontrada.',
                });
            }

            if (avaliacao.usuarios.toString() !== usuarioId) {
                throw new CustomError({
                    statusCode: 403,
                    errorType: 'unauthorized',
                    field: 'Avaliacao',
                    customMessage: 'Você só pode editar suas próprias avaliações.',
                });
            }

            avaliacao.nota = nota ?? avaliacao.nota;
            avaliacao.descricao = descricao ?? avaliacao.descricao;
            await avaliacao.save();

            await this.recalcularMedia(avaliacao.equipamentos);

            return avaliacao;
        } catch (error) {
            throw error.statusCode ? error : new CustomError({
                statusCode: 500,
                errorType: 'databaseError',
                field: 'Avaliacao',
                details: [error.message],
                customMessage: 'Erro ao atualizar avaliação.'
            });
        }
    }
    async remover(avaliacaoId, usuarioId) {
        try {
            if (!mongoose.Types.ObjectId.isValid(avaliacaoId) || !mongoose.Types.ObjectId.isValid(usuarioId)) {
                throw new CustomError({
                    statusCode: 400,
                    errorType: 'invalidData',
                    field: 'IDs',
                    customMessage: 'ID inválido.',
                });
            }

            const usuario = await this.usuarioModel.findById(usuarioId);
            if (!usuario || usuario.tipoUsuario !== 'admin') {
                throw new CustomError({
                    statusCode: 403,
                    errorType: 'unauthorized',
                    field: 'Usuario',
                    customMessage: 'Apenas administradores podem remover avaliações.',
                });
            }

            const avaliacao = await this.avaliacaoModel.findById(avaliacaoId);
            if (!avaliacao) {
                throw new CustomError({
                    statusCode: 404,
                    errorType: 'resourceNotFound',
                    field: 'Avaliacao',
                    customMessage: 'Avaliação não encontrada.',
                });
            }

            await this.equipamentoModel.findByIdAndUpdate(avaliacao.equipamentos, {
                $pull: { equiAvaliacoes: avaliacao._id },
            });

            await this.avaliacaoModel.findByIdAndDelete(avaliacaoId);
            await this.recalcularMedia(avaliacao.equipamentos);

            return { success: true, message: 'Avaliação removida com sucesso.' };
        } catch (error) {
            throw error.statusCode ? error : new CustomError({
                statusCode: 500,
                errorType: 'databaseError',
                field: 'Avaliacao',
                details: [error.message],
                customMessage: 'Erro ao remover avaliação.'
            });
        }
    }
}

export default AvaliacaoRepository;