import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { Gabinete } from './Gabinete';
import { Utilizador } from './Utilizador';

@Entity('direcao')
export class Direcao {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 150 })
    nome: string;

    @Column({ length: 10, nullable: true })
    codigo: string;

    @Column({ length: 255, nullable: true })
    descricao: string;

    @Column({ default: true })
    ativo: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @CreateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    // 🔗 RELACIONAMENTOS
    @OneToMany(() => Gabinete, (g) => g.direcao)
    gabinetes: Gabinete[];

    @OneToMany(() => Utilizador, (u) => u.direcao)
    utilizadores: Utilizador[];
}
