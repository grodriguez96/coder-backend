import OrdersDTO, { Order } from '../dto/order';
import dao from '../data/index.factory';
import type { Manager, ReadOptions, Result, PaginateResult } from '../interfaces/manager';
import type { FlattenMaps, UpdateQuery } from 'mongoose';

export type OrdersRepositoryInterface = OrdersRepository;

class OrdersRepository {
  private model: Manager<Order>;

  constructor() {
    this.model = dao.orders;
  }

  public create = async (data: Order): Promise<Result<Order> | null> => {
    data = new OrdersDTO(data);
    return this.model.create(data);
  };
  public read = ({ filter, options }: ReadOptions<Order>): Promise<PaginateResult<Order>> => this.model.read({ filter, options });
  public readOne = (id: string): Promise<FlattenMaps<Order> | null> => this.model.readOne(id);
  public update = (id: string, data: UpdateQuery<Order>): Promise<Result<Order> | null> => this.model.update(id, data);
  public destroy = (id: string): Promise<Result<Order> | null> => this.model.destroy(id);
}

const repository = new OrdersRepository();
export default repository;
