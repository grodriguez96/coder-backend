import ProductDTO, { Product } from '../dto/product';
import dao from '../data/index.factory';
import type { Manager, ReadOptions, Result, PaginateResult } from '../interfaces/manager';
import type { FlattenMaps, UpdateQuery } from 'mongoose';

export type ProductsRepositoryInterface = ProductsRepository;

class ProductsRepository {
  private model: Manager<Product>;

  constructor() {
    this.model = dao.products;
  }

  public create = async (data: Product): Promise<Result<Product> | null> => {
    data = new ProductDTO(data);
    return this.model.create(data);
  };
  public read = ({ filter, options }: ReadOptions<Product>): Promise<PaginateResult<Product>> => this.model.read({ filter, options });
  public readOne = (id: string): Promise<FlattenMaps<Product> | null> => this.model.readOne(id);
  public update = (id: string, data: UpdateQuery<Product>): Promise<Result<Product> | null> => this.model.update(id, data);
  public destroy = (id: string): Promise<Result<Product> | null> => this.model.destroy(id);
}

const repository = new ProductsRepository();
export default repository;
