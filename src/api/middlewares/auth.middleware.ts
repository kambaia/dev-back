import { Request, Response, NextFunction } from 'express';
import UserService from '../../services/users';

const userService = new UserService();

export const checkPermission = (modulo: string, acao: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Em produção, isso viria do token JWT
            const userId = (req as any).user?.id;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    error: 'Não autenticado'
                });
            }

            const permissoes = await userService.obterPermissoesUtilizador(userId);
            const requiredPermission = `${modulo}.${acao}`;

            const hasPermission = permissoes.permissoes.includes(requiredPermission) ||
                permissoes.resumo.isAdmin;

            if (!hasPermission) {
                return res.status(403).json({
                    success: false,
                    error: 'Não tem permissão para realizar esta ação'
                });
            }

            next();
        } catch (error) {
            res.status(500).json({
                success: false,
                error: 'Erro ao verificar permissões'
            });
        }
    };
};
