import { AppDataSource } from "../../loaders/database";
import { Balcoes } from "../../models/Balcao";


export const BalcoesRepository = AppDataSource.getRepository(Balcoes);
