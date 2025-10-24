import { Request, Response } from "express";
import { GabineteRepository } from "../../repositories/user/gabinete.repository";

export class GabineteController {
    async listar(req: Request, res: Response) {
        try {
            const gabinetes = await GabineteRepository.find({
                where: { ativo: true },
                order: { nome: "ASC" },
            });
            
            return res.json({
                success: true,
                data: gabinetes,
                message: 'Gabinetes listados com sucesso'
            });
        } catch (error) {
            console.error('Erro ao listar gabinetes:', error);
            return res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'Erro interno do servidor'
            });
        }
    }

    async buscar(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const gabinete = await GabineteRepository.findOne({
                where: { id }
            });
            
            if (!gabinete) {
                return res.status(404).json({ 
                    success: false, 
                    error: "Gabinete não encontrado" 
                });
            }
            
            return res.json({
                success: true,
                data: gabinete,
                message: 'Gabinete encontrado com sucesso'
            });
        } catch (error) {
            console.error('Erro ao buscar gabinete:', error);
            return res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'Erro interno do servidor'
            });
        }
    }
}

