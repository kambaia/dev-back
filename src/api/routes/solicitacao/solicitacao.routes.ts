import { Router } from 'express';
import { SolicitacaoController } from '../../../controllers/solicitacao.controller';

const router = Router();
const solicitacaoController = new SolicitacaoController();

export default (app: Router) => {
    app.use('/request', router); // prefixo geral

    router.put('/:id', solicitacaoController.atualizarSolicitacao);
    router.post('/', solicitacaoController.criarSolicitacao);
    router.get('/', solicitacaoController.listarSolicitacoes);
    router.get('/:id', solicitacaoController.obterSolicitacao);
    router.delete('/:id', solicitacaoController.excluirSolicitacao);

    // ROTAS POR TIPO
    router.get('/type/:tipoId', solicitacaoController.obterSolicitacoesPorTipo);
    // ROTAS DE MATERIAIS
    router.post('/:id/materiais', solicitacaoController.adicionarMaterial);
    router.delete('/:id/materiais/:materialId', solicitacaoController.removerMaterial);
}
