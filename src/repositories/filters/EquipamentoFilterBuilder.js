import EquipamentoModel from '../../models/Equipamento.js';
import mongoose from 'mongoose';

const { Types } = mongoose;

class EquipamentoFilterBuilder {
    constructor() {
        this.filtros = {};
    }

    comCategoria(categoria) {
        if (categoria) {
            this.filtros.equiCategoria = categoria; // só filtra pelo valor recebido, sem validação
        }
        return this;
    }

    comStatus(status) {
        if (typeof status === 'boolean') {
            this.filtros.equiStatus = status;
        }
        return this;
    }

    comFaixaDeValor(minValor, maxValor) {
        if (minValor !== undefined || maxValor !== undefined) {
            this.filtros.equiValorDiaria = {};
            if (minValor !== undefined) {
                this.filtros.equiValorDiaria.$gte = Number(minValor);
            }
            if (maxValor !== undefined) {
                this.filtros.equiValorDiaria.$lte = Number(maxValor);
            }
        }
        return this;
    }

    build() {
        return this.filtros;
    }
}

export default EquipamentoFilterBuilder;