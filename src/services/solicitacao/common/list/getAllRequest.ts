import { AppDataSource } from "../../../../loaders/database";
import { Solicitacao } from "../../../../models/Solicitacao";
import { CampoOrganizadorService } from "../organization-data";

export class GetAllSolicitacao {
    private solicitacaoRepo = AppDataSource.getRepository(Solicitacao);
    async listarSolicitacoes(page: number = 1, limit: number = 10, filtros?: any): Promise<any> {
        const skip = (page - 1) * limit;

        // Construir query base
        const queryBuilder = this.solicitacaoRepo.createQueryBuilder('s')
            .leftJoinAndSelect('s.tipoSolicitacao', 'tipo')
            .leftJoinAndSelect('s.materiais', 'materiais')
            .leftJoinAndSelect('s.valores', 'valores')
            .leftJoinAndSelect('valores.campoSolicitacao', 'campo')
            .leftJoinAndSelect('s.aprovacoes', 'aprovacoes') // ✅ ADICIONAR ESTA LINHA
            .orderBy('s.createdAt', 'DESC')
            .skip(skip)
            .take(limit);

        // Aplicar filtros se existirem
        if (filtros) {
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
                queryBuilder.andWhere('s.numeroPedido LIKE :numeroPedido', {
                    numeroPedido: `%${filtros.numeroPedido}%`
                });
            }

            if (filtros.dataInicio && filtros.dataFim) {
                queryBuilder.andWhere('s.dataSolicitacao BETWEEN :dataInicio AND :dataFim', {
                    dataInicio: filtros.dataInicio,
                    dataFim: filtros.dataFim
                });
            }
        }

        const [solicitacoes, total] = await queryBuilder.getManyAndCount();
        // Processar os dados para incluir campos organizados
        const solicitacoesComCampos = solicitacoes.map(solicitacao => {
            // Agrupar campos por nome para fácil acesso


            return {
                id: solicitacao.id,
                tipoSolicitacaoId: solicitacao.tipoSolicitacaoId,
                numeroPedido: solicitacao.numeroPedido,
                codeBalcao: solicitacao.codeBalcao,
                direcao: solicitacao.direcao,
                observacoes: solicitacao.observacoes,
                aprovacoes: solicitacao.aprovacoes.map(m => ({
                    id: m.id,
                    status: m.status,
                    usuarioAprovadorId: m.usuarioAprovadorId,
                    observacoes: m.observacoes,
                    dataAprovacao: m.dataAprovacao
                })),
                campos: CampoOrganizadorService.organizarCamposSolicitacao(solicitacao.valores),
                materiais: solicitacao.materiais.map(m => ({
                    id: m.id,
                    descricao: m.descricao,
                    quantidade: m.quantidade,
                    pn: m.pn,
                    marca: m.marca,
                    modelo: m.modelo,
                    estado: m.estado,
                    proveniencia: m.proveniencia,
                    destino: m.destino
                })),
                totalMateriais: solicitacao.materiais.length,
            };
        });

        return {
            solicitacoes: solicitacoesComCampos,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasNext: page < Math.ceil(total / limit),
                hasPrev: page > 1
            }
        };
    }

}
