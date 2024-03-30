import repository, { OrdersRepositoryInterface } from '../repositories/orders';
import OrderDTO, { Order } from '../dto/order';
import type { Result, PaginateResult, ReadOptions } from '../interfaces/manager';
import type { FlattenMaps, UpdateQuery } from 'mongoose';

export type OrderServiceInterface = OrderService;

class OrderService {
  private repository: OrdersRepositoryInterface;

  constructor() {
    this.repository = repository;
  }

  public create = async (data: Order): Promise<Result<Order> | null> => {
    data = new OrderDTO(data);
    return this.repository.create(data);
  };
  public read = ({ filter, options }: ReadOptions<Order>): Promise<PaginateResult<Order>> => this.repository.read({ filter, options });
  public readOne = (id: string): Promise<FlattenMaps<Order> | null> => this.repository.readOne(id);
  public update = (id: string, data: UpdateQuery<Order>): Promise<Result<Order> | null> => this.repository.update(id, data);
  public destroy = (id: string): Promise<Result<Order> | null> => this.repository.destroy(id);
}

const service = new OrderService();
export default service;