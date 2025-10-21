import { AppDataSource } from "../../../../loaders/database";
import { Balcao } from "../../../../models/Balcao";
import { Solicitacao } from "../../../../models/Solicitacao";
import { PaginatedResponse, SolicitacaoFiltros, SolicitacaoListItem } from "../../../../types/DTO";
import { CampoOrganizadorService } from "../organization-data";

import {
    Repository,
    Like,
    Between,
    FindManyOptions,
    ILike
} from "typeorm";

export class ListagemSolicitacaoServicos {
    private solicitacaoRepo: Repository<Solicitacao> = AppDataSource.getRepository(Solicitacao);


    // ✅ MÉTODO PRINCIPAL MELHORADO
    async listarSolicitacoes(
        page: number = 1,
        limit: number = 10,
        filtros?: SolicitacaoFiltros
    ): Promise<PaginatedResponse<SolicitacaoListItem>> {

        // Validar parâmetros
        this.validarParametros(page, limit);

        const skip = (page - 1) * limit;

        // ✅ OPÇÃO 1: Usando FindManyOptions (Mais simples e type-safe)
        const options = this.construirOpcoesConsulta(skip, limit, filtros);
        const [solicitacoes, total] = await this.solicitacaoRepo.findAndCount(options);

        console.log(solicitacoes);

        const solicitacoesProcessadas = await this.processarSolicitacoes(solicitacoes);

        return {
            solicitacoes: solicitacoesProcessadas,
            pagination: this.calcularPaginacao(page, limit, total)
        };
    }

    // ✅ MÉTODO COM FindManyOptions (Recomendado)
    private construirOpcoesConsulta(
        skip: number,
        limit: number,
        filtros?: SolicitacaoFiltros
    ): FindManyOptions<Solicitacao> {

        const options: FindManyOptions<Solicitacao> = {
            relations: {
                tipoSolicitacao: true,
                materiais: true,
                valores: {
                    campoSolicitacao: true
                },
                aprovacoes: true,
                balcao: true
            },
            order: { createdAt: 'DESC' },
            skip,
            take: limit
        };

        // Aplicar filtros dinamicamente
        if (filtros) {
            options.where = {};

            if (filtros.tipoSolicitacaoId) {
                options.where.tipoSolicitacaoId = filtros.tipoSolicitacaoId;
            }



            if (filtros.numeroPedido) {
                options.where.numeroPedido = ILike(`%${filtros.numeroPedido}%`);
            }
            if (filtros.codeBalcao) {
                options.where.codeBalcao = ILike(`%${filtros.codeBalcao}%`);
            }

            if (filtros.direcao) {
                options.where.direcao = filtros.direcao;
            }

            if (filtros.enviadoPor) {
                options.where.enviadoPor = ILike(`%${filtros.enviadoPor}%`);
            }

            if (filtros.dataInicio && filtros.dataFim) {
                options.where.createdAt = Between(filtros.dataInicio, filtros.dataFim);
            }
        }

        return options;
    }

    // ✅ MÉTODO ALTERNATIVO COM QUERY BUILDER
    private async construirQueryBuilder(
        skip: number,
        limit: number,
        filtros?: SolicitacaoFiltros
    ): Promise<[Solicitacao[], number]> {

        const queryBuilder = this.solicitacaoRepo.createQueryBuilder('s')
            .leftJoinAndSelect('s.tipoSolicitacao', 'tipo')
            .leftJoinAndSelect('s.materiais', 'materiais')
            .leftJoinAndSelect('s.enviadoPor', 'user')
            .leftJoinAndSelect('s.valores', 'valores')
            .leftJoinAndSelect('valores.campoSolicitacao', 'campo')
            .leftJoinAndSelect('s.aprovacoes', 'aprovacoes')
            .leftJoinAndSelect('s.balcao', 'balcao')
            .orderBy('s.createdAt', 'DESC')
            .skip(skip)
            .take(limit);

        // Aplicar filtros
        this.aplicarFiltrosQueryBuilder(queryBuilder, filtros);

        return await queryBuilder.getManyAndCount();
    }

