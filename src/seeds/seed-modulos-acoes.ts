import { DataSource } from "typeorm";
import { Acao } from "../models/user/Acao";
import { Modulo } from "../models/user/Modulo";

export const seedAcoesCompletas = async (AppDataSource: DataSource) => {
    const moduloRepo = AppDataSource.getRepository(Modulo);
    const acaoRepo = AppDataSource.getRepository(Acao);

    // Módulos do sistema
    const modulos = await moduloRepo.save([
        { nome: 'Solicitações', descricao: 'Gestão de solicitações', codigo: 'SOLICITACOES', ordem: 1 },
        { nome: 'Utilizadores', descricao: 'Gestão de utilizadores', codigo: 'UTILIZADORES', ordem: 2 },
        { nome: 'Relatórios', descricao: 'Relatórios do sistema', codigo: 'RELATORIOS', ordem: 3 },
        { nome: 'Configurações', descricao: 'Configurações do sistema', codigo: 'CONFIGURACOES', ordem: 4 },
        { nome: 'Direções', descricao: 'Gestão de direções e gabinetes', codigo: 'DIRECOES', ordem: 5 },
        { nome: 'Balcões', descricao: 'Gestão de balcões', codigo: 'BALCOES', ordem: 6 },
        { nome: 'Materiais', descricao: 'Gestão de inventário de materiais', codigo: 'MATERIAIS', ordem: 7 },
        { nome: 'Auditoria', descricao: 'Registos de auditoria do sistema', codigo: 'AUDITORIA', ordem: 8 },
    ]);

    // Ações detalhadas para cada módulo
    const acoes = await acaoRepo.save([
        // 📋 MÓDULO: SOLICITAÇÕES (12 ações)
        { nome: 'Visualizar Todas', codigo: 'VIEW_ALL', modulo: modulos[0], descricao: 'Visualizar todas as solicitações' },
        { nome: 'Visualizar Próprias', codigo: 'VIEW_OWN', modulo: modulos[0], descricao: 'Visualizar apenas solicitações próprias' },
        { nome: 'Visualizar da Direção', codigo: 'VIEW_DIRECAO', modulo: modulos[0], descricao: 'Visualizar solicitações da própria direção' },
        { nome: 'Criar', codigo: 'CREATE', modulo: modulos[0], descricao: 'Criar nova solicitação' },
        { nome: 'Editar', codigo: 'EDIT', modulo: modulos[0], descricao: 'Editar solicitação' },
        { nome: 'Editar Próprias', codigo: 'EDIT_OWN', modulo: modulos[0], descricao: 'Editar apenas solicitações próprias' },
        { nome: 'Aprovar', codigo: 'APPROVE', modulo: modulos[0], descricao: 'Aprovar solicitação' },
        { nome: 'Rejeitar', codigo: 'REJECT', modulo: modulos[0], descricao: 'Rejeitar solicitação' },
        { nome: 'Cancelar', codigo: 'CANCEL', modulo: modulos[0], descricao: 'Cancelar solicitação' },
        { nome: 'Encaminhar', codigo: 'FORWARD', modulo: modulos[0], descricao: 'Encaminhar solicitação' },
        { nome: 'Comentar', codigo: 'COMMENT', modulo: modulos[0], descricao: 'Adicionar comentários' },
        { nome: 'Eliminar', codigo: 'DELETE', modulo: modulos[0], descricao: 'Eliminar solicitação' },
        { nome: 'Exportar', codigo: 'EXPORT', modulo: modulos[0], descricao: 'Exportar lista de solicitações' },

        // 👥 MÓDULO: UTILIZADORES (10 ações)
        { nome: 'Visualizar Todos', codigo: 'VIEW_ALL', modulo: modulos[1], descricao: 'Visualizar todos os utilizadores' },
        { nome: 'Visualizar da Direção', codigo: 'VIEW_DIRECAO', modulo: modulos[1], descricao: 'Visualizar utilizadores da própria direção' },
        { nome: 'Criar', codigo: 'CREATE', modulo: modulos[1], descricao: 'Criar novo utilizador' },
        { nome: 'Editar', codigo: 'EDIT', modulo: modulos[1], descricao: 'Editar utilizador' },
        { nome: 'Editar Próprio', codigo: 'EDIT_OWN', modulo: modulos[1], descricao: 'Editar próprio perfil' },
        { nome: 'Ativar/Desativar', codigo: 'TOGGLE_ACTIVE', modulo: modulos[1], descricao: 'Ativar ou desativar utilizador' },
        { nome: 'Redefinir Senha', codigo: 'RESET_PASSWORD', modulo: modulos[1], descricao: 'Redefinir senha de utilizador' },
        { nome: 'Atribuir Perfil', codigo: 'ASSIGN_PROFILE', modulo: modulos[1], descricao: 'Atribuir perfil a utilizador' },
        { nome: 'Eliminar', codigo: 'DELETE', modulo: modulos[1], descricao: 'Eliminar utilizador' },
        { nome: 'Exportar', codigo: 'EXPORT', modulo: modulos[1], descricao: 'Exportar lista de utilizadores' },

        // 📊 MÓDULO: RELATÓRIOS (8 ações)
        { nome: 'Visualizar Gerais', codigo: 'VIEW_GENERAL', modulo: modulos[2], descricao: 'Visualizar relatórios gerais' },
        { nome: 'Visualizar de Solicitações', codigo: 'VIEW_SOLICITACOES', modulo: modulos[2], descricao: 'Visualizar relatórios de solicitações' },
        { nome: 'Visualizar de Utilizadores', codigo: 'VIEW_UTILIZADORES', modulo: modulos[2], descricao: 'Visualizar relatórios de utilizadores' },
        { nome: 'Visualizar de Materiais', codigo: 'VIEW_MATERIAIS', modulo: modulos[2], descricao: 'Visualizar relatórios de materiais' },
        { nome: 'Visualizar de Performance', codigo: 'VIEW_PERFORMANCE', modulo: modulos[2], descricao: 'Visualizar relatórios de performance' },
        { nome: 'Exportar PDF', codigo: 'EXPORT_PDF', modulo: modulos[2], descricao: 'Exportar relatórios em PDF' },
        { nome: 'Exportar Excel', codigo: 'EXPORT_EXCEL', modulo: modulos[2], descricao: 'Exportar relatórios em Excel' },
        { nome: 'Gerar Customizado', codigo: 'GENERATE_CUSTOM', modulo: modulos[2], descricao: 'Gerar relatórios customizados' },

        // ⚙️ MÓDULO: CONFIGURAÇÕES (9 ações)
        { nome: 'Visualizar', codigo: 'VIEW', modulo: modulos[3], descricao: 'Visualizar configurações' },
        { nome: 'Editar Gerais', codigo: 'EDIT_GENERAL', modulo: modulos[3], descricao: 'Editar configurações gerais' },
        { nome: 'Gerir Tipos Solicitação', codigo: 'MANAGE_TIPOS', modulo: modulos[3], descricao: 'Gerir tipos de solicitação' },
        { nome: 'Gerir Campos', codigo: 'MANAGE_CAMPOS', modulo: modulos[3], descricao: 'Gerir campos personalizados' },
        { nome: 'Gerir Estados', codigo: 'MANAGE_ESTADOS', modulo: modulos[3], descricao: 'Gerir estados de solicitação' },
        { nome: 'Backup', codigo: 'BACKUP', modulo: modulos[3], descricao: 'Realizar backup do sistema' },
        { nome: 'Restore', codigo: 'RESTORE', modulo: modulos[3], descricao: 'Restaurar sistema' },
        { nome: 'Logs', codigo: 'VIEW_LOGS', modulo: modulos[3], descricao: 'Visualizar logs do sistema' },
        { nome: 'Manutenção', codigo: 'MAINTENANCE', modulo: modulos[3], descricao: 'Acesso a modo de manutenção' },

        // 🏢 MÓDULO: DIREÇÕES (7 ações)
        { nome: 'Visualizar', codigo: 'VIEW', modulo: modulos[4], descricao: 'Visualizar direções' },
        { nome: 'Criar', codigo: 'CREATE', modulo: modulos[4], descricao: 'Criar nova direção' },
        { nome: 'Editar', codigo: 'EDIT', modulo: modulos[4], descricao: 'Editar direção' },
        { nome: 'Eliminar', codigo: 'DELETE', modulo: modulos[4], descricao: 'Eliminar direção' },
        { nome: 'Gerir Gabinetes', codigo: 'MANAGE_GABINETES', modulo: modulos[4], descricao: 'Gerir gabinetes da direção' },
        { nome: 'Atribuir Responsável', codigo: 'ASSIGN_RESPONSAVEL', modulo: modulos[4], descricao: 'Atribuir responsável à direção' },
        { nome: 'Exportar', codigo: 'EXPORT', modulo: modulos[4], descricao: 'Exportar lista de direções' },

        // 🏪 MÓDULO: BALCÕES (8 ações)
        { nome: 'Visualizar', codigo: 'VIEW', modulo: modulos[5], descricao: 'Visualizar balcões' },
        { nome: 'Visualizar da Direção', codigo: 'VIEW_DIRECAO', modulo: modulos[5], descricao: 'Visualizar balcões da própria direção' },
        { nome: 'Criar', codigo: 'CREATE', modulo: modulos[5], descricao: 'Criar novo balcão' },
        { nome: 'Editar', codigo: 'EDIT', modulo: modulos[5], descricao: 'Editar balcão' },
        { nome: 'Eliminar', codigo: 'DELETE', modulo: modulos[5], descricao: 'Eliminar balcão' },
        { nome: 'Ativar/Desativar', codigo: 'TOGGLE_ACTIVE', modulo: modulos[5], descricao: 'Ativar ou desativar balcão' },
        { nome: 'Atribuir Responsável', codigo: 'ASSIGN_RESPONSAVEL', modulo: modulos[5], descricao: 'Atribuir responsável ao balcão' },
        { nome: 'Exportar', codigo: 'EXPORT', modulo: modulos[5], descricao: 'Exportar lista de balcões' },

        // 📦 MÓDULO: MATERIAIS (12 ações)
        { nome: 'Visualizar Inventário', codigo: 'VIEW_INVENTORY', modulo: modulos[6], descricao: 'Visualizar inventário completo' },
        { nome: 'Visualizar da Direção', codigo: 'VIEW_DIRECAO', modulo: modulos[6], descricao: 'Visualizar materiais da própria direção' },
        { nome: 'Adicionar Material', codigo: 'ADD', modulo: modulos[6], descricao: 'Adicionar novo material ao inventário' },
        { nome: 'Editar Material', codigo: 'EDIT', modulo: modulos[6], descricao: 'Editar informação do material' },
        { nome: 'Eliminar Material', codigo: 'DELETE', modulo: modulos[6], descricao: 'Eliminar material do inventário' },
        { nome: 'Registar Entrada', codigo: 'REGISTER_ENTRY', modulo: modulos[6], descricao: 'Registar entrada de material' },
        { nome: 'Registar Saída', codigo: 'REGISTER_EXIT', modulo: modulos[6], descricao: 'Registar saída de material' },
        { nome: 'Aprovar Requisição', codigo: 'APPROVE_REQUEST', modulo: modulos[6], descricao: 'Aprovar requisição de material' },
        { nome: 'Gerir Categorias', codigo: 'MANAGE_CATEGORIES', modulo: modulos[6], descricao: 'Gerir categorias de material' },
        { nome: 'Controlar Stock', codigo: 'MANAGE_STOCK', modulo: modulos[6], descricao: 'Controlar níveis de stock' },
        { nome: 'Gerar Etiquetas', codigo: 'GENERATE_LABELS', modulo: modulos[6], descricao: 'Gerar etiquetas para materiais' },
        { nome: 'Exportar Inventário', codigo: 'EXPORT_INVENTORY', modulo: modulos[6], descricao: 'Exportar inventário completo' },

        // 🔍 MÓDULO: AUDITORIA (6 ações)
        { nome: 'Visualizar Logs', codigo: 'VIEW_LOGS', modulo: modulos[7], descricao: 'Visualizar logs de auditoria' },
        { nome: 'Visualizar Ações', codigo: 'VIEW_ACTIONS', modulo: modulos[7], descricao: 'Visualizar ações dos utilizadores' },
        { nome: 'Visualizar Acessos', codigo: 'VIEW_ACCESS', modulo: modulos[7], descricao: 'Visualizar logs de acesso' },
        { nome: 'Filtrar Logs', codigo: 'FILTER_LOGS', modulo: modulos[7], descricao: 'Filtrar logs por data/tipo' },
        { nome: 'Exportar Logs', codigo: 'EXPORT_LOGS', modulo: modulos[7], descricao: 'Exportar logs de auditoria' },
        { nome: 'Limpar Logs', codigo: 'CLEAR_LOGS', modulo: modulos[7], descricao: 'Limpar logs antigos' },
    ]);

    return { modulos, acoes };
};
