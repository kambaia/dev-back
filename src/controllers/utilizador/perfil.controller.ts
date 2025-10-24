import { Request, Response } from "express";
import { PerfilService } from "../../services/utilizador/perfil.service";

const service = new PerfilService();

export class PerfilController {
  async listar(req: Request, res: Response) {
    try {
      const perfis = await service.listar();
      return res.json({
        success: true,
        data: perfis,
        message: 'Perfis listados com sucesso'
      });
    } catch (error) {
      console.error('Erro ao listar perfis:', error);
      return res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }

  async buscar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const perfil = await service.buscarPorId(id);
      if (!perfil) return res.status(404).json({ 
        success: false,
        error: "Perfil não encontrado" 
      });
      return res.json({
        success: true,
        data: perfil
      });
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      return res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }

  async criar(req: Request, res: Response) {
    try {
      const novo = await service.criar(req.body);
      return res.status(201).json({
        success: true,
        data: novo,
        message: 'Perfil criado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao criar perfil:', error);
      return res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao criar perfil'
      });
    }
  }

  async atualizar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const atualizado = await service.atualizar(id, req.body);
      return res.json({
        success: true,
        data: atualizado,
        message: 'Perfil atualizado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      return res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao atualizar perfil'
      });
    }
  }

  async remover(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await service.remover(id);
      return res.status(200).json({
        success: true,
        message: 'Perfil removido com sucesso'
      });
    } catch (error) {
      console.error('Erro ao remover perfil:', error);
      return res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao remover perfil'
      });
    }
  }
}