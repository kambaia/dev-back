import bcrypt from 'bcrypt';
import { gerarTokens } from '../utils/jwt';
import UserService from './users';
import { JwtPayload } from 'jsonwebtoken';
const userService = new UserService();

export default class AuthService {
    async login(email: string, senha: string) {
        const utilizador = await userService.findByEmail(email);

        if (!utilizador) {
            throw new Error('Utilizador não encontrado');
        }

        const senhaValida = await bcrypt.compare(senha, (utilizador as any).senhaHash);
        if (!senhaValida) {
            throw new Error('Credenciais inválidas');
        }

        const payload: JwtPayload = {
            id: utilizador.id,
            email: utilizador.email,
            perfilId: utilizador.perfil?.id,
            tipoAdmin: utilizador.tipoAdmin,
        };

        const { accessToken, refreshToken } = gerarTokens(payload);

        console.log(accessToken, refreshToken);

        // Aqui você pode salvar o refresh token em Redis, base de dados, etc.
        // await redisClient.set(`refresh:${utilizador.id}`, refreshToken, { EX: 7 * 24 * 3600 });

        return {
            utilizador,
            tokens: { accessToken, refreshToken },
        };
    }

    async logout(userId: string) {
        // Caso use Redis:
        // await redisClient.del(`refresh:${userId}`);
        return true;
    }
}
