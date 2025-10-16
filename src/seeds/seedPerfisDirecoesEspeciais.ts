import { DataSource } from "typeorm";
import { Perfil } from "../models/user/Perfil";
import { PerfilPermissao } from "../models/user/PerfilPermissao";
import { seedAcoesCompletas } from "./seed-modulos-acoes";

export const seedPerfisDirecoesEspeciais = async (AppDataSource: DataSource) => {
    const perfilRepo = AppDataSource.getRepository(Perfil);
    const perfilPermissaoRepo = AppDataSource.getRepository(PerfilPermissao);
    const { acoes } = await seedAcoesCompletas(AppDataSource);


    const createPerfilIfNotExists = async (nome: string, descricao: string) => {
        const existing = await perfilRepo.findOne({ where: { nome } });
        if (existing) {
            console.log(`⚠️ Perfil '${nome}' já existe.`);
            return existing;
        }
        const perfil = perfilRepo.create({ nome, descricao, isAdmin: false });
        await perfilRepo.save(perfil);
        console.log(`✅ Perfil '${nome}' criado com sucesso.`);
        return perfil;
    };

    /**
     * Helper → Adiciona permissões, evitando duplicadas
     */
    const addPermissoes = async (perfil: Perfil, permissoes: any[]) => {
        const novas: any[] = [];
        for (const p of permissoes) {
            const exists = await perfilPermissaoRepo.findOne({
                where: {
                    perfil: { id: perfil.id },
                    modulo: { id: p.modulo.id },
                    acao: { id: p.acao.id },
                },
            });
            if (!exists) novas.push(p);
        }
        if (novas.length > 0) {
            await perfilPermissaoRepo.save(novas);
            console.log(`✅ ${novas.length} permissões adicionadas a '${perfil.nome}'.`);
        } else {
            console.log(`⚠️ Nenhuma nova permissão adicionada a '${perfil.nome}'.`);
        }
    };

    // ==========================================================
    // 🛡️ PERFIS DPS - Direção de Proteção e Segurança
    // ==========================================================
    const perfilCoordenadorSeguranca = await createPerfilIfNotExists(
        "Coordenador de Segurança DPS",
        "Coordena todas as atividades de segurança e proteção"
    );
    const perfilTecnicoVigilancia = await createPerfilIfNotExists(
        "Técnico de Vigilância DPS",
        "Operação e manutenção de sistemas de vigilância"
    );
    const perfilAgenteSeguranca = await createPerfilIfNotExists(
        "Agente de Segurança DPS",
        "Proteção física e controlo de acessos"
    );

    // ==========================================================
    // 🔧 PERFIS GSO - Gabinetes de Suporte e Operações
    // ==========================================================
    const perfilCoordenadorSuporte = await createPerfilIfNotExists(
        "Coordenador de Suporte GSO",
        "Coordena as equipas de suporte e operações"
    );
    const perfilTecnicoSuporte = await createPerfilIfNotExists(
        "Técnico de Suporte GSO",
        "Suporte técnico direto aos utilizadores"
    );
    const perfilOperadorRede = await createPerfilIfNotExists(
        "Operador de Rede GSO",
        "Monitorização e gestão da infraestrutura de rede"
    );

    // ==========================================================
    // ⚖️ PERFIS DJO - Direção de Jurídico e Organização
    // ==========================================================
    const perfilJuristaSenior = await createPerfilIfNotExists(
        "Jurista Sénior DJO",
        "Assessoria jurídica especializada e revisão legal"
    );
    const perfilGestorContratos = await createPerfilIfNotExists(
        "Gestor de Contratos DJO",
        "Gestão e acompanhamento de contratos"
    );
    const perfilAnalistaProcessos = await createPerfilIfNotExists(
        "Analista de Processos DJO",
        "Análise e otimização de processos organizacionais"
    );

    // ==========================================================
    // 💼 PERFIS ADMIN - Direção de Administração e Gestão
    // ==========================================================
    const perfilGestorFinanceiro = await createPerfilIfNotExists(
        "Gestor Financeiro ADMIN",
        "Gestão orçamental e controlo financeiro"
    );
    const perfilEspecialistaRH = await createPerfilIfNotExists(
        "Especialista RH ADMIN",
        "Gestão de recursos humanos e desenvolvimento"
    );
    const perfilGestorPatrimonio = await createPerfilIfNotExists(
        "Gestor de Património ADMIN",
        "Gestão do património e inventário"
    );

    // ==========================================================
    // 🛡️ PERMISSÕES DPS - Coordenador de Segurança
    // ==========================================================
    await addPermissoes(
        perfilCoordenadorSeguranca,
        acoes
            .filter(a =>
                (a.modulo.codigo.toLowerCase() === "solicitacoes" &&
                    ["view_all", "create", "edit", "approve", "forward", "comment", "export"].includes(a.codigo.toLowerCase())) ||
                (a.modulo.codigo.toLowerCase() === "relatorios" &&
                    ["view_general", "view_solicitacoes", "export_pdf", "export_excel"].includes(a.codigo.toLowerCase())) ||
                (a.modulo.codigo.toLowerCase() === "balcoes" &&
                    ["view", "edit", "assign_responsavel"].includes(a.codigo.toLowerCase())) ||
                (a.modulo.codigo.toLowerCase() === "auditoria" &&
                    ["view_logs", "view_access", "export_logs"].includes(a.codigo.toLowerCase()))
            )
            .map(a => ({ perfil: perfilCoordenadorSeguranca, modulo: a.modulo, acao: a }))
    );

    // DPS - Técnico de Vigilância
    await addPermissoes(
        perfilTecnicoVigilancia,
        acoes
            .filter(a =>
                (a.modulo.codigo.toLowerCase() === "solicitacoes" &&
                    ["view_direcao", "create", "edit", "comment"].includes(a.codigo.toLowerCase())) ||
                (a.modulo.codigo.toLowerCase() === "materiais" &&
                    ["view_direcao", "register_entry", "register_exit", "manage_stock"].includes(a.codigo.toLowerCase()))
            )
            .map(a => ({ perfil: perfilTecnicoVigilancia, modulo: a.modulo, acao: a }))
    );

    // ==========================================================
    // 🔧 PERMISSÕES GSO - Coordenador de Suporte
    // ==========================================================
    await addPermissoes(
        perfilCoordenadorSuporte,
        acoes
            .filter(a =>
                (a.modulo.codigo.toLowerCase() === "solicitacoes" &&
                    ["view_all", "create", "edit", "approve", "forward", "comment", "export"].includes(a.codigo.toLowerCase())) ||
                (a.modulo.codigo.toLowerCase() === "relatorios" &&
                    ["view_solicitacoes", "view_performance", "export_excel"].includes(a.codigo.toLowerCase())) ||
                (a.modulo.codigo.toLowerCase() === "materiais" &&
                    ["view_inventory", "add", "edit", "approve_request", "manage_stock"].includes(a.codigo.toLowerCase()))
            )
            .map(a => ({ perfil: perfilCoordenadorSuporte, modulo: a.modulo, acao: a }))
    );

    // GSO - Técnico de Suporte
    await addPermissoes(
        perfilTecnicoSuporte,
        acoes
            .filter(a =>
                (a.modulo.codigo.toLowerCase() === "solicitacoes" &&
                    ["view_direcao", "edit", "comment", "forward"].includes(a.codigo.toLowerCase())) ||
                (a.modulo.codigo.toLowerCase() === "materiais" &&
                    ["view_direcao", "register_entry", "register_exit"].includes(a.codigo.toLowerCase()))
            )
            .map(a => ({ perfil: perfilTecnicoSuporte, modulo: a.modulo, acao: a }))
    );

    // ==========================================================
    // ⚖️ PERMISSÕES DJO - Jurista Sénior
    // ==========================================================
    await addPermissoes(
        perfilJuristaSenior,
        acoes
            .filter(a =>
                (a.modulo.codigo.toLowerCase() === "solicitacoes" &&
                    ["view_all", "comment", "export"].includes(a.codigo.toLowerCase())) ||
                ["relatorios", "auditoria"].includes(a.modulo.codigo.toLowerCase())
            )
            .map(a => ({ perfil: perfilJuristaSenior, modulo: a.modulo, acao: a }))
    );

    // ==========================================================
    // 💼 PERMISSÕES ADMIN - Gestor Financeiro
    // ==========================================================
    await addPermissoes(
        perfilGestorFinanceiro,
        [
            ...acoes.filter(a =>
                a.modulo.codigo.toLowerCase() === "solicitacoes" &&
                ["view_all", "approve", "comment", "export"].includes(a.codigo.toLowerCase())
            ),
            ...acoes.filter(a =>
                a.modulo.codigo.toLowerCase() === "relatorios" &&
                ["view_general", "export_excel", "export_pdf"].includes(a.codigo.toLowerCase())
            ),
            ...acoes.filter(a =>
                a.modulo.codigo.toLowerCase() === "configuracoes" &&
                ["view"].includes(a.codigo.toLowerCase())
            ),
        ].map(a => ({ perfil: perfilGestorFinanceiro, modulo: a.modulo, acao: a }))
    );

    console.log("🎯 Seed de perfis e permissões das direções especiais concluído com sucesso.");

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
        perfilGestorPatrimonio,
    };
};
