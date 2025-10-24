import { Departamento } from "../../models/user/Departamento";
import { DepartamentoRepository } from "../../repositories/user/departamento.repository";

export class DepartamentoService {
  async listar(direcaoId?: string): Promise<Departamento[]> {
    const whereCondition = direcaoId ? { direcao: { id: direcaoId } } : {};
    
    return DepartamentoRepository.find({
      where: whereCondition,
      relations: ["direcao", "modulos"],
      order: { createdAt: "DESC" },
    });
  }

  async buscarPorId(id: string): Promise<Departamento | null> {
    return DepartamentoRepository.findOne({
      where: { id },
      relations: ["direcao", "perfil", "modulos"],
    });
  }

  async criar(dados: Partial<Departamento>): Promise<Departamento> {
    const { nome, sigla, direcao } = dados;

    if (!nome) throw new Error("O nome do departamento é obrigatório.");

    const novoDepartamento = DepartamentoRepository.create({
      nome,
      sigla,
      direcao,
    });

    return DepartamentoRepository.save(novoDepartamento);
  }

  async atualizar(id: string, dados: Partial<Departamento>): Promise<Departamento> {
    const departamento = await this.buscarPorId(id);
    if (!departamento) throw new Error("Departamento não encontrado.");

    Object.assign(departamento, dados);
    return DepartamentoRepository.save(departamento);
  }

  async remover(id: string): Promise<void> {
    const departamento = await this.buscarPorId(id);
    if (!departamento) throw new Error("Departamento não encontrado.");
    await DepartamentoRepository.softRemove(departamento); // usa soft delete
  }
}
