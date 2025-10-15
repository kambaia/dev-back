import { Service } from 'typedi';
import { FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Utilizador } from '../models/user/Utilizador';

@Service()
export default class UserService {
  constructor(@InjectRepository(Utilizador) private readonly userRepository: Repository<Utilizador>) {}

  public async findAll(): Promise<Utilizador[]> {
    return await this.userRepository.find();
  }

  public async findOne(options: FindOneOptions<Utilizador>): Promise<Utilizador | null> {
    return await this.userRepository.findOne(options);
  }
}
