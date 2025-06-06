// middlewares/AuthPermission.js
import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import { CustomError, errorHandler, messages } from '../utils/helpers/index.js';
import AuthService from '../services/AuthService.js';
// Certifique-se de que as variáveis de ambiente estejam carregadas
const JWT_SECRET = process.env.JWT_SECRET_ACCESS_TOKEN;

class AuthPermission {
  constructor() {
    this.jwt = jwt;
    this.JWT_SECRET = JWT_SECRET;
    this.messages = messages;
    this.service = new AuthService();


    // Vincula o método handle ao contexto da instância
    this.handle = this.handle.bind(this);
  }

  async handle(req, res, next) {
    try {
      // 1. Extrai o token do cabeçalho Authorization
      const authHeader = req.headers.authorization;

      const [scheme, token] = authHeader.split(' ');
      const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET_ACCESS_TOKEN);
      console.log("Passou por aqui")
      if (!decoded) { // Se não ocorrer a decodificação do token
        throw new TokenExpiredError("O token JWT está expirado!");
      }
      const tokenData = await this.service.carregatokens(decoded.id);
      // console.log("AQUIIIIIII",tokenData?.data?.refreshToken)
      if (!tokenData?.data?.refreshToken) {
        throw new CustomError({
          statusCode: 401,
          errorType: 'unauthorized',
          field: 'Token',
          details: [],
          customMessage: 'Refresh token inválido, autentique novamente!'
        });
      }
      console.log(tokenData.data.tipoUsuario)
      if(tokenData?.data?.tipoUsuario !== "admin"){
        throw new CustomError({
          statusCode: 401,
          errorType: 'unauthorized',
          field: 'Token',
          details: [],
          customMessage: 'Somente administradores tem acesso'
        });
      }
      // 9. Permite a continuação da requisição
      next();
    } catch (error) {
      // Utilize o handler de erros personalizado
      errorHandler(error, req, res, next);
    }
  }
}

// Instanciar e exportar apenas o método 'handle' como função de middleware
export default new AuthPermission().handle;
