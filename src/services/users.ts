import { FindOneOptions, Repository, ILike, FindOptionsWhere, In, FindManyOptions } from 'typeorm';
import { Utilizador, EstadoUtilizador } from '../models/user/Utilizador';

import bcrypt from 'bcrypt';
import { Direcao } from '../models/user/direcao';
import { Gabinete } from '../models/user/Gabinete';
import { Perfil } from '../models/user/Perfil';
import { AtualizarSenhaDTO, AtualizarUtilizadorDTO, CriarUtilizadorDTO, FiltrosUtilizadorDTO, PermissoesUtilizadorDTO, UtilizadorDTO, UtilizadorListagemDTO } from '../repositories/dtos/user.dto';
import { AppDataSource } from '../loaders/database';

export class UserService {

    private userRepository = AppDataSource.getRepository(Utilizador);
    private direcaoRepository = AppDataSource.getRepository(Direcao);
    private gabineteRepository = AppDataSource.getRepository(Gabinete);
    private perfilRepository = AppDataSource.getRepository(Perfil);

    // ✅ LISTAR TODOS OS UTILIZADORES (método existente)
    public async findAll(): Promise<Utilizador[]> {
        return await this.userRepository.find({
            relations: ['perfil', 'direcao', 'gabinete']
        });
    }

    // ✅ ENCONTRAR UM UTILIZADOR (método existente)
    public async findOne(options: FindOneOptions<Utilizador>): Promise<Utilizador | null> {
        return await this.userRepository.findOne({
            ...options,
            relations: ['perfil', 'direcao', 'gabinete', 'perfil.permissoes', 'perfil.permissoes.modulo', 'perfil.permissoes.acao']
        });
    }

