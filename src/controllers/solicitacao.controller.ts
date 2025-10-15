
import { Request, Response } from 'express';
import { SolicitacaoService } from '../services/solicitacao/solicitacaoService';
import { CriarSolicitacaoDTO } from '../types/DTO';
import { GETAllMaterialMyIDGet } from '../services/solicitacao/common/list/getByMaterial';
import { ListagemSolicitacaoServicos} from '../services/solicitacao/common/list/getAllRequest';



const solicitacaoService = new SolicitacaoService();
const SolicitacaoMaterial = new GETAllMaterialMyIDGet();
const solicitacaoAll = new ListagemSolicitacaoServicos();

export class SolicitacaoController {
    // ✅ CRIAÇÃO
    async criarSolicitacao(req: Request, res: Response) {
        try {
            const dto: CriarSolicitacaoDTO = req.body;
            const resultado = await solicitacaoService.criarSolicitacao(dto);
            res.status(201).json({
                success: true,
                data: resultado,
                message: 'Solicitação criada com sucesso'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error instanceof Error ? error.message : String(error)
            });
        }
    }

    // ✅ LISTAGEM
    async listarSolicitacoes(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const resultado = await solicitacaoAll.listarSolicitacoes(page, limit);
            res.json({
                success: true,
                data: resultado.solicitacoes,
                pagination: resultado.pagination
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : String(error)
            });
        }
    }

    // ✅ OBTER POR ID
    async obterSolicitacao(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const resultado = await SolicitacaoMaterial.obterSolicitacaoPorId(id);
            res.json({
                success: true,
                data: resultado
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                error: error instanceof Error ? error.message : String(error)
            });
        }
    }

    // ✅ OBTER POR TIPO
    async obterSolicitacoesPorTipo(req: Request, res: Response) {
        try {
            const tipoId = req.params.tipoId;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const resultado = await solicitacaoService.obterSolicitacoesPorTipo(tipoId, page, limit);
            res.json({
                success: true,
                data: resultado.solicitacoes,
                pagination: resultado.pagination
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error instanceof Error ? error.message : String(error)
            });
        }
    }

    atualizarSolicitacao = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const updateData = req.body;

            if (!id) {
                res.status(400).json({
                    success: false,
                    message: 'ID da solicitação é obrigatório'
                });
                return;
            }

            const resultado = await solicitacaoService.atualizarSolicitacao(id, updateData);

            res.status(200).json({
                success: true,
                message: 'Solicitação atualizada com sucesso',
                data: resultado
            });
        } catch (error) {
            console.error('Erro ao atualizar solicitação:', error);
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Erro ao atualizar solicitação'
            });
        }
    }


    // ✅ ADICIONAR MATERIAL
    async adicionarMaterial(req: Request, res: Response) {
        try {
            const solicitacaoId = req.params.id;
            const materialDto = req.body;
            const resultado = await solicitacaoService.adicionarMaterial(solicitacaoId, materialDto);
            res.status(201).json({
                success: true,
                data: resultado,
                message: 'Material adicionado com sucesso'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error instanceof Error ? error.message : String(error)
            });
        }
    }

    // ✅ REMOVER MATERIAL
    async removerMaterial(req: Request, res: Response) {
        try {
            const { id, materialId } = req.params;
            await solicitacaoService.removerMaterial(id, materialId);
            res.json({
                success: true,
                message: 'Material removido com sucesso'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error instanceof Error ? error.message : String(error)
            });
        }
    }
    // ✅ EXCLUIR SOLICITAÇÃO
    async excluirSolicitacao(req: Request, res: Response) {
        try {
            const id = req.params.id;
            await solicitacaoService.excluirSolicitacao(id);
            res.json({
                success: true,
                message: 'Solicitação excluída com sucesso'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error instanceof Error ? error.message : String(error)
            });
        }
    }
}
