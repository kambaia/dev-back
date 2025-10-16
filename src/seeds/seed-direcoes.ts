import { DataSource } from "typeorm";
import { Gabinete } from "../models/user/Gabinete";
import { Direcao } from "../models/user/direcao";

interface DirecaoSeed {
    nome: string;
    codigo: string;
    descricao: string;
    gabinetes: {
        nome: string;
        codigo: string;
        descricao: string;
    }[];
}

export const seedDirecoesEspeciais = async (AppDataSource: DataSource) => {
    const direcaoRepo = AppDataSource.getRepository(Direcao);
    const gabineteRepo = AppDataSource.getRepository(Gabinete);

    const direcoes: DirecaoSeed[] = [
        {
            nome: "Direção de Proteção e Segurança",
            codigo: "dps",
            descricao:
                "Responsável pela proteção física e segurança das instalações, sistemas de vigilância, controlo de acessos e gestão de incidentes de segurança",
            gabinetes: [
                {
                    nome: "Gabinete de Segurança Física",
                    codigo: "gsf",
                    descricao: "Proteção física das instalações e controlo de acessos",
                },
                {
                    nome: "Gabinete de Sistemas de Vigilância",
                    codigo: "gsv",
                    descricao: "Gestão de sistemas CCTV, alarmes e monitorização",
                },
                {
                    nome: "Gabinete de Gestão de Incidentes",
                    codigo: "ggi",
                    descricao: "Resposta e gestão de incidentes de segurança",
                },
            ],
        },
        {
            nome: "Gabinetes de Suporte e Operações",
            codigo: "gso",
            descricao:
                "Responsável pelo suporte técnico, operações do dia-a-dia, manutenção de equipamentos e resolução de incidentes operacionais",
            gabinetes: [
                {
                    nome: "Gabinete de Suporte Técnico",
                    codigo: "gst",
                    descricao:
                        "Suporte técnico a utilizadores e resolução de incidentes",
                },
                {
                    nome: "Gabinete de Operações de Rede",
                    codigo: "gor",
                    descricao: "Gestão e monitorização da infraestrutura de rede",
                },
                {
                    nome: "Gabinete de Manutenção Preventiva",
                    codigo: "gmp",
                    descricao:
                        "Manutenção preventiva de equipamentos e sistemas",
                },
            ],
        },
        {
            nome: "Direção de Jurídico e Organização",
            codigo: "djo",
            descricao:
                "Responsável pelos assuntos jurídicos, conformidade legal, gestão de contratos e organização interna",
            gabinetes: [
                {
                    nome: "Gabinete Jurídico",
                    codigo: "gj",
                    descricao: "Assessoria jurídica e conformidade legal",
                },
                {
                    nome: "Gabinete de Contratos",
                    codigo: "gc",
                    descricao: "Gestão e revisão de contratos e acordos",
                },
                {
                    nome: "Gabinete de Organização e Processos",
                    codigo: "gop",
                    descricao: "Otimização de processos e organização interna",
                },
            ],
        },
        {
            nome: "Direção de Administração e Gestão",
            codigo: "admin",
            descricao:
                "Responsável pela administração financeira, recursos humanos, património e gestão administrativa",
            gabinetes: [
                {
                    nome: "Gabinete Financeiro",
                    codigo: "gf",
                    descricao: "Gestão financeira, orçamentos e contabilidade",
                },
                {
                    nome: "Gabinete de Recursos Humanos",
                    codigo: "grh",
                    descricao: "Gestão de pessoal, recrutamento e formação",
                },
                {
                    nome: "Gabinete de Património",
                    codigo: "gp",
                    descricao: "Gestão do património e inventário",
                },
            ],
        },
    ];

    const resultados: {
        direcao: Direcao;
        gabinetes: Gabinete[];
    }[] = [];

    for (const direcaoData of direcoes) {
        const codigoDirecao = direcaoData.codigo.toLowerCase();

        // ⚙️ Verifica se a direção já existe
        let direcao = await direcaoRepo.findOne({
            where: { codigo: codigoDirecao },
        });

        if (!direcao) {
            direcao = direcaoRepo.create({
                nome: direcaoData.nome,
                codigo: codigoDirecao,
                descricao: direcaoData.descricao,
            });
            direcao = await direcaoRepo.save(direcao);
            console.log(`✅ Direção criada: ${direcao.nome} (${codigoDirecao})`);
        } else {
            console.log(`ℹ️ Direção já existente: ${direcao.nome} (${codigoDirecao})`);
        }

        // ⚙️ Cria os gabinetes associados
        const gabinetes: Gabinete[] = [];

        for (const gabData of direcaoData.gabinetes) {
            const codigoGab = gabData.codigo.toLowerCase();
            const existente = await gabineteRepo.findOne({
                where: { codigo: codigoGab },
            });

            if (!existente) {
                const novoGab = gabineteRepo.create({
                    nome: gabData.nome,
                    codigo: codigoGab,
                    descricao: gabData.descricao,
                    direcao,
                });
                const saved = await gabineteRepo.save(novoGab);
                gabinetes.push(saved);
                console.log(`  ✅ Gabinete criado: ${gabData.nome} (${codigoGab})`);
            } else {
                console.log(`  ℹ️ Gabinete já existente: ${gabData.nome} (${codigoGab})`);
            }
        }

        resultados.push({ direcao, gabinetes });
    }

    console.log("🎯 Seed de direções especiais concluído com sucesso!\n");

    return resultados;
};