    // ✅ APLICA FILTROS NO QUERY BUILDER
    private aplicarFiltrosQueryBuilder(queryBuilder: any, filtros?: SolicitacaoFiltros): void {
        if (!filtros) return;

        if (filtros.tipoSolicitacaoId) {
            queryBuilder.andWhere('s.tipoSolicitacaoId = :tipoId', {
                tipoId: filtros.tipoSolicitacaoId
            });
        }

        if (filtros.status) {
            queryBuilder.andWhere('s.status = :status', {
                status: filtros.status
            });
        }

        if (filtros.numeroPedido) {
            queryBuilder.andWhere('s.numeroPedido ILIKE :numeroPedido', {
                numeroPedido: `%${filtros.numeroPedido}%`
            });
        }

        if (filtros.balcaoId) {
            queryBuilder.andWhere('s.balcaoId = :balcaoId', {
                balcaoId: filtros.balcaoId
            });
        }

        if (filtros.codeBalcao) {
            queryBuilder.andWhere('s.codeBalcao ILIKE :codeBalcao', {
                codeBalcao: `%${filtros.codeBalcao}%`
            });
        }

        if (filtros.dataInicio && filtros.dataFim) {
            queryBuilder.andWhere('s.createdAt BETWEEN :dataInicio AND :dataFim', {
                dataInicio: filtros.dataInicio,
                dataFim: filtros.dataFim
            });
        }
    }

    // ✅ PROCESSAMENTO DOS DADOS
    private async processarSolicitacoes(solicitacoes: Solicitacao[]): Promise<SolicitacaoListItem[]> {
        return Promise.all(
            solicitacoes.map(async (solicitacao) => ({
                id: solicitacao.id,
                tipoSolicitacaoId: solicitacao?.tipoSolicitacaoId,
                nomeSolicitacao: solicitacao?.tipoSolicitacao.nome,
                numeroPedido: solicitacao.numeroPedido,
                direcao: solicitacao.direcao,
                observacoes: solicitacao.observacoes,
                balcao: solicitacao.balcao ? await CampoOrganizadorService.formatarBalcao(solicitacao.balcao) : undefined,
                aprovacoes: solicitacao.aprovacoes?.map(aprovacao => ({
                    id: aprovacao.id,
                    status: aprovacao.status,
                    usuarioAprovadorId: aprovacao.usuarioAprovadorId,
                    observacoes: aprovacao.observacoes,
                    dataAprovacao: aprovacao.dataAprovacao
                })) || [],
                campos: CampoOrganizadorService.organizarCamposSolicitacao(solicitacao.valores || []),
                materiais: solicitacao.materiais?.map(material => ({
                    id: material.id,
                    descricao: material.descricao,
                    quantidade: material.quantidade,
                    pn: material.pn,
                    marca: material.marca,
                    modelo: material.modelo,
                    estado: material.estado,
                    proveniencia: material.proveniencia,
                    destino: material.destino
                })) || [],
                totalMateriais: solicitacao.materiais?.length || 0,
                createdAt: solicitacao.createdAt,
                updatedAt: solicitacao.updatedAt
            }))
        );
    }



    // ✅ CÁLCULO DE PAGINAÇÃO
    private calcularPaginacao(page: number, limit: number, total: number) {
        const totalPages = Math.ceil(total / limit);

        return {
            page,
            limit,
            total,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1
        };
    }

    // ✅ VALIDAÇÃO DE PARÂMETROS
    private validarParametros(page: number, limit: number): void {
        if (page < 1) {
            throw new Error('Página deve ser maior que 0');
        }

        if (limit < 1 || limit > 100) {
            throw new Error('Limit deve estar entre 1 e 100');
        }
    }

    // ✅ MÉTODO PARA BUSCAR POR BALCÃO ESPECÍFICO
    async listarSolicitacoesPorBalcao(
        balcaoId: string,
        page: number = 1,
        limit: number = 10
    ): Promise<PaginatedResponse<SolicitacaoListItem>> {
        return await this.listarSolicitacoes(page, limit, { balcaoId });
    }

    // ✅ MÉTODO PARA BUSCAR DETALHES DE UMA SOLICITAÇÃO
    async obterSolicitacaoPorId(id: string): Promise<SolicitacaoListItem | null> {
        const solicitacao = await this.solicitacaoRepo.findOne({
            where: { id },
            relations: {
                tipoSolicitacao: true,
                materiais: true,
                valores: {
                    campoSolicitacao: true
                },
                aprovacoes: true,
                balcao: true
            }
        });

        if (!solicitacao) {
            return null;
        }

        const [solicitacaoProcessada] = await this.processarSolicitacoes([solicitacao]);
        return solicitacaoProcessada;
    }
}
