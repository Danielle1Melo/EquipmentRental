import Reserva from "../../models/Reserva.js";
import ReservaRepository from "../ReservaRepository.js";

class ReservaFilterBuilder{
    constructor(){
        this.filtros = {};
        this.reservaRepository = new ReservaRepository();
        this.reservaModel = new Reserva();
    }

    comDataInicial(dataInicial) {
        if (dataInicial && !isNaN(Date.parse(dataInicial))) {
          this.filtros.dataInicial = { $gte: new Date(dataInicial) };
        }
        return this;
      }
    
      comDataFinal(dataFinal) {
        if (dataFinal && !isNaN(Date.parse(dataFinal))) {
          this.filtros.dataFinal = { $lte: new Date(dataFinal) }; // Corrigido para $lte
        }
        return this;
      }

    comDataFinalAtrasada(dataFinalAtrasada){
        if(dataFinalAtrasada && !isNaN(Date.parse(dataFinalAtrasada))){
            this.filtros.dataFinalAtrasada = { $lt: new Date(dataFinalAtrasada) }
        }
        return this;
    }

    comQuantidadeEquipamento(quantidadeEquipamento){
        if (quantidadeEquipamento) {
            const parsed = parseInt(quantidadeEquipamento, 10);
            if (!isNaN(parsed)) {
                this.filtros.quantidadeEquipamento = parsed;
            }
        }
        return this;
    }

    comValorEquipamento(valorEquipamento){
        if (valorEquipamento) {
            const parsed = parseFloat(valorEquipamento);
            if (!isNaN(parsed)) {
                this.filtros.valorEquipamento = parsed;
            }
        }
        return this;
    }

    comEnderecoEquipamento(enderecoEquipamento){
        if(enderecoEquipamento){
            this.filtros.enderecoEquipamento = { $regex: enderecoEquipamento, $options: 'i'}
        }
        return this;
    }

    comStatus(statusReserva){
        if(statusReserva){
            this.filtros.statusReserva = { $regex: statusReserva, $options: 'i'}
        }
        return this;
    }

    escapeRegex(texto) {
        return texto.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
    }

    build(){
        return this.filtros;
    }
}

export default ReservaFilterBuilder;