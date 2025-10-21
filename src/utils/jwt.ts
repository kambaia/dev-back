import jwt, { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';
const ACCESS_TOKEN_EXP = '1h';
const REFRESH_TOKEN_EXP = '7d';

export const gerarTokens = (utilizador: JwtPayload) => {
  const payload = {
    id: utilizador.id,
    email: utilizador.email,
    perfilId: utilizador.perfil?.id,
    tipoAdmin: utilizador.tipoAdmin
  };

  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXP });
  const refreshToken = jwt.sign({ id: utilizador.id }, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXP });

  return { accessToken, refreshToken };
};
