import repository, { ProductsRepositoryInterface } from '../repositories/products';
import ProductDTO, { Product } from '../dto/product';
import type { Result, PaginateResult, ReadOptions } from '../interfaces/manager';
import type { FlattenMaps, UpdateQuery } from 'mongoose';

export type ProductServiceInterface = ProductService;

class ProductService {
  private repository: ProductsRepositoryInterface;

  constructor() {
    this.repository = repository;
  }

  public create = async (data: Product): Promise<Result<Product> | null> => {
    data = new ProductDTO(data);
    return this.repository.create(data);
  };
  public read = ({ filter, options }: ReadOptions<Product>): Promise<PaginateResult<Product>> => this.repository.read({ filter, options });
  public readOne = (id: string): Promise<FlattenMaps<Product> | null> => this.repository.readOne(id);
  public update = (id: string, data: UpdateQuery<Product>): Promise<Result<Product> | null> => this.repository.update(id, data);
  public destroy = (id: string): Promise<Result<Product> | null> => this.repository.destroy(id);
}

const service = new ProductService();
export default service;
