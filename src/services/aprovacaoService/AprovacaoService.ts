
// services/AprovacaoService.ts
import { AppDataSource } from '../../loaders/database';
import { AprovacaoSolicitacao, StatusAprovacao } from '../../models/AprovacaoSolicitacao';
import { Solicitacao } from '../../models/Solicitacao';
import { AprovacaoDTO } from './../../types/DTO/index';

export class AprovacaoService {
    private solicitacaoRepo = AppDataSource.getRepository(Solicitacao);
    private aprovacaoRepo = AppDataSource.getRepository(AprovacaoSolicitacao);

    /**
     * Iniciar fluxo de aprovação para uma solicitação
     */
    async iniciarFluxoAprovacao(aprovacaoData: AprovacaoDTO): Promise<void> {
        const solicitacao = await this.solicitacaoRepo.findOne({
            where: { id: aprovacaoData.solicitacaoId }
        });

        if (!solicitacao) {
            throw new Error('Solicitação não encontrada');
        }
        const aprovacao = new AprovacaoSolicitacao();
        aprovacao.solicitacaoId = aprovacaoData.solicitacaoId;
        aprovacao.usuarioAprovadorId = aprovacaoData.usuarioAprovadorId;
        aprovacao.status = StatusAprovacao.PENDENTE;
        aprovacao.observacoes = aprovacaoData.observacoes ?? ''
        await this.aprovacaoRepo.save(aprovacao);
    }

    async listarAprovacoes(
        page: number = 1,
        limit: number = 10,
        filtros?: any
    ): Promise<any> {
        const skip = (page - 1) * limit;
        const queryBuilder = this.aprovacaoRepo.createQueryBuilder('aprovacao')
            .orderBy('aprovacao.data_aprovacao', 'DESC')
            .skip(skip)
            .take(limit);

        // Aplicar filtros
        if (filtros) {
            if (filtros.solicitacaoId) {
                queryBuilder.andWhere('aprovacao.solicitacaoId = :solicitacaoId', {
                    solicitacaoId: filtros.solicitacaoId
                });
            }

            if (filtros.status) {
                queryBuilder.andWhere('aprovacao.status = :status', {
                    status: filtros.status
                });
            }

            if (filtros.usuarioAprovadorId) {
                queryBuilder.andWhere('aprovacao.usuarioAprovadorId = :usuarioAprovadorId', {
                    usuarioAprovadorId: filtros.usuarioAprovadorId
                });
            }
        }

        const [aprovacoes, total] = await queryBuilder.getManyAndCount();

        return {
            aprovacoes,
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


    async processarAprovacao(
        solicitacaoId: string,
        usuarioAprovadorId: string,
        aprovado: boolean,
        observacoes?: string
    ): Promise<AprovacaoSolicitacao> {

        const aprovacao = await this.aprovacaoRepo.findOne({
            where: {
                solicitacaoId,
                usuarioAprovadorId: usuarioAprovadorId
            },
            relations: ['solicitacao']
        });

        if (!aprovacao) {
            throw new Error('Registro de aprovação não encontrado');
        }

        if (aprovacao.status !== StatusAprovacao.PENDENTE) {
            throw new Error('Esta aprovação já foi processada');
        }

        // Atualizar aprovação
        aprovacao.status = aprovado ? StatusAprovacao.APROVADO : StatusAprovacao.REJEITADO;
        aprovacao.usuarioAprovadorId = usuarioAprovadorId;
        aprovacao.observacoes = observacoes ?? '';
        aprovacao.dataAprovacao = new Date();

        await this.aprovacaoRepo.save(aprovacao);

        // Verificar se todas as aprovações foram concluídas
        await this.verificarStatusFinalSolicitacao(solicitacaoId);

        return aprovacao;
    }

    /**
     * Verificar se todas as aprovações foram concluídas e atualizar status final
     */
    private async verificarStatusFinalSolicitacao(solicitacaoId: string): Promise<void> {
        const aprovacoes = await this.aprovacaoRepo.find({
            where: { solicitacaoId }
        });
    }
    async obterStatusAprovacao(solicitacaoId: string): Promise<any> {
        return true
    }
}