    // ✅ LISTAR COM FILTROS E PAGINAÇÃO
    public async listarUtilizadores(filtros: FiltrosUtilizadorDTO): Promise<{ utilizadores: UtilizadorListagemDTO[], pagination: any }> {
        const {
            page = 1,
            limit = 10,
            search,
            estado,
            direcaoId,
            gabineteId,
            perfilId,
            sortBy = 'nome',
            sortOrder = 'ASC'
        } = filtros;

        const skip = (page - 1) * limit;

        const queryBuilder = this.userRepository.createQueryBuilder('utilizador')
            .leftJoinAndSelect('utilizador.perfil', 'perfil')
            .leftJoinAndSelect('utilizador.direcao', 'direcao')
            .leftJoinAndSelect('utilizador.gabinete', 'gabinete')
            .where('1=1');

        // 🔍 Aplicar filtros
        if (search) {
            queryBuilder.andWhere('(utilizador.nome ILIKE :search OR utilizador.email ILIKE :search)', {
                search: `%${search}%`
            });
        }

        if (estado) {
            queryBuilder.andWhere('utilizador.estado = :estado', { estado });
        }

        if (direcaoId) {
            queryBuilder.andWhere('utilizador.direcao.id = :direcaoId', { direcaoId });
        }

        if (gabineteId) {
            queryBuilder.andWhere('utilizador.gabinete.id = :gabineteId', { gabineteId });
        }

        if (perfilId) {
            queryBuilder.andWhere('utilizador.perfil.id = :perfilId', { perfilId });
        }

        // 📊 Ordenação
        const order: any = {};
        order[`utilizador.${sortBy}`] = sortOrder.toUpperCase();
        queryBuilder.orderBy(order);

        // 📄 Paginação
        queryBuilder.skip(skip).take(limit);

        const [utilizadores, total] = await queryBuilder.getManyAndCount();

        const utilizadoresDTO = utilizadores.map(user => ({
            id: user.id,
            nome: user.nome,
            email: user.email,
            estado: user.estado,
            direcaoNome: user.direcao?.nome,
            gabineteNome: user.gabinete?.nome,
            perfilNome: user.perfil?.nome,
            ultimoLogin: user.ultimoLogin
        }));

        return {
            utilizadores: utilizadoresDTO,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasNext: page < Math.ceil(total / limit),
                hasPrev: page > 1
            }
        };
    }

    // ✅ OBTER UTILIZADOR POR ID
    public async obterUtilizadorPorId(id: string): Promise<UtilizadorDTO> {
        const utilizador = await this.userRepository.findOne({
            where: { id },
            relations: ['perfil', 'direcao', 'gabinete', 'perfil.permissoes', 'perfil.permissoes.modulo', 'perfil.permissoes.acao']
        });

        if (!utilizador) {
            throw new Error('Utilizador não encontrado');
        }

        return this.mapearParaDTO(utilizador);
    }

    // ✅ ENCONTRAR POR EMAIL
    public async findByEmail(email: string): Promise<Utilizador | null> {
        return await this.userRepository.findOne({
            where: { email },
            relations: ['perfil', 'direcao', 'gabinete', 'perfil.permissoes', 'perfil.permissoes.modulo', 'perfil.permissoes.acao']
        });
    }

    // ✅ CRIAR UTILIZADOR
    // ✅ MÉTODO RECOMENDADO: Mais simples e direto
    public async criarUtilizador(dto: CriarUtilizadorDTO): Promise<UtilizadorDTO> {
        // Verificar se email já existe
        if (await this.emailExists(dto.email)) {
            throw new Error('Já existe um utilizador com este email');
        }

        const a = await this.perfilRepository.findOne({ where: { id: dto.perfilId } });
        console.log('direcao:', a);
        // Buscar entidades relacionadas
        const [direcao, gabinete, perfil] = await Promise.all([
            dto.direcaoId ? this.direcaoRepository.findOne({ where: { id: dto.direcaoId } }) : Promise.resolve(null),
            dto.gabineteId ? this.gabineteRepository.findOne({ where: { id: dto.gabineteId } }) : Promise.resolve(null),
            dto.perfilId ? this.perfilRepository.findOne({ where: { id: dto.perfilId } }) : Promise.resolve(null),
        ]);
        console.log('dados:', direcao, gabinete, perfil);

        // Hash da senha
        const salt = await bcrypt.genSalt(12);
        const senhaHash = await bcrypt.hash(dto.senha, salt);
        const utilizador = new Utilizador();

        // Atribuir propriedades básicas
        utilizador.nome = dto.nome;
        utilizador.email = dto.email;
        utilizador.telefone = dto.telefone ?? '';
        utilizador.senhaHash = senhaHash;
        utilizador.saltHash = salt;
        utilizador.estado = dto.estado || EstadoUtilizador.ACTIVO;
        utilizador.avatar = dto.avatar ?? '';



        // Atribuir relações (apenas se existirem)
        if (direcao) utilizador.direcao = direcao;
        if (gabinete) utilizador.gabinete = gabinete;
        if (perfil) utilizador.perfil = perfil;

        // Salvar no banco de dados
        const utilizadorSalvo = await this.userRepository.save(utilizador);

        // Retornar DTO
        return this.mapearParaDTO(utilizadorSalvo);
    }

    // ✅ ATUALIZAR UTILIZADOR
    public async atualizarUtilizador(id: string, dto: AtualizarUtilizadorDTO): Promise<UtilizadorDTO> {
        const utilizadorExistente = await this.userRepository.findOne({ where: { id } });

        if (!utilizadorExistente) {
            throw new Error('Utilizador não encontrado');
        }

        // Verificar se email já existe (excluindo o próprio)
        if (dto.email && await this.emailExists(dto.email, id)) {
            throw new Error('Já existe um utilizador com este email');
        }

        // Buscar entidades relacionadas se fornecidas
        const updateData: any = { ...dto };

        if (dto.direcaoId) {
            updateData.direcao = await this.direcaoRepository.findOne({ where: { id: dto.direcaoId } });
            if (!updateData.direcao) {
                throw new Error('Direção não encontrada');
            }
        }

        if (dto.gabineteId) {
            updateData.gabinete = await this.gabineteRepository.findOne({ where: { id: dto.gabineteId } });
            if (!updateData.gabinete) {
                throw new Error('Gabinete não encontrado');
            }
        }

        if (dto.perfilId) {
            updateData.perfil = await this.perfilRepository.findOne({ where: { id: dto.perfilId } });
            if (!updateData.perfil) {
                throw new Error('Perfil não encontrado');
            }
        }

        await this.userRepository.update(id, updateData);
        const utilizadorAtualizado = await this.obterUtilizadorPorId(id);

        return utilizadorAtualizado;
    }

    // ✅ ATUALIZAR SENHA
    public async atualizarSenha(id: string, dto: AtualizarSenhaDTO): Promise<void> {
        const utilizador = await this.userRepository.findOne({ where: { id } });

        if (!utilizador) {
            throw new Error('Utilizador não encontrado');
        }

        // Verificar senha atual
        const isSenhaAtualValida = await bcrypt.compare(dto.senhaAtual, utilizador.senhaHash);

        if (!isSenhaAtualValida) {
            throw new Error('Senha atual incorreta');
        }

        // Verificar se nova senha é igual à confirmação
        if (dto.novaSenha !== dto.confirmarNovaSenha) {
            throw new Error('A nova senha e a confirmação não coincidem');
        }

        // Gerar novo hash
        const salt = await bcrypt.genSalt(12);
        const novaSenhaHash = await bcrypt.hash(dto.novaSenha, salt);

        await this.userRepository.update(id, {
            senhaHash: novaSenhaHash,
            saltHash: salt,
            updatedAt: new Date()
        });
    }

    // ✅ ATUALIZAR ESTADO
    public async atualizarEstado(id: string, estado: EstadoUtilizador): Promise<UtilizadorDTO> {
        await this.userRepository.update(id, {
            estado,
            updatedAt: new Date()
        });
        return await this.obterUtilizadorPorId(id);
    }

    // ✅ ELIMINAR UTILIZADOR (soft delete)
    public async eliminarUtilizador(id: string): Promise<void> {
        const utilizador = await this.userRepository.findOne({ where: { id } });

        if (!utilizador) {
            throw new Error('Utilizador não encontrado');
        }
        await this.userRepository.update(id, {
            estado: EstadoUtilizador.INACTIVO,
            updatedAt: new Date()
        });
    }

    // ✅ OBTER PERMISSÕES DO UTILIZADOR
    public async obterPermissoesUtilizador(id: string): Promise<PermissoesUtilizadorDTO> {
        const utilizador = await this.userRepository.findOne({
            where: { id },
            relations: ['perfil', 'perfil.permissoes', 'perfil.permissoes.modulo', 'perfil.permissoes.acao']
        });

        if (!utilizador) {
            throw new Error('Utilizador não encontrado');
        }

        const permissoes = utilizador.perfil?.permissoes?.map(pp =>
            `${pp.modulo.codigo}.${pp.acao.codigo}`
        ) || [];

        const resumo = {
            canViewAllSolicitacoes: permissoes.includes('SOLICITACOES.VIEW_ALL'),
            canApproveSolicitacoes: permissoes.includes('SOLICITACOES.APPROVE'),
            canManageUsers: permissoes.includes('UTILIZADORES.EDIT'),
            canViewReports: permissoes.some(p => p.startsWith('RELATORIOS.')),
            canManageMaterials: permissoes.some(p => p.startsWith('MATERIAIS.')),
            canAudit: permissoes.some(p => p.startsWith('AUDITORIA.')),
            isAdmin: utilizador.tipoAdmin || false
        };

        return {
            permissoes,
            resumo
        };
    }

    // ✅ VERIFICAR CREDENCIAIS
    public async verificarCredenciais(email: string, password: string): Promise<Utilizador | null> {
        const utilizador = await this.findByEmail(email);

        if (!utilizador) {
            return null;
        }

        const isPasswordValid = await bcrypt.compare(password, utilizador.senhaHash);

        if (!isPasswordValid) {
            return null;
        }

        return utilizador;
    }

    // ✅ ATUALIZAR ÚLTIMO LOGIN
    public async atualizarUltimoLogin(id: string): Promise<void> {
        await this.userRepository.update(id, {
            ultimoLogin: new Date()
        });
    }

    // ✅ LISTAR POR DIREÇÃO
    public async listarPorDirecao(direcaoId: string): Promise<UtilizadorListagemDTO[]> {
        const utilizadores = await this.userRepository.find({
            where: { direcao: { id: direcaoId } },
            relations: ['perfil', 'gabinete'],
            order: { nome: 'ASC' }
        });

        return utilizadores.map(user => ({
            id: user.id,
            nome: user.nome,
            email: user.email,
            estado: user.estado,
            direcaoNome: user.direcao?.nome,
            gabineteNome: user.gabinete?.nome,
            perfilNome: user.perfil?.nome,
            ultimoLogin: user.ultimoLogin
        }));
    }

    // ✅ LISTAR POR GABINETE
    public async listarPorGabinete(gabineteId: string): Promise<UtilizadorListagemDTO[]> {
        const utilizadores = await this.userRepository.find({
            where: { gabinete: { id: gabineteId } },
            relations: ['perfil', 'direcao'],
            order: { nome: 'ASC' }
        });

        return utilizadores.map(user => ({
            id: user.id,
            nome: user.nome,
            email: user.email,
            estado: user.estado,
            direcaoNome: user.direcao?.nome,
            gabineteNome: user.gabinete?.nome,
            perfilNome: user.perfil?.nome,
            ultimoLogin: user.ultimoLogin
        }));
    }

    // ✅ LISTAR POR PERFIL
    public async listarPorPerfil(perfilId: string): Promise<UtilizadorListagemDTO[]> {
        const utilizadores = await this.userRepository.find({
            where: { perfil: { id: perfilId } },
            relations: ['direcao', 'gabinete'],
            order: { nome: 'ASC' }
        });

        return utilizadores.map(user => ({
            id: user.id,
            nome: user.nome,
            email: user.email,
            estado: user.estado,
            direcaoNome: user.direcao?.nome,
            gabineteNome: user.gabinete?.nome,
            perfilNome: user.perfil?.nome,
            ultimoLogin: user.ultimoLogin
        }));
    }

    // ✅ OBTER ESTATÍSTICAS
    public async obterEstatisticas(): Promise<any> {
        const total = await this.userRepository.count();
        const porEstado = await this.userRepository
            .createQueryBuilder('utilizador')
            .select('utilizador.estado', 'estado')
            .addSelect('COUNT(utilizador.id)', 'quantidade')
            .groupBy('utilizador.estado')
            .getRawMany();

        const porDirecao = await this.userRepository
            .createQueryBuilder('utilizador')
            .leftJoin('utilizador.direcao', 'direcao')
            .select('direcao.nome', 'direcao')
            .addSelect('COUNT(utilizador.id)', 'quantidade')
            .where('utilizador.direcao IS NOT NULL')
            .groupBy('direcao.nome')
            .getRawMany();

        return {
            total,
            porEstado,
            porDirecao
        };
    }

    // ✅ VERIFICAR SE EMAIL EXISTE
    private async emailExists(email: string, excludeId?: string): Promise<boolean> {
        const where: FindOptionsWhere<Utilizador> = { email };

        if (excludeId) {
            where.id = excludeId as any;
        }

        const count = await this.userRepository.count({ where });
        return count > 0;
    }

    // ✅ MÉTODO PRIVADO: MAPEAR PARA DTO
    private mapearParaDTO(utilizador: Utilizador): UtilizadorDTO {
        return {
            id: utilizador.id,
            nome: utilizador.nome,
            email: utilizador.email,
            telefone: utilizador.telefone,
            estado: utilizador.estado,
            tipoAdmin: utilizador.tipoAdmin,
            avatar: utilizador.avatar,
            ultimoLogin: utilizador.ultimoLogin,
            emailVerificado: utilizador.emailVerificado,
            createdAt: utilizador.createdAt,
            updatedAt: utilizador.createdAt,
            direcao: utilizador.direcao ? {
                id: utilizador.direcao.id,
                nome: utilizador.direcao.nome,
                codigo: utilizador.direcao.codigo
            } : undefined,
            gabinete: utilizador.gabinete ? {
                id: utilizador.gabinete.id,
                nome: utilizador.gabinete.nome,
                codigo: utilizador.gabinete.codigo
            } : undefined,
            perfil: utilizador.perfil ? {
                id: utilizador.perfil.id,
                nome: utilizador.perfil.nome,
                descricao: utilizador.perfil.descricao
            } : undefined
        };
    }
}

export default UserService;
