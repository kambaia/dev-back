import { DataSource } from "typeorm";
import { Direcao } from "../models/user/direcao";
import { Gabinete } from "../models/user/Gabinete";

// seed-direcoes-especiais.ts
export const seedDirecoesEspeciais =  async (AppDataSource: DataSource) => {
    const direcaoRepo = AppDataSource.getRepository(Direcao);
    const gabineteRepo = AppDataSource.getRepository(Gabinete);

    // 🎯 DIREÇÃO DPS (Direção de Proteção e Segurança)
    const direcaoDPS = await direcaoRepo.save({
        nome: 'Direção de Proteção e Segurança',
        codigo: 'DPS',
        descricao: 'Responsável pela proteção física e segurança das instalações, sistemas de vigilância, controlo de acessos e gestão de incidentes de segurança'
    });

    // 🎯 DIREÇÃO GSO (Gabinetes de Suporte e Operações)
    const direcaoGSO = await direcaoRepo.save({
        nome: 'Gabinetes de Suporte e Operações',
        codigo: 'GSO',
        descricao: 'Responsável pelo suporte técnico, operações do dia-a-dia, manutenção de equipamentos e resolução de incidentes operacionais'
    });

    // 🎯 DIREÇÃO DJO (Direção de Jurídico e Organização)
    const direcaoDJO = await direcaoRepo.save({
        nome: 'Direção de Jurídico e Organização',
        codigo: 'DJO',
        descricao: 'Responsável pelos assuntos jurídicos, conformidade legal, gestão de contratos e organização interna'
    });

    // 🎯 DIREÇÃO ADMIN (Administração e Gestão)
    const direcaoADMIN = await direcaoRepo.save({
        nome: 'Direção de Administração e Gestão',
        codigo: 'ADMIN',
        descricao: 'Responsável pela administração financeira, recursos humanos, património e gestão administrativa'
    });

    // Criar gabinetes para cada direção
    const gabinetes = await gabineteRepo.save([
        // 🛡️ GABINETES DPS
        {
            nome: 'Gabinete de Segurança Física',
            codigo: 'GSF',
            descricao: 'Proteção física das instalações e controlo de acessos',
            direcao: direcaoDPS
        },
        {
            nome: 'Gabinete de Sistemas de Vigilância',
            codigo: 'GSV',
            descricao: 'Gestão de sistemas CCTV, alarmes e monitorização',
            direcao: direcaoDPS
        },
        {
            nome: 'Gabinete de Gestão de Incidentes',
            codigo: 'GGI',
            descricao: 'Resposta e gestão de incidentes de segurança',
            direcao: direcaoDPS
        },

        // 🔧 GABINETES GSO
        {
            nome: 'Gabinete de Suporte Técnico',
            codigo: 'GST',
            descricao: 'Suporte técnico a utilizadores e resolução de incidentes',
            direcao: direcaoGSO
        },
        {
            nome: 'Gabinete de Operações de Rede',
            codigo: 'GOR',
            descricao: 'Gestão e monitorização da infraestrutura de rede',
            direcao: direcaoGSO
        },
        {
            nome: 'Gabinete de Manutenção Preventiva',
            codigo: 'GMP',
            descricao: 'Manutenção preventiva de equipamentos e sistemas',
            direcao: direcaoGSO
        },

        // ⚖️ GABINETES DJO
        {
            nome: 'Gabinete Jurídico',
            codigo: 'GJ',
            descricao: 'Assessoria jurídica e conformidade legal',
            direcao: direcaoDJO
        },
        {
            nome: 'Gabinete de Contratos',
            codigo: 'GC',
            descricao: 'Gestão e revisão de contratos e acordos',
            direcao: direcaoDJO
        },
        {
            nome: 'Gabinete de Organização e Processos',
            codigo: 'GOP',
            descricao: 'Otimização de processos e organização interna',
            direcao: direcaoDJO
        },

        // 💼 GABINETES ADMIN
        {
            nome: 'Gabinete Financeiro',
            codigo: 'GF',
            descricao: 'Gestão financeira, orçamentos e contabilidade',
            direcao: direcaoADMIN
        },
        {
            nome: 'Gabinete de Recursos Humanos',
            codigo: 'GRH',
            descricao: 'Gestão de pessoal, recrutamento e formação',
            direcao: direcaoADMIN
        },
        {
            nome: 'Gabinete de Património',
            codigo: 'GP',
            descricao: 'Gestão do património e inventário',
            direcao: direcaoADMIN
        }
    ]);

    return { direcaoDPS, direcaoGSO, direcaoDJO, direcaoADMIN, gabinetes };
};
