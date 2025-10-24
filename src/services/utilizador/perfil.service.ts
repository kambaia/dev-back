import { Perfil } from "../../models/user/Perfil";
import { PerfilRepository } from "../../repositories/user/perfil.repository";

export class PerfilService {
  async listar(): Promise<Perfil[]> {
    try {
      return await PerfilRepository.find({
        relations: [
          "departamento", 
          "departamento.direcao", 
          "departamento.gabinete",
          "permissoes", 
          "permissoes.modulo", 
          "permissoes.acao"
        ],
        order: { createdAt: "DESC" },
      });
    } catch (error) {
      console.error('Erro ao listar perfis no serviço:', error);
      throw new Error('Erro ao buscar perfis');
    }
  }

  async buscarPorId(id: string): Promise<Perfil | null> {
    try {
      if (!id) {
        throw new Error('ID é obrigatório');
      }
      
      return await PerfilRepository.findOne({
        where: { id },
        relations: ["departamento", "permissoes", "permissoes.modulo", "permissoes.acao"],
      });
    } catch (error) {
      console.error('Erro ao buscar perfil por ID no serviço:', error);
      throw new Error('Erro ao buscar perfil');
    }
  }

  async criar(dados: Partial<Perfil>): Promise<Perfil> {
    try {
      // Validações básicas
      if (!dados.papel) {
        throw new Error('Papel é obrigatório');
      }

      // Verificar se já existe um perfil com o mesmo papel
      const perfilExistente = await PerfilRepository.findOne({
        where: { papel: dados.papel }
      });

      if (perfilExistente) {
        throw new Error('Já existe um perfil com este papel');
      }

      // Verificar se o departamento existe
      let departamentoRelacionado = null;
      if (dados.departamento) {
        const { DepartamentoRepository } = await import('../../repositories/user/departamento.repository');
        departamentoRelacionado = await DepartamentoRepository.findOne({
          where: { id: dados.departamento }
        });
        
        if (!departamentoRelacionado) {
          throw new Error('Departamento não encontrado');
        }
      }

      const novoPerfil = PerfilRepository.create({
        papel: dados.papel,
        descricao: dados.descricao || '',
        ativo: dados.ativo !== undefined ? dados.ativo : true,
        isAdmin: dados.isAdmin || false,
        restricao: dados.restricao || '',
        departamento: departamentoRelacionado
      });

      return await PerfilRepository.save(novoPerfil);
    } catch (error) {
      console.error('Erro ao criar perfil no serviço:', error);
      throw error;
    }
  }

  async atualizar(id: string, dados: Partial<Perfil>): Promise<Perfil> {
    try {
      if (!id) {
        throw new Error('ID é obrigatório');
      }

      const perfil = await this.buscarPorId(id);
      if (!perfil) {
        throw new Error("Perfil não encontrado");
      }

      // Se está alterando o papel, verificar se não existe outro com o mesmo papel
      if (dados.papel && dados.papel !== perfil.papel) {
        const perfilExistente = await PerfilRepository.findOne({
          where: { papel: dados.papel }
        });

        if (perfilExistente && perfilExistente.id !== id) {
          throw new Error('Já existe um perfil com este papel');
        }
      }

      // Tratar atualização do departamento
      if (dados.departamento) {
        const { DepartamentoRepository } = await import('../../repositories/user/departamento.repository');
        const departamentoRelacionado = await DepartamentoRepository.findOne({
          where: { id: dados.departamento }
        });
        
        if (!departamentoRelacionado) {
          throw new Error('Departamento não encontrado');
        }
        
        perfil.departamento = departamentoRelacionado;
      }

      // Atualizar outros campos
      if (dados.papel) perfil.papel = dados.papel;
      if (dados.descricao !== undefined) perfil.descricao = dados.descricao;
      if (dados.ativo !== undefined) perfil.ativo = dados.ativo;
      if (dados.isAdmin !== undefined) perfil.isAdmin = dados.isAdmin;
      if (dados.restricao !== undefined) perfil.restricao = dados.restricao;

      return await PerfilRepository.save(perfil);
    } catch (error) {
      console.error('Erro ao atualizar perfil no serviço:', error);
      throw error;
    }
  }

  async remover(id: string): Promise<void> {
    try {
      if (!id) {
        throw new Error('ID é obrigatório');
      }

      const perfil = await this.buscarPorId(id);
      if (!perfil) {
        throw new Error("Perfil não encontrado");
      }

      // Verificar se há utilizadores associados a este perfil
      const utilizadoresComPerfil = await PerfilRepository
        .createQueryBuilder('perfil')
        .leftJoin('perfil.utilizadores', 'utilizador')
        .where('perfil.id = :id', { id })
        .andWhere('utilizador.id IS NOT NULL')
        .getCount();

      if (utilizadoresComPerfil > 0) {
        throw new Error('Não é possível remover perfil que possui utilizadores associados');
      }

      await PerfilRepository.remove(perfil);
    } catch (error) {
      console.error('Erro ao remover perfil no serviço:', error);
      throw error;
    }
  }
}