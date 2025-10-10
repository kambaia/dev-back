import 'reflect-metadata';
import { DataSource, useContainer } from 'typeorm';
import Container from 'typedi';
import config from '../config';
import { User } from '../models/User';
import { TipoSolicitacao } from '../models/TipoSolicitacao';
import { Solicitacao } from '../models/Solicitacao';
import { CampoSolicitacao } from '../models/CampoSolicitacao';
import { MaterialSolicitacao } from '../models/MaterialSolicitacao';
import { ValorSolicitacao } from '../models/ValorSolicitacao';
import { Balcoes } from '../models/Balcao';
import { AprovacaoSolicitacao } from '../models/AprovacaoSolicitacao';
import { seedTiposSolicitacao } from '../seeds/seedTiposSolicitacao';

useContainer(Container);

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: config.database.host,
  port: config.database.port,
  username: config.database.user,
  password: config.database.pass,
  database: config.database.name,
  synchronize: true,
  logging: false,
  entities: [
    User,
    TipoSolicitacao,
    Solicitacao,
    CampoSolicitacao,
    ValorSolicitacao,
    MaterialSolicitacao,
    Balcoes,
    AprovacaoSolicitacao,
  ],
  migrations: ['src/migrations/*.ts'],
});

export default async () => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log('✅ Conexão com o banco de dados estabelecida com sucesso!');
    }

    // Mostrar tabelas existentes
    const queryRunner = AppDataSource.createQueryRunner();
    const result = await queryRunner.query(`
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public'
      ORDER BY tablename;
    `);

    console.log('\n📦 Tabelas encontradas no banco de dados:');
    result.forEach((row: any) => console.log(`- ${row.tablename}`));
    console.log('-------------------------------------------\n');

    await queryRunner.release();

    // Executar seeds
    await seedTiposSolicitacao(AppDataSource);

    return AppDataSource;
  } catch (error) {
    console.error('❌ Erro ao conectar ao banco de dados:', error);
    process.exit(1);
  }
};
