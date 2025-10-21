
import { AppDataSource } from "../../loaders/database";
import { PerfilPermissao } from "../../models/user/PerfilPermissao";
import { AcaoRepository } from "../../repositories/user/acao.repository";
import { ModuloRepository } from "../../repositories/user/modulo.repository";
import { PerfilPermissaoRepository } from "../../repositories/user/perfil-permissao.repository";
import { PerfilRepository } from "../../repositories/user/perfil.repository";
import { CreatePerfilPermissaoDto } from "../../types/DTO/CreatePerfilPermissaoDto";


export class PerfilPermissaoService {
  async listar(): Promise<PerfilPermissao[]> {
    return PerfilPermissaoRepository.find({
      relations: ["perfil", "modulo", "acao"],
      order: { createdAt: "DESC" },
    });
  }

  async listarPorPerfil(perfilId: string): Promise<PerfilPermissao[]> {
    return PerfilPermissaoRepository.find({
      where: { perfil: { id: perfilId } },
      relations: ["modulo", "acao"],
    });
  }

  async criar(dados: CreatePerfilPermissaoDto): Promise<PerfilPermissao> {
    const { perfilId, moduloId, acaoId } = dados;

    // 1. verificar parâmetros mínimos
    if (!perfilId || !moduloId || !acaoId) {
      throw new Error("perfilId, moduloId e acaoId são obrigatórios.");
    }

    // 2. buscar entidades necessárias
    const perfil = await PerfilRepository.findOne({ where: { id: perfilId } });
    if (!perfil) throw new Error("Perfil não encontrado.");

    const modulo = await ModuloRepository.findOne({ where: { id: moduloId } });
    if (!modulo) throw new Error("Módulo não encontrado.");

    const acao = await AcaoRepository.findOne({ where: { id: acaoId } });
    if (!acao) throw new Error("Ação não encontrada.");

    // 3. verificar se já existe permissão igual
    const existente = await PerfilPermissaoRepository.findOne({
      where: {
        perfil: { id: perfilId },
        modulo: { id: moduloId },
        acao: { id: acaoId },
      },
    });

    if (existente) {
      throw new Error("Permissão já existe para este perfil/modulo/ação.");
    }

    // 4. criar e salvar em transaction (boa prática)
    const saved = await AppDataSource.manager.transaction(async (manager) => {
      const nova = manager.create(PerfilPermissaoRepository.target as any, {
        perfil,
        modulo,
        acao,
      });

      return manager.save(PerfilPermissaoRepository.target as any, nova);
    });

    // 5. carregar relations completas antes de retornar
    const resultado = await PerfilPermissaoRepository.findOne({
      where: { id: (saved as PerfilPermissao).id },
      relations: ["perfil", "modulo", "acao"],
    });

    return resultado!;
  }

  async remover(id: string): Promise<void> {
    const item = await PerfilPermissaoRepository.findOneBy({ id });
    if (!item) throw new Error("Permissão não encontrada");
    await PerfilPermissaoRepository.remove(item);
  }
}
