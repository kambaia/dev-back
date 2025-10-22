// models/Solicitacao.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn, RelationId } from 'typeorm';
import { TipoSolicitacao } from './TipoSolicitacao';
import { ValorSolicitacao } from './ValorSolicitacao';
import { MaterialSolicitacao } from './MaterialSolicitacao';
import { AprovacaoSolicitacao } from './AprovacaoSolicitacao';
import { Balcao } from './Balcao';
import { Utilizador } from './user/Utilizador';
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


    @Column({ type: 'text', nullable: true })
    observacoes: string;

    @Column({ name: 'tipo_envio', nullable: true })
    tipoEnvio: boolean;

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


    @ManyToOne(() => Utilizador, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'created_by' })
    createdBy: Utilizador;

    @RelationId((s: Solicitacao) => s.createdBy)
    enviadoPor: string;


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
