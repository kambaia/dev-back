import { DataSource } from "typeorm";
import { Perfil } from "../models/user/Perfil";
import { PerfilPermissao } from "../models/user/PerfilPermissao";
import { seedAcoesCompletas } from "./seed-modulos-acoes";


// seed-perfis-direcoes-especiais.ts
export const seedPerfisDirecoesEspeciais = async (AppDataSource: DataSource) => {
    const perfilRepo = AppDataSource.getRepository(Perfil);
    const perfilPermissaoRepo = AppDataSource.getRepository(PerfilPermissao);

    const { modulos, acoes } = await seedAcoesCompletas(AppDataSource);

    // 🛡️ PERFIS DPS - Direção de Proteção e Segurança
    const perfilCoordenadorSeguranca = await perfilRepo.save({
        nome: 'Coordenador de Segurança DPS',
        descricao: 'Coordena todas as atividades de segurança e proteção',
        isAdmin: false
    });

    const perfilTecnicoVigilancia = await perfilRepo.save({
        nome: 'Técnico de Vigilância DPS',
        descricao: 'Operação e manutenção de sistemas de vigilância',
        isAdmin: false
    });

    const perfilAgenteSeguranca = await perfilRepo.save({
        nome: 'Agente de Segurança DPS',
        descricao: 'Proteção física e controlo de acessos',
        isAdmin: false
    });

    // 🔧 PERFIS GSO - Gabinetes de Suporte e Operações
    const perfilCoordenadorSuporte = await perfilRepo.save({
        nome: 'Coordenador de Suporte GSO',
        descricao: 'Coordena as equipas de suporte e operações',
        isAdmin: false
    });

    const perfilTecnicoSuporte = await perfilRepo.save({
        nome: 'Técnico de Suporte GSO',
        descricao: 'Suporte técnico direto aos utilizadores',
        isAdmin: false
    });

    const perfilOperadorRede = await perfilRepo.save({
        nome: 'Operador de Rede GSO',
        descricao: 'Monitorização e gestão da infraestrutura de rede',
        isAdmin: false
    });

    // ⚖️ PERFIS DJO - Direção de Jurídico e Organização
    const perfilJuristaSenior = await perfilRepo.save({
        nome: 'Jurista Sénior DJO',
        descricao: 'Assessoria jurídica especializada e revisão legal',
        isAdmin: false
    });

    const perfilGestorContratos = await perfilRepo.save({
        nome: 'Gestor de Contratos DJO',
        descricao: 'Gestão e acompanhamento de contratos',
        isAdmin: false
    });

    const perfilAnalistaProcessos = await perfilRepo.save({
        nome: 'Analista de Processos DJO',
        descricao: 'Análise e otimização de processos organizacionais',
        isAdmin: false
    });

    // 💼 PERFIS ADMIN - Direção de Administração e Gestão
    const perfilGestorFinanceiro = await perfilRepo.save({
        nome: 'Gestor Financeiro ADMIN',
        descricao: 'Gestão orçamental e controlo financeiro',
        isAdmin: false
    });

    const perfilEspecialistaRH = await perfilRepo.save({
        nome: 'Especialista RH ADMIN',
        descricao: 'Gestão de recursos humanos e desenvolvimento',
        isAdmin: false
    });

    const perfilGestorPatrimonio = await perfilRepo.save({
        nome: 'Gestor de Património ADMIN',
        descricao: 'Gestão do património e inventário',
        isAdmin: false
    });

    // 🛡️ PERMISSÕES DPS - Coordenador de Segurança
    await perfilPermissaoRepo.save([
        // Acesso completo a todas as solicitações de segurança
        ...acoes.filter(a => a.modulo.codigo === 'SOLICITACOES' && [
            'VIEW_ALL', 'CREATE', 'EDIT', 'APPROVE', 'FORWARD', 'COMMENT', 'EXPORT'
        ].includes(a.codigo)).map(a => ({ perfil: perfilCoordenadorSeguranca, modulo: a.modulo, acao: a })),

        // Relatórios de segurança
        ...acoes.filter(a => a.modulo.codigo === 'RELATORIOS' && [
            'VIEW_GENERAL', 'VIEW_SOLICITACOES', 'EXPORT_PDF', 'EXPORT_EXCEL'
        ].includes(a.codigo)).map(a => ({ perfil: perfilCoordenadorSeguranca, modulo: a.modulo, acao: a })),

        // Gestão de balcões (pontos de controlo)
        ...acoes.filter(a => a.modulo.codigo === 'BALCOES' && [
            'VIEW', 'EDIT', 'ASSIGN_RESPONSAVEL'
        ].includes(a.codigo)).map(a => ({ perfil: perfilCoordenadorSeguranca, modulo: a.modulo, acao: a })),

        // Auditoria de acessos
        ...acoes.filter(a => a.modulo.codigo === 'AUDITORIA' && [
            'VIEW_LOGS', 'VIEW_ACCESS', 'EXPORT_LOGS'
        ].includes(a.codigo)).map(a => ({ perfil: perfilCoordenadorSeguranca, modulo: a.modulo, acao: a })),
    ]);

    // 🛡️ PERMISSÕES DPS - Técnico de Vigilância
    await perfilPermissaoRepo.save([
        // Gestão de solicitações técnicas de vigilância
        ...acoes.filter(a => a.modulo.codigo === 'SOLICITACOES' && [
            'VIEW_DIRECAO', 'CREATE', 'EDIT', 'COMMENT'
        ].includes(a.codigo)).map(a => ({ perfil: perfilTecnicoVigilancia, modulo: a.modulo, acao: a })),

        // Materiais específicos para vigilância
        ...acoes.filter(a => a.modulo.codigo === 'MATERIAIS' && [
            'VIEW_DIRECAO', 'REGISTER_ENTRY', 'REGISTER_EXIT', 'MANAGE_STOCK'
        ].includes(a.codigo)).map(a => ({ perfil: perfilTecnicoVigilancia, modulo: a.modulo, acao: a })),
    ]);

    // 🔧 PERMISSÕES GSO - Coordenador de Suporte
    await perfilPermissaoRepo.save([
        // Gestão completa de solicitações de suporte
        ...acoes.filter(a => a.modulo.codigo === 'SOLICITACOES' && [
            'VIEW_ALL', 'CREATE', 'EDIT', 'APPROVE', 'FORWARD', 'COMMENT', 'EXPORT'
        ].includes(a.codigo)).map(a => ({ perfil: perfilCoordenadorSuporte, modulo: a.modulo, acao: a })),

        // Relatórios de performance de suporte
        ...acoes.filter(a => a.modulo.codigo === 'RELATORIOS' && [
            'VIEW_SOLICITACOES', 'VIEW_PERFORMANCE', 'EXPORT_EXCEL'
        ].includes(a.codigo)).map(a => ({ perfil: perfilCoordenadorSuporte, modulo: a.modulo, acao: a })),

        // Gestão de materiais técnicos
        ...acoes.filter(a => a.modulo.codigo === 'MATERIAIS' && [
            'VIEW_INVENTORY', 'ADD', 'EDIT', 'APPROVE_REQUEST', 'MANAGE_STOCK'
        ].includes(a.codigo)).map(a => ({ perfil: perfilCoordenadorSuporte, modulo: a.modulo, acao: a })),
    ]);

    // 🔧 PERMISSÕES GSO - Técnico de Suporte
    await perfilPermissaoRepo.save([
        // Gestão de solicitações atribuídas
        ...acoes.filter(a => a.modulo.codigo === 'SOLICITACOES' && [
            'VIEW_DIRECAO', 'EDIT', 'COMMENT', 'FORWARD'
        ].includes(a.codigo)).map(a => ({ perfil: perfilTecnicoSuporte, modulo: a.modulo, acao: a })),

        // Registro de entrada/saída de materiais
        ...acoes.filter(a => a.modulo.codigo === 'MATERIAIS' && [
            'VIEW_DIRECAO', 'REGISTER_ENTRY', 'REGISTER_EXIT'
        ].includes(a.codigo)).map(a => ({ perfil: perfilTecnicoSuporte, modulo: a.modulo, acao: a })),
    ]);

    // ⚖️ PERMISSÕES DJO - Jurista Sénior
    await perfilPermissaoRepo.save([
        // Visualização de todas as solicitações (para análise legal)
        ...acoes.filter(a => a.modulo.codigo === 'SOLICITACOES' && [
            'VIEW_ALL', 'COMMENT', 'EXPORT'
        ].includes(a.codigo)).map(a => ({ perfil: perfilJuristaSenior, modulo: a.modulo, acao: a })),

        // Relatórios completos
        ...acoes.filter(a => a.modulo.codigo === 'RELATORIOS')
               .map(a => ({ perfil: perfilJuristaSenior, modulo: a.modulo, acao: a })),

        // Auditoria completa
        ...acoes.filter(a => a.modulo.codigo === 'AUDITORIA')
               .map(a => ({ perfil: perfilJuristaSenior, modulo: a.modulo, acao: a })),
    ]);

    // 💼 PERMISSÕES ADMIN - Gestor Financeiro
    await perfilPermissaoRepo.save([
        // Aprovações financeiras de solicitações
        ...acoes.filter(a => a.modulo.codigo === 'SOLICITACOES' && [
            'VIEW_ALL', 'APPROVE', 'COMMENT', 'EXPORT'
        ].includes(a.codigo)).map(a => ({ perfil: perfilGestorFinanceiro, modulo: a.modulo, acao: a })),

        // Relatórios financeiros
        ...acoes.filter(a => a.modulo.codigo === 'RELATORIOS' && [
            'VIEW_GENERAL', 'EXPORT_EXCEL', 'EXPORT_PDF'
        ].includes(a.codigo)).map(a => ({ perfil: perfilGestorFinanceiro, modulo: a.modulo, acao: a })),

        // Gestão de orçamentos em configurações
        { perfil: perfilGestorFinanceiro, modulo: modulos[3], acao: acoes.find(a => a.codigo === 'VIEW' && a.modulo.codigo === 'CONFIGURACOES') },
    ]);

    return {
        // DPS
        perfilCoordenadorSeguranca,
        perfilTecnicoVigilancia,
        perfilAgenteSeguranca,

        // GSO
        perfilCoordenadorSuporte,
        perfilTecnicoSuporte,
        perfilOperadorRede,

        // DJO
        perfilJuristaSenior,
        perfilGestorContratos,
        perfilAnalistaProcessos,

        // ADMIN
        perfilGestorFinanceiro,
        perfilEspecialistaRH,
        perfilGestorPatrimonio
    };
};
