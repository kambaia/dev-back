import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity({ name: 'balcoes' })
export class Balcoes {
   @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 200 })
  nome!: string;

  @Index({ unique: true })
  @Column({ name: 'code_referencia', type: 'varchar', length: 100 })
  code_referencia!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  provincia?: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  municipio?: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  bairro?: string | null;

  @Column({ type: 'varchar', length: 200, nullable: true })
  rua?: string | null;
  // Coordenadas geográficas ou localização aproximada (ex: "lat,lng" ou formato JSON)
  @Column({ type: 'varchar', length: 255, nullable: true })
  coordenada?: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
