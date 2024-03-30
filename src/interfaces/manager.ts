import {
  FilterQuery,
  PaginateOptions,
  PaginateResult as MongoPaginateResult,
  Document,
  Aggregate,
  IfAny,
  Require_id,
  FlattenMaps,
  UpdateQuery,
} from 'mongoose';

export type ReadOptions<T> = {
  filter: FilterQuery<T>;
  options: PaginateOptions;
};
export type Result<T> = Document<unknown, {}, T> & Require_id<T>;
export type PaginateResult<T> = MongoPaginateResult<IfAny<T, any, Document<unknown, PaginateOptions, T> & Require_id<T>>>;

export interface Manager<T> {
  create(d: T): Promise<Result<T>>;
  read(d: ReadOptions<T>): Promise<PaginateResult<T>>;
  reportBill(uid: string): Promise<Aggregate<T[]>>;
  readOne(id: string): Promise<FlattenMaps<T> | null>;
  readByEmail(email: FilterQuery<T>): Promise<Result<T> | null>;
  update(id: string, data: UpdateQuery<T>): Promise<Result<T> | null>;
  destroy(id: string): Promise<Result<T> | null>;
}
