import UserDTO, { User } from '../dto/user';
import dao from '../data/index.factory';
import type { Manager, ReadOptions, Result, PaginateResult } from '../interfaces/manager';
import type { FilterQuery, FlattenMaps, UpdateQuery } from 'mongoose';

export type UsersRepositoryInterface = UsersRepository;

class UsersRepository {
  private model: Manager<User>;

  constructor() {
    this.model = dao.users;
  }

  public create = async (data: User): Promise<Result<User> | null> => {
    data = new UserDTO(data);
    return this.model.create(data);
  };
  public read = ({ filter, options }: ReadOptions<User>): Promise<PaginateResult<User>> => this.model.read({ filter, options });
  public readOne = (id: string): Promise<FlattenMaps<User> | null> => this.model.readOne(id);
  public readByEmail = (email: FilterQuery<User>) => this.model.readByEmail(email);
  public update = (id: string, data: UpdateQuery<User>): Promise<Result<User> | null> => this.model.update(id, data);
  public destroy = (id: string): Promise<Result<User> | null> => this.model.destroy(id);
}

const repository = new UsersRepository();
export default repository;
