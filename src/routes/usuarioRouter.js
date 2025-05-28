import express from "express"
import { asyncWrapper } from "../utils/helpers/index.js"
import UsuarioController from "../controllers/UsuarioController.js"

const router = express.Router()

const usuarioController = new UsuarioController()

router
    .get("/usuarios", asyncWrapper(usuarioController.listar.bind(usuarioController)))
    .get("/usuarios/:id", asyncWrapper(usuarioController.listar.bind(usuarioController)))
    .patch("/usuarios/:id",asyncWrapper(usuarioController.updateUsuario.bind(usuarioController)))
    .post("/usuarios", asyncWrapper(usuarioController.cadastrarUsuario.bind(usuarioController)))
export default router