import { Request, Response } from "express";
import { DirecaoRepository } from "../../repositories/user/direcao.repository";

export class DirecaoController {
    async listar(req: Request, res: Response) {
        try {
            const direcoes = await DirecaoRepository.find({
                where: { ativo: true },
                order: { nome: "ASC" },
            });
            
            return res.json({
                success: true,
                data: direcoes,
                message: 'Direções listadas com sucesso'
            });
        } catch (error) {
            console.error('Erro ao listar direções:', error);
            return res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'Erro interno do servidor'
            });
        }
    }

    async buscar(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const direcao = await DirecaoRepository.findOne({
                where: { id }
            });
            
            if (!direcao) {
                return res.status(404).json({ 
                    success: false, 
                    error: "Direção não encontrada" 
                });
            }
            
            return res.json({
                success: true,
                data: direcao,
                message: 'Direção encontrada com sucesso'
            });
        } catch (error) {
            console.error('Erro ao buscar direção:', error);
            return res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'Erro interno do servidor'
            });
        }
    }
}


