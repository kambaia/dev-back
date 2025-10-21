import { Departamento } from "../../models/user/Departamento";
import { DepartamentoRepository } from "../../repositories/user/departamento.repository";

export class DepartamentoService {
  async listar(): Promise<Departamento[]> {
    return DepartamentoRepository.find({
      relations: ["direcao", "gabinete", "modulos"],
      order: { createdAt: "DESC" },
    });
  }

  async buscarPorId(id: string): Promise<Departamento | null> {
    return DepartamentoRepository.findOne({
      where: { id },
      relations: ["direcao", "gabinete", "perfil", "modulos"],
    });
  }

  async criar(dados: Partial<Departamento>): Promise<Departamento> {
    const { nome, sigla, direcao, gabinete } = dados;

    if (!nome) throw new Error("O nome do departamento é obrigatório.");

    // Garante que apenas um dos relacionamentos (direção OU gabinete) é definido
    if (direcao && gabinete)
      throw new Error("O departamento não pode estar associado a Direção e Gabinete simultaneamente.");

    const novoDepartamento = DepartamentoRepository.create({
      nome,
      sigla,
      direcao,
      gabinete,
    });

    return DepartamentoRepository.save(novoDepartamento);
  }

  async atualizar(id: string, dados: Partial<Departamento>): Promise<Departamento> {
    const departamento = await this.buscarPorId(id);
    if (!departamento) throw new Error("Departamento não encontrado.");

    if (dados.direcao && dados.gabinete)
      throw new Error("O departamento não pode estar associado a Direção e Gabinete simultaneamente.");

    Object.assign(departamento, dados);
    return DepartamentoRepository.save(departamento);
  }

  async remover(id: string): Promise<void> {
    const departamento = await this.buscarPorId(id);
    if (!departamento) throw new Error("Departamento não encontrado.");
    await DepartamentoRepository.softRemove(departamento); // usa soft delete
  }
}
