// routes/aprovacaoRoutes.ts
import { Router } from 'express';
import { AprovacaoController } from '../../../controllers/aprovacao.controller';

const router = Router();
const aprovacaoController = new AprovacaoController();

export default (app: Router) => {

    app.use('/approval-request', router); // prefixo geral
    router.put('/:aprovacaoId', aprovacaoController.iniciarFluxoAprovacao);
    router.get('/', aprovacaoController.listarAprovacoes);
    router.get('/my-request', () => { console.log("Aprovação aqui") });
    router.get('/estatisticas', () => console.log("Estatistica"));
}


