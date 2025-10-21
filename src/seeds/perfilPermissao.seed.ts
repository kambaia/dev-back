
import { DataSource } from "typeorm";
import { Perfil } from "../models/user/Perfil";
import { Modulo } from "../models/user/Modulo";
import { Acao } from "../models/user/Acao";
import { PerfilPermissao } from "../models/user/PerfilPermissao";

export default async function perfilPermissaoSeed(dataSource: DataSource) {
  const perfilRepo = dataSource.getRepository(Perfil);
  const moduloRepo = dataSource.getRepository(Modulo);
  const acaoRepo = dataSource.getRepository(Acao);
  const perfilPermissaoRepo = dataSource.getRepository(PerfilPermissao);

  const adminPerfil = await perfilRepo.findOne({ where: { isAdmin: true } });
  if (!adminPerfil) {
    console.log("⚠️ Nenhum perfil administrador encontrado. Execute o seed de perfis primeiro.");
    return;
  }

  const modulos = await moduloRepo.find();
  const acoes = await acaoRepo.find();

  for (const modulo of modulos) {
    for (const acao of acoes) {
      const existe = await perfilPermissaoRepo.findOne({
        where: {
          perfil: { id: adminPerfil.id },
          modulo: { id: modulo.id },
          acao: { id: acao.id },
        },
      });

      if (!existe) {
        const novaPermissao = perfilPermissaoRepo.create({
          perfil: adminPerfil,
          modulo,
          acao,
        });
        await perfilPermissaoRepo.save(novaPermissao);
        console.log(`✅ Permissão criada: ${adminPerfil.nome} -> ${modulo.sigla} [${acao.sigla}]`);
      }
    }
  }

  console.log("🎉 Seed de permissões concluído com sucesso!");
};
