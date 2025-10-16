import { DataSource } from "typeorm";
import { Acao } from "../models/user/Acao";
import { Modulo } from "../models/user/Modulo";

export const seedAcoesCompletas = async (AppDataSource: DataSource) => {
    const moduloRepo = AppDataSource.getRepository(Modulo);
    const acaoRepo = AppDataSource.getRepository(Acao);

    // Helper para garantir minúsculas
    const normalize = (codigo: string) => codigo.toLowerCase();

    // Módulos base
    const modulosData = [
        { nome: 'Solicitações', descricao: 'Gestão de solicitações', codigo: 'solicitacoes', ordem: 1 },
        { nome: 'Utilizadores', descricao: 'Gestão de utilizadores', codigo: 'utilizadores', ordem: 2 },
        { nome: 'Relatórios', descricao: 'Relatórios do sistema', codigo: 'relatorios', ordem: 3 },
        { nome: 'Configurações', descricao: 'Configurações do sistema', codigo: 'configuracoes', ordem: 4 },
        { nome: 'Direções', descricao: 'Gestão de direções e gabinetes', codigo: 'direcoes', ordem: 5 },
        { nome: 'Balcões', descricao: 'Gestão de balcões', codigo: 'balcoes', ordem: 6 },
        { nome: 'Materiais', descricao: 'Gestão de inventário de materiais', codigo: 'materiais', ordem: 7 },
        { nome: 'Auditoria', descricao: 'Registos de auditoria do sistema', codigo: 'auditoria', ordem: 8 },
    ].map(m => ({ ...m, codigo: normalize(m.codigo) }));

    // 🔹 Verifica se já existem módulos e evita duplicar
    const modulos: Modulo[] = [];
    for (const moduloData of modulosData) {
        let modulo = await moduloRepo.findOne({ where: { codigo: moduloData.codigo } });
        if (!modulo) {
            modulo = moduloRepo.create(moduloData);
            await moduloRepo.save(modulo);
        }
        modulos.push(modulo);
    }

    // 🔹 Define as ações (já em minúsculas)
    const acoesData = [
        { nome: 'Visualizar Todas', codigo: 'view_all', modulo: modulos[0], descricao: 'Visualizar todas as solicitações' },
        { nome: 'Visualizar Próprias', codigo: 'view_own', modulo: modulos[0], descricao: 'Visualizar apenas solicitações próprias' },
        { nome: 'Visualizar da Direção', codigo: 'view_direcao', modulo: modulos[0], descricao: 'Visualizar solicitações da própria direção' },
        { nome: 'Criar', codigo: 'create', modulo: modulos[0], descricao: 'Criar nova solicitação' },
        { nome: 'Editar', codigo: 'edit', modulo: modulos[0], descricao: 'Editar solicitação' },
        { nome: 'Eliminar', codigo: 'delete', modulo: modulos[0], descricao: 'Eliminar solicitação' },
        { nome: 'Exportar', codigo: 'export', modulo: modulos[0], descricao: 'Exportar lista de solicitações' },
        // ⚙️ podes manter as restantes como já estão...
    ].map(a => ({ ...a, codigo: normalize(a.codigo) }));

    // 🔹 Evita duplicados nas ações
    const acoes: Acao[] = [];
    for (const acaoData of acoesData) {
        const existente = await acaoRepo.findOne({
            where: { codigo: acaoData.codigo, modulo: { id: acaoData.modulo.id } },
            relations: ["modulo"],
        });
        if (!existente) {
            const novaAcao = acaoRepo.create(acaoData);
            await acaoRepo.save(novaAcao);
            acoes.push(novaAcao);
        } else {
            acoes.push(existente);
        }
    }

    console.log("✅ Seed de módulos e ações concluído com validação!");
    return { modulos, acoes };
};
