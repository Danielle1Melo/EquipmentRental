import mongoose from "mongoose";
import Reserva from "../../models/Reserva.js";
import Equipamento from "../../models/Equipamento.js";
import Usuario from "../../models/Usuario.js";
import { it, expect, describe, beforeAll, afterAll } from "@jest/globals";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Modelo Reserva", () => {
  let equipamentoId, usuarioId;

  beforeAll(async () => {
    const equipamento = await new Equipamento({
      nome: "Câmera",
      quantidadeDisponivel: 10,
      valor: 100,
    }).save();
    equipamentoId = equipamento._id;

    const usuario = await new Usuario({
      nome: "João Silva",
      email: "joao@example.com",
    }).save();
    usuarioId = usuario._id;
  });

  it("Deve criar uma reserva com os dados corretos", async () => {
    const reserva = new Reserva({
      dataInicial: new Date("2025-06-01"),
      dataFinal: new Date("2025-06-05"),
      quantidadeEquipamento: 2,
      valorEquipamento: 200,
      enderecoEquipamento: "Rua Exemplo, 123",
      equipamento: equipamentoId,
      usuario: usuarioId,
      status: "confirmada",
    });

    const savedReserva = await reserva.save();

    expect(savedReserva._id).toBeDefined();
    expect(savedReserva.dataInicial).toEqual(new Date("2025-06-01"));
    expect(savedReserva.dataFinal).toEqual(new Date("2025-06-05"));
    expect(savedReserva.quantidadeEquipamento).toBe(2);
    expect(savedReserva.valorEquipamento).toBe(200);
    expect(savedReserva.enderecoEquipamento).toBe("Rua Exemplo, 123");
    expect(savedReserva.status).toBe("confirmada");
    expect(savedReserva.createdAt).toBeDefined();
    expect(savedReserva.updatedAt).toBeDefined();
  });

  it("Deve retornar erro ao criar reserva sem dataInicial", async () => {
    const reserva = new Reserva({
      dataFinal: new Date("2025-06-05"),
      quantidadeEquipamento: 2,
      valorEquipamento: 200,
      enderecoEquipamento: "Rua Exemplo, 123",
      equipamento: equipamentoId,
      usuario: usuarioId,
    });

    let error;
    try {
      await reserva.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.name).toBe("ValidationError");
    expect(error.errors.dataInicial).toBeDefined();
    expect(error.errors.dataInicial.message).toBe("A data inicial é obrigatória");
  });

  it("Deve retornar erro ao criar reserva sem dataFinal", async () => {
    const reserva = new Reserva({
      dataInicial: new Date("2025-06-01"),
      quantidadeEquipamento: 2,
      valorEquipamento: 200,
      enderecoEquipamento: "Rua Exemplo, 123",
      equipamento: equipamentoId,
      usuario: usuarioId,
    });

    let error;
    try {
      await reserva.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.name).toBe("ValidationError");
    expect(error.errors.dataFinal).toBeDefined();
  });

  it("Deve criar uma reserva com status padrão 'pendente'", async () => {
    const reserva = new Reserva({
      dataInicial: new Date("2025-06-01"),
      dataFinal: new Date("2025-06-05"),
      quantidadeEquipamento: 2,
      valorEquipamento: 200,
      enderecoEquipamento: "Rua Exemplo, 123",
      equipamento: equipamentoId,
      usuario: usuarioId,
    });

    const savedReserva = await reserva.save();

    expect(savedReserva.status).toBe("pendente");
  });

  it("Deve registrar timestamps automaticamente", async () => {
    const reserva = new Reserva({
      dataInicial: new Date("2025-06-01"),
      dataFinal: new Date("2025-06-05"),
      quantidadeEquipamento: 2,
      valorEquipamento: 200,
      enderecoEquipamento: "Rua Exemplo, 123",
      equipamento: equipamentoId,
      usuario: usuarioId,
    });

    const savedReserva = await reserva.save();

    expect(savedReserva.createdAt).toBeDefined();
    expect(savedReserva.updatedAt).toBeDefined();
    expect(savedReserva.createdAt).toBeInstanceOf(Date);
    expect(savedReserva.updatedAt).toBeInstanceOf(Date);
  });

  it("Deve retornar erro ao criar reserva com quantidadeEquipamento menor ou igual a 0", async () => {
    const reserva = new Reserva({
      dataInicial: new Date("2025-06-01"),
      dataFinal: new Date("2025-06-05"),
      quantidadeEquipamento: 0,
      valorEquipamento: 200,
      enderecoEquipamento: "Rua Exemplo, 123",
      equipamento: equipamentoId,
      usuario: usuarioId,
    });

    let error;
    try {
      await reserva.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.name).toBe("ValidationError");
  });
});