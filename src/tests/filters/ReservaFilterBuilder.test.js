import ReservaFilterBuilder from "../../repositories/filters/ReservaFilterBuilder";
import Reserva from "../../models/Reserva";
jest.mock("../../models/Reserva");

describe('ReservaFilterBuilder', () => {
  let reservaFilterBuilder;
  
  beforeEach(() => {
    reservaFilterBuilder = new ReservaFilterBuilder();
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('comDataInicial', () => {
    it('deve setar filtro de dataInicial quando data válida é fornecida', () => {
      const testDate = '2023-01-01';
      reservaFilterBuilder.comDataInicial(testDate);
      const filtros = reservaFilterBuilder.build();
      
      expect(filtros).toHaveProperty('dataInicial');
      expect(filtros.dataInicial).toEqual({ $gte: new Date(testDate) });
    });

    it('não deve setar filtro de dataInicial quando data inválida é fornecida', () => {
      reservaFilterBuilder.comDataInicial('invalid-date');
      const filtros = reservaFilterBuilder.build();
      
      expect(filtros).not.toHaveProperty('dataInicial');
    });

    it('não deve setar filtro de dataInicial quando vazio ou undefined', () => {
      reservaFilterBuilder.comDataInicial('');
      reservaFilterBuilder.comDataInicial(undefined);
      const filtros = reservaFilterBuilder.build();
      
      expect(filtros).not.toHaveProperty('dataInicial');
    });
  });

  describe('comDataFinal', () => {
    it('deve setar filtro de dataFinal quando data válida é fornecida', () => {
      const testDate = '2023-01-01';
      reservaFilterBuilder.comDataFinal(testDate);
      const filtros = reservaFilterBuilder.build();
      
      expect(filtros).toHaveProperty('dataFinal');
      expect(filtros.dataFinal).toEqual({ $lte: new Date(testDate) });
    });

    it('não deve setar filtro de dataFinal quando data inválida é fornecida', () => {
      reservaFilterBuilder.comDataFinal('invalid-date');
      const filtros = reservaFilterBuilder.build();
      
      expect(filtros).not.toHaveProperty('dataFinal');
    });

    it('não deve setar filtro de dataFinal quando vazio ou undefined', () => {
      reservaFilterBuilder.comDataFinal('');
      reservaFilterBuilder.comDataFinal(undefined);
      const filtros = reservaFilterBuilder.build();
      
      expect(filtros).not.toHaveProperty('dataFinal');
    });
  });

  describe('comDataFinalAtrasada', () => {
    it('deve setar filtro de dataFinalAtrasada quando data válida é fornecida', () => {
      const testDate = '2023-01-01';
      reservaFilterBuilder.comDataFinalAtrasada(testDate);
      const filtros = reservaFilterBuilder.build();
      
      expect(filtros).toHaveProperty('dataFinalAtrasada');
      expect(filtros.dataFinalAtrasada).toEqual({ $lt: new Date(testDate) });
    });

    it('não deve setar filtro de dataFinalAtrasada quando data inválida é fornecida', () => {
      reservaFilterBuilder.comDataFinalAtrasada('invalid-date');
      const filtros = reservaFilterBuilder.build();
      
      expect(filtros).not.toHaveProperty('dataFinalAtrasada');
    });

    it('não deve setar filtro de dataFinalAtrasada quando vazio ou undefined', () => {
      reservaFilterBuilder.comDataFinalAtrasada('');
      reservaFilterBuilder.comDataFinalAtrasada(undefined);
      const filtros = reservaFilterBuilder.build();
      
      expect(filtros).not.toHaveProperty('dataFinalAtrasada');
    });
  });

  describe('comQuantidadeEquipamento', () => {
    it('deve setar filtro de quantidadeEquipamento quando valor numérico é fornecido', () => {
      reservaFilterBuilder.comQuantidadeEquipamento('5');
      const filtros = reservaFilterBuilder.build();
      
      expect(filtros).toHaveProperty('quantidadeEquipamento');
      expect(filtros.quantidadeEquipamento).toBe(5);
    });

    it('não deve setar filtro de quantidadeEquipamento quando valor não numérico é fornecido', () => {
      reservaFilterBuilder.comQuantidadeEquipamento('a');
      const filtros = reservaFilterBuilder.build();
      
      expect(filtros).not.toHaveProperty('quantidadeEquipamento');
    });

    it('não deve setar filtro de quantidadeEquipamento quando vazio ou undefined', () => {
      reservaFilterBuilder.comQuantidadeEquipamento('');
      reservaFilterBuilder.comQuantidadeEquipamento(undefined);
      const filtros = reservaFilterBuilder.build();
      
      expect(filtros).not.toHaveProperty('quantidadeEquipamento');
    });
  });

  describe('comValorEquipamento', () => {
    it('deve setar filtro de valorEquipamento quando valor numérico é fornecido', () => {
      reservaFilterBuilder.comValorEquipamento('100.50');
      const filtros = reservaFilterBuilder.build();
      
      expect(filtros).toHaveProperty('valorEquipamento');
      expect(filtros.valorEquipamento).toBe(100.50);
    });

    it('não deve setar filtro de valorEquipamento quando valor não numérico é fornecido', () => {
      reservaFilterBuilder.comValorEquipamento('abc');
      const filtros = reservaFilterBuilder.build();
      
      expect(filtros).not.toHaveProperty('valorEquipamento');
    });

    it('não deve setar filtro de valorEquipamento quando vazio ou undefined', () => {
      reservaFilterBuilder.comValorEquipamento('');
      reservaFilterBuilder.comValorEquipamento(undefined);
      const filtros = reservaFilterBuilder.build();
      
      expect(filtros).not.toHaveProperty('valorEquipamento');
    });
  });

  describe('comEnderecoEquipamento', () => {
    it('deve setar filtro de enderecoEquipamento quando valor é fornecido', () => {
      reservaFilterBuilder.comEnderecoEquipamento('Rua Teste');
      const filtros = reservaFilterBuilder.build();
      
      expect(filtros).toHaveProperty('enderecoEquipamento');
      expect(filtros.enderecoEquipamento).toEqual({
        $regex: 'Rua Teste',
        $options: 'i'
      });
    });

    it('não deve setar filtro de enderecoEquipamento quando vazio ou undefined', () => {
      reservaFilterBuilder.comEnderecoEquipamento('');
      reservaFilterBuilder.comEnderecoEquipamento(undefined);
      const filtros = reservaFilterBuilder.build();
      
      expect(filtros).not.toHaveProperty('enderecoEquipamento');
    });
  });

  describe('comStatus', () => {
    it('deve setar filtro de statusReserva quando valor é fornecido', () => {
      reservaFilterBuilder.comStatus('pendente');
      const filtros = reservaFilterBuilder.build();
      
      expect(filtros).toHaveProperty('statusReserva');
      expect(filtros.statusReserva).toEqual({
        $regex: 'pendente',
        $options: 'i'
      });
    });

    it('não deve setar filtro de statusReserva quando vazio ou undefined', () => {
      reservaFilterBuilder.comStatus('');
      reservaFilterBuilder.comStatus(undefined);
      const filtros = reservaFilterBuilder.build();
      
      expect(filtros).not.toHaveProperty('statusReserva');
    });
  });

  describe('build', () => {
    it('deve retornar objeto de filtros vazio quando nenhum filtro é adicionado', () => {
      const filtros = reservaFilterBuilder.build();
      expect(filtros).toEqual({});
    });

    it('deve retornar objeto de filtros com todos os filtros adicionados', () => {
      const testDate = '2023-01-01';
      
      reservaFilterBuilder
        .comDataInicial(testDate)
        .comDataFinal(testDate)
        .comQuantidadeEquipamento('2')
        .comStatus('pendente');
      
      const filtros = reservaFilterBuilder.build();
      
      expect(filtros).toEqual({
        dataInicial: { $gte: new Date(testDate) },
        dataFinal: { $lte: new Date(testDate) },
        quantidadeEquipamento: 2,
        statusReserva: { $regex: 'pendente', $options: 'i' }
      });
    });
  });

  describe('escapeRegex', () => {
    it('deve escapar caracteres especiais de regex', () => {
      const testString = 'test.*+?^${}()|[]\\';
      const escaped = reservaFilterBuilder.escapeRegex(testString);
      
      expect(escaped).toBe('test\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\');
    });

    it('deve retornar string vazia quando input é vazio', () => {
      const escaped = reservaFilterBuilder.escapeRegex('');
      expect(escaped).toBe('');
    });
  });
});
