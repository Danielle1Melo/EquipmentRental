// /src/utils/TokenUtil.js
import jwt from 'jsonwebtoken';

class TokenUtil {
  generateAccessToken(id) {
    return jwt.sign({ id }, process.env.JWT_SECRET_ACCESS_TOKEN, {
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION
    });
  }

  generateRefreshToken(id) {
    return jwt.sign({ id }, process.env.JWT_SECRET_REFRESH_TOKEN, {
      expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION
    });
  }
}

export default new TokenUtil();
