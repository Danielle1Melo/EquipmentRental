import express from "express";
// import swaggerJsDoc from "swagger-jsdoc";
// import swaggerUI from "swagger-ui-express";
// import getSwaggerOptions from "../docs/config/head.js";
import logRoutes from "../middlewares/LogRoutesMiddleware.js";
import dotenv from "dotenv";

import reserva from "./reservaRoutes.js"
import equipamentoRoutes from "./equipamentoRoutes.js";
import { equipamentoSchema } from "../utils/validators/schemas/zod/EquipamentoSchema.js";


dotenv.config();

const routes = (app) => {
    if (process.env.DEBUGLOG) {
        app.use(logRoutes);
    }
    // rota para encaminhar da raiz para /docs
    app.get("/", (req, res) => {
        res.redirect("/docs");
    }
    );

    //configurando swagger e criando a rota /docs
    // const swaggerDocs = swaggerJsDoc(getSwaggerOptions());
    // app.use(swaggerUI.serve);
    // app.get("/docs", (req, res, next) => {
    //     swaggerUI.setup(swaggerDocs)(req, res, next);
    // });

    app.use(express.json(),
        reserva,
        equipamentoRoutes
    );

    // Se não é nenhuma rota válida, produz 404
    app.use((req, res) => {
        res.status(404).json({ message: "Rota não encontrada" });
    });
};

export default routes;