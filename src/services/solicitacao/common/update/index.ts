// services/SolicitacaoUpdateService.ts

import { AppDataSource } from "../../../../loaders/database";
import { MaterialSolicitacao } from "../../../../models/MaterialSolicitacao";
import { Solicitacao } from "../../../../models/Solicitacao";
import { ValorSolicitacao } from "../../../../models/ValorSolicitacao";
import { CampoValorInputDTO, MaterialSolicitacaoDTO, SolicitacaoDTO } from "../../../../types/DTO";


export class SolicitacaoUpdateService {
    private solicitacaoRepo = AppDataSource.getRepository(Solicitacao);
    private valorSolicitacaoRepo = AppDataSource.getRepository(ValorSolicitacao);
    private materialSolicitacaoRepo = AppDataSource.getRepository(MaterialSolicitacao);

    /**
     * Atualiza uma solicitação com os dados completos (igual à criação)
     */
    async atualizarSolicitacao(id: string, updateData: {
        numeroPedido?: string;
        observacoes?: string;
        campos: CampoValorInputDTO[];
        materiais: MaterialSolicitacaoDTO[];
    }): Promise<SolicitacaoDTO> {

        // Buscar solicitação existente
        const solicitacao = await this.solicitacaoRepo.findOne({
            where: { id },
            relations: ['valores', 'valores.campoSolicitacao', 'materiais']
        });

        if (!solicitacao) {
            throw new Error('Solicitação não encontrada');
        }

        // 1. Atualizar dados básicos
        if (updateData.numeroPedido !== undefined) {
            solicitacao.numeroPedido = updateData.numeroPedido;
        }
        if (updateData.observacoes !== undefined) {
            solicitacao.observacoes = updateData.observacoes;
        }
        await this.solicitacaoRepo.save(solicitacao);

        // 2. Atualizar campos
        await this.atualizarCampos(solicitacao.id, updateData.campos);

        // 3. Atualizar materiais
        await this.atualizarMateriais(solicitacao.id, updateData.materiais);

        return await this.obterSolicitacaoPorId(solicitacao.id);
    }

    /**
     * Atualiza os campos da solicitação
     */
    private async atualizarCampos(solicitacaoId: string, campos: CampoValorInputDTO[]): Promise<void> {
        // Buscar todos os valores atuais
        const valoresAtuais = await this.valorSolicitacaoRepo.find({
            where: { solicitacaoId },
            relations: ['campoSolicitacao']
        });

        for (const campo of campos) {
            // Encontrar valor existente para este campo
            const valorExistente = valoresAtuais.find(v =>
                v.campoSolicitacao.nomeCampo === campo.nomeCampo
            );

            if (valorExistente) {
                // Atualizar valor existente
                await this.atualizarValorCampo(valorExistente, campo.valor);
            }
            // Se não existir, simplesmente ignora (só atualiza os existentes)
        }
    }

    /**
     * Atualiza um valor de campo específico
     */
    private async atualizarValorCampo(valorExistente: ValorSolicitacao, novoValor: any): Promise<void> {
        const tipoCampo = valorExistente.campoSolicitacao.tipoCampo;

        // Limpar valores anteriores
        valorExistente.valorTexto = '';
        valorExistente.valorNumero = 0;
        valorExistente.valorData = undefined;
        valorExistente.valorBoolean = false;

        // Definir novo valor baseado no tipo
        switch (tipoCampo) {
            case 'texto':
            case 'opcoes':
                valorExistente.valorTexto = novoValor !== undefined && novoValor !== null ? novoValor.toString() : null;
                break;

            case 'numero':
                if (novoValor !== undefined && novoValor !== null && novoValor !== '') {
                    const numero = Number(novoValor);
                    if (!isNaN(numero)) {
                        valorExistente.valorNumero = numero;
                    }
                }
                break;

            case 'data':
                if (novoValor) {
                    const data = new Date(novoValor);
                    if (!isNaN(data.getTime())) {
                        valorExistente.valorData = data;
                    }
                }
                break;

            case 'boolean':
                if (novoValor !== undefined && novoValor !== null) {
                    valorExistente.valorBoolean = this.parseBoolean(novoValor);
                }
                break;
        }

        await this.valorSolicitacaoRepo.save(valorExistente);
    }

    /**
     * Atualiza os materiais da solicitação
     */
    private async atualizarMateriais(solicitacaoId: string, materiais: MaterialSolicitacaoDTO[]): Promise<void> {
        // Remover todos os materiais atuais
        const materiaisAtuais = await this.materialSolicitacaoRepo.find({
            where: { solicitacaoId }
        });

        for (const material of materiaisAtuais) {
            await this.materialSolicitacaoRepo.remove(material);
        }

        // Adicionar novos materiais
        for (const materialDto of materiais) {
            const material = new MaterialSolicitacao();
            material.solicitacaoId = solicitacaoId;
            material.descricao = materialDto.descricao;
            material.quantidade = materialDto.quantidade;
            material.pn = materialDto.pn ?? '';
            material.marca = materialDto.marca ?? '';
            material.modelo = materialDto.modelo ?? '';
            material.estado = materialDto.estado ?? '';
            material.proveniencia = materialDto.proveniencia ?? '';
            material.destino = materialDto.destino ?? '';
            await this.materialSolicitacaoRepo.save(material);
        }
    }

    /**
     * Método auxiliar para buscar solicitação (igual ao existente)
     */
    private async obterSolicitacaoPorId(id: string): Promise<SolicitacaoDTO> {
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

        return {
            id: solicitacao.id,
            numeroPedido: solicitacao.numeroPedido,
            status: solicitacao.status,
            dataSolicitacao: solicitacao.dataSolicitacao,
            dataConclusao: solicitacao.dataConclusao,
            observacoes: solicitacao.observacoes,
            tipoSolicitacaoId: solicitacao.tipoSolicitacaoId,
            tipoSolicitacaoNome: solicitacao.tipoSolicitacao.nome,
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
            campos: solicitacao.valores.map(v => ({
                nomeCampo: v.campoSolicitacao.nomeCampo,
                tipoCampo: v.campoSolicitacao.tipoCampo,
                obrigatorio: v.campoSolicitacao.obrigatorio,
                ordem: v.campoSolicitacao.ordem,
                valor: v.valor,
                opcoes: v.campoSolicitacao.opcoes
            })).sort((a, b) => a.ordem - b.ordem)
        };
    }

    private parseBoolean(valor: any): boolean {
        if (typeof valor === 'boolean') return valor;
        if (typeof valor === 'number') return valor === 1;
        if (typeof valor === 'string') {
            const str = valor.toLowerCase().trim();
            return str === 'true' || str === '1' || str === 'sim' || str === 'yes';
        }
        return Boolean(valor);
    }
}
