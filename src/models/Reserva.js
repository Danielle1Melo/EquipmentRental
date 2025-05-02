import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import Usuario from './Usuario.js';
import Equipamento from './Equipamento.js';
class Reserva {
    constructor(){
        const reservaSchema = new mongoose.Schema({
            id: { type: String, required: true, unique: true },
            dataInicial: { type: Date, required: true },
            dataFinal: { type: Date, required: true },
            dataFinalAtrasada: { type: Date, required: false },
            quantidadeEquipamento: { type: Number, required: true },
            valorEquipamento: { type: Number, required: true },
            enderecoEquipamento: { type: String, required: true },
            status: { type: String, enum: ['pendente', 'confirmada', 'cancelada'], default: 'pendente' },
            pkEquipamentoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipamento', required: true },
            pkUsuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
        },
        {
            timestamps: true,
            versionKey: false
        }
    );

    reservaSchema.pre('save', function (next) {
        if (this.dataFinal <= this.dataInicial) {
          return next(new Error('A data final da reserva deve ser posterior à data inicial.'));
        }
        next();
    });


    reservaSchema.plugin(mongoosePaginate)
    this.model = mongoose.model("reserva", reservaSchema)
    }

}

export default new Reserva().model;