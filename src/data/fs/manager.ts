import type { Manager, ReadOptions, Result, PaginateResult } from '../../interfaces/manager';
import notFoundOne from '../../utils/notFoundOne';
import { Types, PaginateModel, FilterQuery, Aggregate, FlattenMaps, UpdateQuery } from 'mongoose';

class FsManager<T> implements Manager<T> {
  private model: PaginateModel<T>;

  constructor(model: PaginateModel<T>) {
    this.model = model;
    this.init();
  }

  protected init(): void {}

  public create(data: T): Promise<Result<T>> {
    return this.model.create(data);
  }

  public read({ filter, options }: ReadOptions<T>): Promise<PaginateResult<T>> {
    console.log({ filter, options });
    return this.model.paginate(filter, options);
  }

  public async reportBill(uid: string): Promise<Aggregate<T[]>> {
    return this.model.aggregate([
      { $match: { user_id: new Types.ObjectId(uid) } },
      {
        $lookup: {
          from: 'products',
          foreignField: '_id',
          localField: 'productId',
          as: 'productId',
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [{ $arrayElemAt: ['$productId', 0] }, '$$ROOT'],
          },
        },
      },
      { $set: { subtotal: { $multiply: ['$price', '$quantity'] } } },
      { $group: { _id: '$userId', total: { $sum: '$subtotal' } } },
      {
        $project: {
          _id: false,
          userId: '$_id',
          total: '$total',
          date: new Date(),
          currency: 'USD',
        },
      },
      //{ $merge: { into: "bills" }}
    ]);
  }

  public async readOne(id: string): Promise<FlattenMaps<T> | null> {
    const one = await this.model.findById(id).lean();
    notFoundOne<T>(one);
    return one;
  }

  public readByEmail(email: FilterQuery<T>): Promise<Result<T> | null> {
    return this.model.findOne(email);
  }

  public async update(id: string, data: UpdateQuery<T>): Promise<Result<T> | null> {
    const one = await this.model.findByIdAndUpdate(id, data, { new: true });
    notFoundOne(one);
    return one;
  }

  public async destroy(id: string): Promise<Result<T> | null> {
    const one = await this.model.findByIdAndDelete(id);
    notFoundOne(one);
    return one;
  }
}

export default FsManager;
