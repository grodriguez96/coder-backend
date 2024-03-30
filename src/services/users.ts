import repository, { UsersRepositoryInterface } from '../repositories/users';
import UserDTO, { User } from '../dto/user';
import type { Result, PaginateResult, ReadOptions } from '../interfaces/manager';
import type { FilterQuery, FlattenMaps, UpdateQuery } from 'mongoose';

export type UserServiceInterface = UserService;

class UserService {
  private repository: UsersRepositoryInterface;

  constructor() {
    this.repository = repository;
  }

  public create = async (data: User): Promise<Result<User> | null> => {
    data = new UserDTO(data);
    return this.repository.create(data);
  };
  public read = ({ filter, options }: ReadOptions<User>): Promise<PaginateResult<User>> => this.repository.read({ filter, options });
  public readOne = (id: string): Promise<FlattenMaps<User> | null> => this.repository.readOne(id);
  public readByEmail = (email: FilterQuery<User>) => this.repository.readByEmail(email);
  public update = (id: string, data: UpdateQuery<User>): Promise<Result<User> | null> => this.repository.update(id, data);
  public destroy = (id: string): Promise<Result<User> | null> => this.repository.destroy(id);
}

const service = new UserService();
export default service;
