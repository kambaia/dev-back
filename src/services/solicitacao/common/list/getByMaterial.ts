import { AppDataSource } from "../../../../loaders/database";
import { Solicitacao } from "../../../../models/Solicitacao";
import { SolicitacaoDTO } from "../../../../types/DTO";
import { CampoOrganizadorService } from "../organization-data";

export class GETAllMaterialMyIDGet {
    private solicitacaoRepo = AppDataSource.getRepository(Solicitacao);


    public async obterSolicitacaoPorId(id: string): Promise<SolicitacaoDTO> {
        const solicitacao = await this.solicitacaoRepo.findOne({
            where: { id },
            relations: [
                'tipoSolicitacao',
                'valores',
                'valores.campoSolicitacao',
                'materiais'
            ]
        });

        if (!solicitacao) {
            throw new Error('Solicitação não encontrada');
        }

        const dto: SolicitacaoDTO = {
            id: solicitacao.id,
            tipoSolicitacaoId: solicitacao.tipoSolicitacaoId,
            numeroPedido: solicitacao.numeroPedido,
            codeBalcao: solicitacao.codeBalcao,
            direcao: solicitacao.direcao,
            observacoes: solicitacao.observacoes,
            aprovacoes: solicitacao.aprovacoes,
            enviadoPor: solicitacao.enviadoPor,
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
                destino: m.destino,
            })),
        };

        return dto;
    }


}
