import { DataSource } from "typeorm";
import { Departamento } from "../models/user/Departamento";
import { Perfil } from "../models/user/Perfil";

export default async function perfilSeed(dataSource: DataSource) {

  const perfilRepo = dataSource.getRepository(Perfil);
  const departamentoRepo = dataSource.getRepository(Departamento);

  // Lista base de perfis do sistema
  const perfisBase = [
    {
      nome: "Administrador do Sistema",
      descricao: "Perfil com acesso total a todas as funcionalidades e módulos do sistema.",
      ativo: true,
      isAdmin: true,
      departamento: undefined,
    },

    {
      nome: "Diretor Executivo",
      descricao: "Coordena direções e supervisiona resultados institucionais.",
      ativo: true,
      isAdmin: false,
       departamento: undefined,
    }
  ];

  // Inserir perfis
  for (const perfilData of perfisBase) {
    const existe = await perfilRepo.findOne({ where: { nome: perfilData.nome } });
    if (!existe) {
      const novo = perfilRepo.create(perfilData);
      await perfilRepo.save(novo);
      console.log(`✅ Perfil criado: ${perfilData.nome}`);
    }
  }
};
