
import { Router } from 'express';
import auth from './utilizador/auth';
import users from './utilizador';
import solictacaoRoute from './solicitacao/solicitacao.routes';
import balcoesRoute from './bolcoes/balcoes.routes';
import aprovacaoRoute from './aprovacao/aprovacao.route';
import requestTypeRoute from './quest-type/request-type.routes';
import perfil from './utilizador/perfil/perfil';
import perfilPermissao from './utilizador/perfil/perfil-permissao';
import departamento from './utilizador/departamento/departamento';
import direcao from './utilizador/direcao/direcao';
import gabinete from './utilizador/gabinete/gabinete';
import modulo from './utilizador/modulo';
import acao from './utilizador/acao';
const router = Router();


auth(router);
users(router);
perfil(router)
perfilPermissao(router)
departamento(router);
direcao(router);
gabinete(router);
modulo(router);
acao(router)
solictacaoRoute(router)
balcoesRoute(router)
aprovacaoRoute(router)
requestTypeRoute(router)


export default router;
