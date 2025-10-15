import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { Acao } from './Acao';
import { PerfilPermissao } from './PerfilPermissao';

@Entity('modulo')
export class Modulo {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 150 })
    nome: string;

    @Column({ length: 255, nullable: true })
    descricao: string;

    @Column({ length: 50, nullable: true })
    icone: string;

    @Column({ default: true })
    ativo: boolean;

    @Column({ default: 0 })
    ordem: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @CreateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    // 🔗 RELACIONAMENTOS
    @OneToMany(() => Acao, (acao) => acao.modulo)
    acoes: Acao[];

    @OneToMany(() => PerfilPermissao, (pp) => pp.modulo)
    perfilPermissoes: PerfilPermissao[];
}
