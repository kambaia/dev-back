import { StatusAprovacao } from "../../models/AprovacaoSolicitacao";

export class SolicitacaoDTO {
    id: string;
    codeBalcao:string;
    enviadoPor:string;
    numeroPedido?: string;
    direcao?:string;
    observacoes?: string;
    tipoSolicitacaoId: string;
    tipoSolicitacaoNome?: string;
    campos: any;
    materiais: MaterialSolicitacaoDTO[] = [];
    aprovacoes?: AprovacaoDTO[]; // Adicionar informações de aprovação se necessário
}

export interface AprovacaoDTO {
    id: string;
    solicitacaoId: string;
    status: StatusAprovacao;
    usuarioAprovadorId: string;
    observacoes: string | null;
    dataAprovacao: Date;
}


export interface AprovacaoDTOCreate {
    id: string;
    solicitacaoId: string;
    status: StatusAprovacao;
    usuarioAprovadorId: string | null;
    observacoes: string | null;
    dataCriacao: Date;
    dataAprovacao: Date | null;
}

export class CampoValorDTO {
    nomeCampo: string;
    tipoCampo: string;
    obrigatorio: boolean;
    ordem: number;
    valor?: any;
    opcoes?: string[];
}

export class CriarSolicitacaoDTO {
    tipoSolicitacaoId: string;
    direcao: string;
    numeroPedido?: string;
    codeBalcao: string;
    observacoes?: string;
    campos: CampoValorInputDTO[] = [];
    materiais: MaterialSolicitacaoDTO[] = [];
}

export class CampoValorInputDTO {
    nomeCampo: string;
    valor: any;
}

export class MaterialSolicitacaoDTO {
    id?: string;
    descricao: string;
    quantidade: number = 1;
    pn?: string;
    marca?: string;
    modelo?: string;
    referencia?: string;
    estado?: string;
    proveniencia?: string;
    destino?: string;
}
