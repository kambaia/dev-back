
import 'reflect-metadata';
import { DataSource, useContainer } from 'typeorm';
import Container from 'typedi';
import config from '../config';
import { Utilizador } from '../models/user/Utilizador';
import { TipoSolicitacao } from '../models/TipoSolicitacao';
import { Solicitacao } from '../models/Solicitacao';
import { CampoSolicitacao } from '../models/CampoSolicitacao';
import { MaterialSolicitacao } from '../models/MaterialSolicitacao';
import { ValorSolicitacao } from '../models/ValorSolicitacao';
import { Balcao } from '../models/Balcao';
import { AprovacaoSolicitacao } from '../models/AprovacaoSolicitacao';
import { seedTiposSolicitacao } from '../seeds/seedTiposSolicitacao';
import { Direcao } from '../models/user/direcao';
import { Perfil } from '../models/user/Perfil';
import { PerfilPermissao } from '../models/user/PerfilPermissao';
import { Acao } from '../models/user/Acao';
import { Modulo } from '../models/user/Modulo';
import { Gabinete } from '../models/user/Gabinete';
import { seedAcoesCompletas } from '../seeds/seed-modulos-acoes';
import seedPerfisDetalhados from '../seeds/seed-perfis';
import { seedPerfisDirecoesEspeciais } from '../seeds/seedPerfisDirecoesEspeciais';
import { seedDirecoesEspeciais } from '../seeds/seed-direcoes';


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
        Utilizador,
        Direcao,
        Gabinete,
        Perfil,
        PerfilPermissao,
        Acao,
        Modulo,
        TipoSolicitacao,
        Solicitacao,
        CampoSolicitacao,
        ValorSolicitacao,
        MaterialSolicitacao,
        Balcao,
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
        await seedPerfisDirecoesEspeciais(AppDataSource);
        await seedAcoesCompletas(AppDataSource);
        await seedPerfisDetalhados(AppDataSource);
        await seedPerfisDirecoesEspeciais(AppDataSource);
        await seedDirecoesEspeciais(AppDataSource)

        return AppDataSource;
    } catch (error) {
        console.error('❌ Erro ao conectar ao banco de dados:', error);
        process.exit(1);
    }
};
