// models/Solicitacao.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { TipoSolicitacao } from './TipoSolicitacao';
import { ValorSolicitacao } from './ValorSolicitacao';
import { MaterialSolicitacao } from './MaterialSolicitacao';
import { AprovacaoSolicitacao } from './AprovacaoSolicitacao';
import { Balcao } from './Balcao'; // ✅ Nova importação
@Entity('solicitacoes')
export class Solicitacao {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'tipo_solicitacao_id' })
    tipoSolicitacaoId: string;

    // ✅ ADICIONE ESTA COLUNA para a foreign key
    @Column({ name: 'balcao_id', type: 'uuid', nullable: true })
    codeBalcao: string;

    @Column({ name: 'numero_pedido', length: 50, unique: true, nullable: true })
    numeroPedido: string;

    @Column({ name: 'direcao', length: 50, nullable: true })
    direcao: string;

    @Column({ name: 'enviado_por', length: 50, nullable: true })
    enviadoPor: string;

    @Column({ type: 'text', nullable: true })
    observacoes: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;
    // Relations
    @ManyToOne(() => TipoSolicitacao, tipo => tipo.solicitacoes)
    @JoinColumn({ name: 'tipo_solicitacao_id' })
    tipoSolicitacao: TipoSolicitacao;

    // ✅ NOVO: Relacionamento com Balcão
    @ManyToOne(() => Balcao, balcao => balcao.solicitacoes, { nullable: true })
    @JoinColumn({ name: 'balcao_id' })
    balcao: Balcao;

    @OneToMany(() => ValorSolicitacao, valor => valor.solicitacao)
    valores: ValorSolicitacao[];

    @OneToMany(() => MaterialSolicitacao, material => material.solicitacao)
    materiais: MaterialSolicitacao[];

    @OneToMany(() => AprovacaoSolicitacao, aprovacao => aprovacao.solicitacao, {
        cascade: true,
        onDelete: 'CASCADE',
    })
    aprovacoes: AprovacaoSolicitacao[];
}
