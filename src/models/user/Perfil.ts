import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';

import { PerfilPermissao } from './PerfilPermissao';
import { Utilizador } from './Utilizador';

@Entity('perfil')
export class Perfil {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 100 })
    nome: string;

    @Column({ length: 255, nullable: true })
    descricao: string;

    @Column({ default: true })
    ativo: boolean;

    @Column({ default: false })
    isAdmin: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @CreateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    // 🔗 RELACIONAMENTOS
    @OneToMany(() => Utilizador, (user) => user.perfil)
    utilizadores: Utilizador[];

    @OneToMany(() => PerfilPermissao, (pp) => pp.perfil)
    permissoes: PerfilPermissao[];
}
