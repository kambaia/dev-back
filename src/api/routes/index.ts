
import { Router } from 'express';
import auth from './auth';
import users from './users';
import solictacaoRoute from './solicitacao/solicitacao.routes';
import balcoesRoute from './bolcoes/balcoes.routes';
import aprovacaoRoute from './aprovacao/aprovacao.route';
import requestTypeRoute from './quest-type/request-type.routes';
const router = Router();
auth(router);
users(router);
solictacaoRoute(router)
balcoesRoute(router)
aprovacaoRoute(router)
requestTypeRoute(router)

export default router;
