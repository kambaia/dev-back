import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { Direcao } from './direcao';
import { Utilizador } from './Utilizador';

@Entity('gabinete')
export class Gabinete {
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
    @ManyToOne(() => Direcao, (d) => d.gabinetes, { onDelete: 'CASCADE' })
    direcao: Direcao;

    @OneToMany(() => Utilizador, (u) => u.gabinete)
    utilizadores: Utilizador[];
}
