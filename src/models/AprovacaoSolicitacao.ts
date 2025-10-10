// models/AprovacaoSolicitacao.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Solicitacao } from './Solicitacao';

export enum StatusAprovacao {
    PENDENTE = 'pending',
    APROVADO = 'completed',
    REJEITADO = 'rejected',
    ACEITE = 'accept'
}


@Entity('aprovacoes_solicitacao')
export class AprovacaoSolicitacao {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'solicitacao_id' })
    solicitacaoId: string;

    @Column({
        type: 'enum',
        enum: StatusAprovacao,
        default: StatusAprovacao.PENDENTE
    })
    status: StatusAprovacao;

    @Column({ name: 'usuario_aprovador_id' })
    usuarioAprovadorId: string;

    @Column({ type: 'text', nullable: true })
    observacoes: string;

    @Column({ name: 'data_aprovacao', nullable: true })
    dataAprovacao: Date;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;
    // Relations
    @ManyToOne(() => Solicitacao, solicitacao => solicitacao.aprovacoes)
    @JoinColumn({ name: 'solicitacao_id' })
    solicitacao: Solicitacao;
}
