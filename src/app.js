import express from "express";
import routes from "./routes/index.js";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import DbConnect from './config/DbConnect.js';
import errorHandler from './utils/helpers/errorHandler.js';
import logger from './utils/logger.js';
import CommonResponse from './utils/helpers/CommonResponse.js';
import fileUpload from 'express-fileupload';


const app = express();

// Configura o middleware express-fileupload
app.use(fileUpload({
    createParentPath: true, // Cria diretórios automaticamente se não existirem
    limits: { fileSize: 5 * 1024 * 1024 }, // Limita o tamanho do arquivo a 5MB (ajuste conforme necessário)
    abortOnLimit: true, // Aborta a requisição se o limite for excedido
    responseOnLimit: 'Tamanho do arquivo excede o limite permitido.' // Mensagem de resposta quando o limite é excedido
}));


// Conectando ao banco de dados
await DbConnect.conectar();

// Middlewares de segurança
app.use(helmet());

// Habilitando CORS
app.use(cors());

// Habilitando a compressão de respostas
app.use(compression());

// Habilitando o uso de json pelo express
app.use(express.json());

// Habilitando o uso de urlencoded pelo express
app.use(express.urlencoded({ extended: true }));

// Passando para o arquivo de rotas o app
routes(app);

// Middleware para lidar com rotas não encontradas (404)
app.use((req, res, next) => {
    return CommonResponse.error(
        res,
        404,
        'resourceNotFound',
        null,
        [{ message: 'Rota não encontrada.' }]
    );
});


app.use(errorHandler);

// Listener para erros não tratados (opcional, mas recomendado)
process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Não finalizar o processo para evitar interrupção da API
});

process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception thrown:', error);
    // Não finalizar o processo para evitar interrupção da API
    // Considerar reiniciar a aplicação em caso de exceções críticas
});

// Middleware de Tratamento de Erros (deve ser adicionado após as rotas)


// exportando para o server.js fazer uso

export default app;


// CLIENTE -> APP -> ROUTES -> CONTROLLER -> SERVICE -> REPOSITORY -> DB
