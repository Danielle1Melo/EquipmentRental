import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

class Reserva {
    constructor(){
        const reservaSchema = new mongoose.Schema({
            dataInicial: { type: Date, required: [true, "A data inicial é obrigatória"]},
            dataFinal: { type: Date, required: true },
            dataFinalAtrasada: { type: Date },
            quantidadeEquipamento: { type: Number, required: true, min: [1, "A quantidade de equipamento deve ser no mínimo 1"] },
            valorEquipamento: { type: Number, required: true },
            enderecoEquipamento: { type: String, required: true },
            statusReserva: { type: String, enum: ['pendente', 'confirmada', 'cancelada', 'finalizada'], default: 'pendente' },
            equipamentos: { type: mongoose.Schema.Types.ObjectId, ref: 'equipamentos', required: true },
            usuarios: { type: mongoose.Schema.Types.ObjectId, ref: 'usuarios', required: true },
        },
        {
            timestamps: true,
            versionKey: false
        }
    );

    reservaSchema.plugin(mongoosePaginate)
    this.model = mongoose.model("reservas", reservaSchema)
    }

}

export default new Reserva().model;
