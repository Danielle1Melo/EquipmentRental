import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

class Reserva {
    constructor(){
        const reservaSchema = new mongoose.Schema({
            dataInicial: { type: Date, required: [true, "A data inicial é obrigatória"]},
            dataFinal: { type: Date, required: true },
            dataFinalAtrasada: { type: Date, required: false },
            quantidadeEquipamento: { type: Number, required: true },
            valorEquipamento: { type: Number, required: true },
            enderecoEquipamento: { type: String, required: true },
            statusReserva: { type: String, enum: ['pendente', 'confirmada', 'cancelada'], default: 'pendente' },
            equipamentos: { type: mongoose.Schema.Types.ObjectId, ref: 'equipamento', required: true },
            usuarios: { type: mongoose.Schema.Types.ObjectId, ref: 'usuario', required: true },
        },
        {
            timestamps: true,
            versionKey: false
        }
    );

    // reservaSchema.pre('save', function (next) {
    //     if (this.dataFinal <= this.dataInicial) {
    //       return next(new Error('A data final da reserva deve ser posterior à data inicial.'));
    //     }
    //     next();
    // });


    reservaSchema.plugin(mongoosePaginate)
    this.model = mongoose.model("reservas", reservaSchema)
    }

}

export default new Reserva().model;
