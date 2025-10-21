import { DataSource } from 'typeorm';
import { Acao } from '../models/user/Acao';

export default async function seedAcoes(dataSource: DataSource) {
    const acaoRepo = dataSource.getRepository(Acao);
    const acoesComuns = [
        // CRUD básico
        { sigla: 'VIEW', nome: 'Visualizar', descricao: 'Permite visualizar dados e detalhes dos registos.' },
        { sigla: 'CREATE', nome: 'Criar', descricao: 'Permite criar novos registos no sistema.' },
        { sigla: 'EDIT', nome: 'Editar', descricao: 'Permite alterar registos existentes.' },
        { sigla: 'DELETE', nome: 'Eliminar', descricao: 'Permite eliminar registos de forma lógica ou física.' },

        // Operações adicionais
        { sigla: 'EXPORT', nome: 'Exportar', descricao: 'Permite exportar dados (Excel, PDF, CSV, etc.).' },
        { sigla: 'IMPORT', nome: 'Importar', descricao: 'Permite importar dados de ficheiros externos.' },
        { sigla: 'PRINT', nome: 'Imprimir', descricao: 'Permite imprimir relatórios, documentos ou listagens.' },
        { sigla: 'DUPLICATE', nome: 'Duplicar', descricao: 'Permite duplicar registos existentes.' },
        { sigla: 'ARCHIVE', nome: 'Arquivar', descricao: 'Permite arquivar registos antigos.' },
        { sigla: 'RESTORE', nome: 'Restaurar', descricao: 'Permite restaurar registos arquivados ou eliminados.' },

        // Workflow / Aprovaçãoz
        { sigla: 'APPROVE', nome: 'Aprovar', descricao: 'Permite aprovar solicitações ou processos.' },
        { sigla: 'REJECT', nome: 'Rejeitar', descricao: 'Permite rejeitar solicitações ou processos.' },
        { sigla: 'SUBMIT', nome: 'Submeter', descricao: 'Permite submeter um pedido ou processo para aprovação.' },
        { sigla: 'VALIDATE', nome: 'Validar', descricao: 'Permite validar dados antes da aprovação ou execução.' },
        { sigla: 'AUTHORIZE', nome: 'Autorizar', descricao: 'Permite autorizar operações críticas.' },

        // Auditoria / Log
        { sigla: 'HISTORY', nome: 'Histórico', descricao: 'Permite visualizar o histórico de alterações.' },
        { sigla: 'AUDIT', nome: 'Auditar', descricao: 'Permite executar auditorias sobre registos e ações.' },
        { sigla: 'LOGVIEW', nome: 'Visualizar Logs', descricao: 'Permite consultar logs de atividades do sistema.' },

        // Comunicação / Sistema
        { sigla: 'NOTIFY', nome: 'Notificar', descricao: 'Permite enviar notificações ou alertas.' },
        { sigla: 'EMAIL', nome: 'Enviar Email', descricao: 'Permite enviar comunicações por email.' },
        { sigla: 'DOWNLOAD', nome: 'Download', descricao: 'Permite descarregar documentos ou anexos.' },

        // Configuração / Administração
        { sigla: 'CONFIG', nome: 'Configurar', descricao: 'Permite alterar definições ou parâmetros do módulo.' },
        { sigla: 'SYNC', nome: 'Sincronizar', descricao: 'Permite sincronizar dados com sistemas externos.' },
        { sigla: 'RESET', nome: 'Reiniciar', descricao: 'Permite repor o estado inicial ou reiniciar o módulo.' },

        // Acesso / Controlo
        { sigla: 'ASSIGN', nome: 'Atribuir', descricao: 'Permite atribuir tarefas, papéis ou responsabilidades.' },
        { sigla: 'TRANSFER', nome: 'Transferir', descricao: 'Permite transferir registos entre utilizadores ou estados.' },
        { sigla: 'SHARE', nome: 'Partilhar', descricao: 'Permite partilhar dados ou relatórios com outros utilizadores.' },

        // Operações especiais
        { sigla: 'GENERATE', nome: 'Gerar', descricao: 'Permite gerar documentos, relatórios ou códigos automáticos.' },
        { sigla: 'EXECUTE', nome: 'Executar', descricao: 'Permite executar operações específicas (scripts, cálculos, etc.).' },
        { sigla: 'CLOSE', nome: 'Encerrar', descricao: 'Permite encerrar processos ou registos ativos.' },
        { sigla: 'OPEN', nome: 'Reabrir', descricao: 'Permite reabrir registos previamente encerrados.' },
    ];

    for (const acao of acoesComuns) {
        const exists = await acaoRepo.findOne({ where: { sigla: acao.sigla } });
        if (exists) continue;

        const novaAcao = acaoRepo.create({
            nome: acao.nome,
            sigla: acao.sigla,
            descricao: acao.descricao,
        });

        await acaoRepo.save(novaAcao);
    }
    console.log('✅ Seed de ações concluída!');
}
