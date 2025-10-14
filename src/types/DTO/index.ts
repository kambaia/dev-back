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
    aprovacoes: AprovacaoDTO[] =[]; // Adicionar informações de aprovação se necessário
}

export interface AprovacaoDTOCreate {
    solicitacaoId: string;
    status: StatusAprovacao;
    usuarioAprovadorId: string;
    observacoes?: string;
    dataAprovacao: Date;
}


export interface  AprovacaoDTO{
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
    codeBalcao?: string;
    observacoes?: string;
    aprovacao: AprovacaoDTOCreate;
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



// ✅ Interfaces Type-Safe
export interface SolicitacaoFiltros {
    tipoSolicitacaoId?: string;
    status?: string;
    numeroPedido?: string;
    dataInicio?: Date;
    dataFim?: Date;
    balcaoId?: string;
    codeBalcao?: string;
    direcao?: string;
    enviadoPor?: string;
}

export interface SolicitacaoListItem {
    id: string;
    tipoSolicitacaoId: string;
    numeroPedido: string;
    direcao: string;
    observacoes: string;
    nomeSolicitacao: string;
    enviadoPor?: string;
    balcao?: {
        id: string;
        nome: string;
        code_referencia: string;
        provincia?: string;
        municipio?: string;
        enderecoCompleto: string;
        coordenada: string;
    };
    aprovacoes: Array<{
        id: string;
        status: string;
        usuarioAprovadorId: string;
        observacoes: string;
        dataAprovacao: Date;
    }>;
    campos: any; // Ou defina uma interface específica
    materiais: Array<{
        id: string;
        descricao: string;
        quantidade: number;
        pn: string;
        marca: string;
        modelo: string;
        estado: string;
        proveniencia: string;
        destino: string;
    }>;
    totalMateriais: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface PaginatedResponse<T> {
    solicitacoes: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

