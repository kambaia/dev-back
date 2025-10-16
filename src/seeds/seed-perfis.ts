import { DataSource } from "typeorm";
import { Perfil } from "../models/user/Perfil";
import { PerfilPermissao } from "../models/user/PerfilPermissao";
import { seedAcoesCompletas } from "./seed-modulos-acoes";

/**
 * Cria e associa perfis de utilizadores com permissões detalhadas.
 * Evita duplicações e normaliza códigos para minúsculas.
 */
export default async function eedPerfisDetalhados(AppDataSource: DataSource) {
    const perfilRepo = AppDataSource.getRepository(Perfil);
    const perfilPermissaoRepo = AppDataSource.getRepository(PerfilPermissao);

    const { modulos, acoes } = await seedAcoesCompletas(AppDataSource);

    /**
     * Helper → Cria perfil se não existir
     */
    const createPerfilIfNotExists = async (nome: string, descricao: string, isAdmin = false) => {
        const existing = await perfilRepo.findOne({ where: { nome } });
        if (existing) {
            console.log(`⚠️ Perfil '${nome}' já existe.`);
            return existing;
        }
        const perfil = perfilRepo.create({ nome, descricao, isAdmin });
        await perfilRepo.save(perfil);
        console.log(`✅ Perfil '${nome}' criado com sucesso.`);
        return perfil;
    };

    /**
     * Criação de perfis
     */
    const superAdmin = await createPerfilIfNotExists(
        "Super Administrador",
        "Acesso total a todas as funcionalidades do sistema",
        true
    );

    const adminDirecao = await createPerfilIfNotExists(
        "Administrador de Direção",
        "Acesso total à direção com algumas restrições de sistema"
    );

    const gestorSolicitacoes = await createPerfilIfNotExists(
        "Gestor de Solicitações",
        "Gestão completa de solicitações da direção"
    );

    const tecnicoEspecializado = await createPerfilIfNotExists(
        "Técnico Especializado",
        "Acesso técnico com foco em intervenções e materiais"
    );

    const utilizadorBasico = await createPerfilIfNotExists(
        "Utilizador Básico",
        "Acesso básico para criar e acompanhar solicitações"
    );

    const auditor = await createPerfilIfNotExists(
        "Auditor",
        "Acesso apenas a relatórios e auditoria"
    );

    /**
     * Helper → Cria permissões em massa, validando duplicados
     */
    const addPermissoes = async (perfil: Perfil, permissoes: any[]) => {
        const novasPermissoes = [];
        for (const p of permissoes) {
            const exists = await perfilPermissaoRepo.findOne({
                where: {
                    perfil: { id: perfil.id },
                    modulo: { id: p.modulo.id },
                    acao: { id: p.acao.id },
                },
            });
            if (!exists) novasPermissoes.push(p);
        }
        if (novasPermissoes.length > 0) {
            await perfilPermissaoRepo.save(novasPermissoes);
            console.log(`✅ ${novasPermissoes.length} permissões adicionadas a '${perfil.nome}'.`);
        } else {
            console.log(`⚠️ Nenhuma nova permissão adicionada a '${perfil.nome}'.`);
        }
    };

    // 🔵 SUPER ADMIN → Todas as ações
    await addPermissoes(superAdmin, acoes.map(a => ({
        perfil: superAdmin,
        modulo: a.modulo,
        acao: a
    })));

    // 🔵 ADMIN DIREÇÃO
    await addPermissoes(adminDirecao, [
        ...acoes
            .filter(a => a.modulo.codigo.toLowerCase() === "solicitacoes" && a.codigo.toLowerCase() !== "delete")
            .map(a => ({ perfil: adminDirecao, modulo: a.modulo, acao: a })),

        ...acoes
            .filter(a => a.modulo.codigo.toLowerCase() === "relatorios")
            .map(a => ({ perfil: adminDirecao, modulo: a.modulo, acao: a })),

        ...acoes
            .filter(a => a.modulo.codigo.toLowerCase() === "configuracoes" && a.codigo.toLowerCase() === "view")
            .map(a => ({ perfil: adminDirecao, modulo: a.modulo, acao: a })),

        ...acoes
            .filter(a => a.modulo.codigo.toLowerCase() === "direcoes" && a.codigo.toLowerCase() === "view")
            .map(a => ({ perfil: adminDirecao, modulo: a.modulo, acao: a })),
    ]);

    // 🟡 GESTOR DE SOLICITAÇÕES
    await addPermissoes(gestorSolicitacoes, [
        ...acoes
            .filter(a => a.modulo.codigo.toLowerCase() === "solicitacoes" && !["delete", "view_all"].includes(a.codigo.toLowerCase()))
            .map(a => ({ perfil: gestorSolicitacoes, modulo: a.modulo, acao: a })),

        ...acoes
            .filter(a => a.modulo.codigo.toLowerCase() === "relatorios" && ["view_solicitacoes", "export_excel"].includes(a.codigo.toLowerCase()))
            .map(a => ({ perfil: gestorSolicitacoes, modulo: a.modulo, acao: a })),
    ]);

    // 🟢 TÉCNICO ESPECIALIZADO
    await addPermissoes(tecnicoEspecializado, [
        ...acoes
            .filter(a =>
                a.modulo.codigo.toLowerCase() === "solicitacoes" &&
                ["view_direcao", "edit", "comment"].includes(a.codigo.toLowerCase())
            )
            .map(a => ({ perfil: tecnicoEspecializado, modulo: a.modulo, acao: a })),

        ...acoes
            .filter(a =>
                a.modulo.codigo.toLowerCase() === "materiais" &&
                ["view_direcao", "register_entry", "register_exit", "manage_stock"].includes(a.codigo.toLowerCase())
            )
            .map(a => ({ perfil: tecnicoEspecializado, modulo: a.modulo, acao: a })),
    ]);

    // 🔴 UTILIZADOR BÁSICO
    await addPermissoes(utilizadorBasico, [
        ...acoes
            .filter(a =>
                a.modulo.codigo.toLowerCase() === "solicitacoes" &&
                ["view_own", "create", "edit_own"].includes(a.codigo.toLowerCase())
            )
            .map(a => ({ perfil: utilizadorBasico, modulo: a.modulo, acao: a })),

        ...acoes
            .filter(a =>
                a.modulo.codigo.toLowerCase() === "relatorios" &&
                ["view_general"].includes(a.codigo.toLowerCase())
            )
            .map(a => ({ perfil: utilizadorBasico, modulo: a.modulo, acao: a })),
    ]);

    // 🟣 AUDITOR
    await addPermissoes(auditor, [
        ...acoes
            .filter(a => ["auditoria", "relatorios"].includes(a.modulo.codigo.toLowerCase()))
            .map(a => ({ perfil: auditor, modulo: a.modulo, acao: a })),
    ]);

    console.log("🎯 Seed de perfis e permissões concluído com sucesso.");

    return {
        superAdmin,
        adminDirecao,
        gestorSolicitacoes,
        tecnicoEspecializado,
        utilizadorBasico,
        auditor,
    };
};
