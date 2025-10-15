import { DataSource } from "typeorm";
import { Direcao } from "../models/user/direcao";
import { Gabinete } from "../models/user/Gabinete";
import { seedAcoesCompletas } from "./seed-modulos-acoes";
import { Perfil } from "../models/user/Perfil";
import { PerfilPermissao } from "../models/user/PerfilPermissao";


export const seedPerfisDetalhados = async (AppDataSource: DataSource) => {

    const perfilRepo = AppDataSource.getRepository(Perfil);
    const perfilPermissaoRepo = AppDataSource.getRepository(PerfilPermissao);
    const { modulos, acoes } = await seedAcoesCompletas(AppDataSource);

    // 🎯 PERFIL 1: Super Administrador (Todas as permissões)
    const superAdmin = await perfilRepo.save({
        nome: 'Super Administrador',
        descricao: 'Acesso total a todas as funcionalidades do sistema',
        isAdmin: true
    });

    // 🎯 PERFIL 2: Administrador de Direção
    const adminDirecao = await perfilRepo.save({
        nome: 'Administrador de Direção',
        descricao: 'Acesso total à direção com algumas restrições de sistema',
        isAdmin: false
    });

    // 🎯 PERFIL 3: Gestor de Solicitações
    const gestorSolicitacoes = await perfilRepo.save({
        nome: 'Gestor de Solicitações',
        descricao: 'Gestão completa de solicitações da direção',
        isAdmin: false
    });

    // 🎯 PERFIL 4: Técnico Especializado
    const tecnicoEspecializado = await perfilRepo.save({
        nome: 'Técnico Especializado',
        descricao: 'Acesso técnico com foco em intervenções e materiais',
        isAdmin: false
    });

    // 🎯 PERFIL 5: Utilizador Básico
    const utilizadorBasico = await perfilRepo.save({
        nome: 'Utilizador Básico',
        descricao: 'Acesso básico para criar e acompanhar solicitações',
        isAdmin: false
    });

    // 🎯 PERFIL 6: Auditor
    const auditor = await perfilRepo.save({
        nome: 'Auditor',
        descricao: 'Acesso apenas a relatórios e auditoria',
        isAdmin: false
    });

    // 🔵 PERMISSÕES SUPER ADMIN (Todas as ações)
    const permissoesSuperAdmin = acoes.map(acao => ({
        perfil: superAdmin,
        modulo: acao.modulo,
        acao: acao
    }));
    await perfilPermissaoRepo.save(permissoesSuperAdmin);

    // 🔵 PERMISSÕES ADMIN DIREÇÃO
    await perfilPermissaoRepo.save([
        // Solicitações - Todas exceto eliminar
        ...acoes.filter(a => a.modulo.codigo === 'SOLICITACOES' && a.codigo !== 'DELETE')
               .map(a => ({ perfil: adminDirecao, modulo: a.modulo, acao: a })),

        // Utilizadores - Apenas visualizar e editar da direção
        { perfil: adminDirecao, modulo: modulos[1], acao: acoes.find(a => a.codigo === 'VIEW_DIRECAO' && a.modulo.codigo === 'UTILIZADORES') },
        { perfil: adminDirecao, modulo: modulos[1], acao: acoes.find(a => a.codigo === 'EDIT' && a.modulo.codigo === 'UTILIZADORES') },

        // Relatórios - Todos
        ...acoes.filter(a => a.modulo.codigo === 'RELATORIOS')
               .map(a => ({ perfil: adminDirecao, modulo: a.modulo, acao: a })),

        // Configurações - Apenas visualizar
        { perfil: adminDirecao, modulo: modulos[3], acao: acoes.find(a => a.codigo === 'VIEW' && a.modulo.codigo === 'CONFIGURACOES') },

        // Direções - Apenas visualizar própria
        { perfil: adminDirecao, modulo: modulos[4], acao: acoes.find(a => a.codigo === 'VIEW' && a.modulo.codigo === 'DIRECOES') },

        // Balcões - Gerir apenas os da direção
        { perfil: adminDirecao, modulo: modulos[5], acao: acoes.find(a => a.codigo === 'VIEW_DIRECAO' && a.modulo.codigo === 'BALCOES') },
        { perfil: adminDirecao, modulo: modulos[5], acao: acoes.find(a => a.codigo === 'CREATE' && a.modulo.codigo === 'BALCOES') },
        { perfil: adminDirecao, modulo: modulos[5], acao: acoes.find(a => a.codigo === 'EDIT' && a.modulo.codigo === 'BALCOES') },

        // Materiais - Gerir apenas os da direção
        { perfil: adminDirecao, modulo: modulos[6], acao: acoes.find(a => a.codigo === 'VIEW_DIRECAO' && a.modulo.codigo === 'MATERIAIS') },
        { perfil: adminDirecao, modulo: modulos[6], acao: acoes.find(a => a.codigo === 'ADD' && a.modulo.codigo === 'MATERIAIS') },
        { perfil: adminDirecao, modulo: modulos[6], acao: acoes.find(a => a.codigo === 'EDIT' && a.modulo.codigo === 'MATERIAIS') },
        { perfil: adminDirecao, modulo: modulos[6], acao: acoes.find(a => a.codigo === 'APPROVE_REQUEST' && a.modulo.codigo === 'MATERIAIS') },
    ]);

    // 🟡 PERMISSÕES GESTOR SOLICITAÇÕES
    await perfilPermissaoRepo.save([
        // Solicitações - Gestão completa exceto eliminar
        ...acoes.filter(a => a.modulo.codigo === 'SOLICITACOES' && !['DELETE', 'VIEW_ALL'].includes(a.codigo))
               .map(a => ({ perfil: gestorSolicitacoes, modulo: a.modulo, acao: a })),

        // Relatórios - Apenas de solicitações
        { perfil: gestorSolicitacoes, modulo: modulos[2], acao: acoes.find(a => a.codigo === 'VIEW_SOLICITACOES' && a.modulo.codigo === 'RELATORIOS') },
        { perfil: gestorSolicitacoes, modulo: modulos[2], acao: acoes.find(a => a.codigo === 'EXPORT_EXCEL' && a.modulo.codigo === 'RELATORIOS') },

        // Materiais - Apenas visualizar e aprovar requisições
        { perfil: gestorSolicitacoes, modulo: modulos[6], acao: acoes.find(a => a.codigo === 'VIEW_DIRECAO' && a.modulo.codigo === 'MATERIAIS') },
        { perfil: gestorSolicitacoes, modulo: modulos[6], acao: acoes.find(a => a.codigo === 'APPROVE_REQUEST' && a.modulo.codigo === 'MATERIAIS') },
    ]);

    // 🟢 PERMISSÕES TÉCNICO ESPECIALIZADO
    await perfilPermissaoRepo.save([
        // Solicitações - Ações técnicas
        { perfil: tecnicoEspecializado, modulo: modulos[0], acao: acoes.find(a => a.codigo === 'VIEW_DIRECAO' && a.modulo.codigo === 'SOLICITACOES') },
        { perfil: tecnicoEspecializado, modulo: modulos[0], acao: acoes.find(a => a.codigo === 'EDIT' && a.modulo.codigo === 'SOLICITACOES') },
        { perfil: tecnicoEspecializado, modulo: modulos[0], acao: acoes.find(a => a.codigo === 'COMMENT' && a.modulo.codigo === 'SOLICITACOES') },

        // Materiais - Gestão técnica
        ...acoes.filter(a => a.modulo.codigo === 'MATERIAIS' && [
            'VIEW_DIRECAO', 'REGISTER_ENTRY', 'REGISTER_EXIT', 'MANAGE_STOCK'
        ].includes(a.codigo)).map(a => ({ perfil: tecnicoEspecializado, modulo: a.modulo, acao: a })),
    ]);

    // 🔴 PERMISSÕES UTILIZADOR BÁSICO
    await perfilPermissaoRepo.save([
        // Solicitações - Apenas criar e visualizar próprias
        { perfil: utilizadorBasico, modulo: modulos[0], acao: acoes.find(a => a.codigo === 'VIEW_OWN' && a.modulo.codigo === 'SOLICITACOES') },
        { perfil: utilizadorBasico, modulo: modulos[0], acao: acoes.find(a => a.codigo === 'CREATE' && a.modulo.codigo === 'SOLICITACOES') },
        { perfil: utilizadorBasico, modulo: modulos[0], acao: acoes.find(a => a.codigo === 'EDIT_OWN' && a.modulo.codigo === 'SOLICITACOES') },

        // Relatórios - Apenas visualizar gerais
        { perfil: utilizadorBasico, modulo: modulos[2], acao: acoes.find(a => a.codigo === 'VIEW_GENERAL' && a.modulo.codigo === 'RELATORIOS') },
    ]);

    // 🟣 PERMISSÕES AUDITOR
    await perfilPermissaoRepo.save([
        // Auditoria - Todas as ações
        ...acoes.filter(a => a.modulo.codigo === 'AUDITORIA')
               .map(a => ({ perfil: auditor, modulo: a.modulo, acao: a })),

        // Relatórios - Todos
        ...acoes.filter(a => a.modulo.codigo === 'RELATORIOS')
               .map(a => ({ perfil: auditor, modulo: a.modulo, acao: a })),
    ]);

    return {
        superAdmin,
        adminDirecao,
        gestorSolicitacoes,
        tecnicoEspecializado,
        utilizadorBasico,
        auditor
    };
};
