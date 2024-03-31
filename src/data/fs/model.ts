import fs from 'fs';
import { FlattenMaps, FilterQuery, Types, PaginateOptions } from 'mongoose';
import { PaginateResult, Result, ReadOptions } from '../../interfaces/manager';
import Ajv from 'ajv';

interface SchemaField {
  type: StringConstructor | NumberConstructor | BooleanConstructor;
  required?: boolean;
  ref?: string;
}

interface Schema {
  [key: string]: SchemaField;
}

class Model<T extends { _id: string }> {
  private models: T[] = [];
  private dataPath: string;

  constructor(private path: string, private collection: string, private schema: Schema) {
    this.dataPath = `${this.path}/${this.collection}.json`;
    this.init();
  }

  private init(): void {
    try {
      const exists = fs.existsSync(this.dataPath);
      if (!exists) {
        const data = JSON.stringify([], null, 2);
        fs.writeFileSync(this.dataPath, data);
      } else {
        this.models = JSON.parse(fs.readFileSync(this.dataPath, 'utf-8'));
      }
    } catch (error) {
      throw error;
    }
  }

  public async create(data: T): Promise<Result<T>> {
    try {
      if (!this.validateData(data)) {
        throw new Error('Provided data is not valid according to the schema');
      }
      this.models.push(data);
      const jsonData = JSON.stringify(this.models, null, 2);
      await fs.promises.writeFile(this.dataPath, jsonData);
      return data as any;
    } catch (error: any) {
      throw new Error('Error creating the model: ' + error.message);
    }
  }

  private validateData(data: T): boolean {
    const ajv = new Ajv();

    const schema = {
      type: 'object',
      properties: Object.fromEntries(Object.entries(this.schema).map(([key, value]) => [key, { type: value.type.name.toLowerCase() }])),
      required: Object.keys(this.schema).filter((k) => this.schema[k].required),
      additionalProperties: true,
    };
    const validate = ajv.compile(schema);
    const valid = validate(data);

    if (!valid) throw Error(validate.errors?.map(({ instancePath, message }) => `${instancePath}: ${message}`).join(', '));
    return true;
  }

  private filterModel(filter: any): (d: T) => boolean {
    return (data: T): boolean => {
      return Object.entries(filter).every(([k, v]) => {
        if (v instanceof RegExp) {
          return v.test(data[k as keyof T] as string);
        } else if (typeof v === 'string') {
          return data[k as keyof T] === v;
        }
        return false;
      });
    };
  }

  private sortModel(model: any, sort: any): T[] {
    return model.sort((a: T, b: T) => {
      for (const key in sort) {
        const order = sort[key];
        if (a[key as keyof T] < b[key as keyof T]) return order === 'asc' ? -1 : 1;
        if (a[key as keyof T] > b[key as keyof T]) return order === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  public findById(id: string): Result<T> | null {
    try {
      const model = this.models.find((m) => m._id === id);
      if (model) {
        return model as any;
      } else {
        return null;
      }
    } catch (error) {
      throw new Error('Error finding the model by ID');
    }
  }

  public async findByIdAndUpdate(id: string, update: Partial<T>): Promise<Result<T> | null> {
    try {
      const modelIndex = this.models.findIndex((m) => m._id === id);
      if (modelIndex !== -1) {
        const updatedModel = { ...this.models[modelIndex], ...update };
        this.models[modelIndex] = updatedModel;
        const jsonData = JSON.stringify(this.models, null, 2);
        await fs.promises.writeFile(this.dataPath, jsonData);
        return updatedModel as any;
      } else {
        return null;
      }
    } catch (error) {
      throw new Error('Error updating the model by ID');
    }
  }

  public async findByIdAndDelete(id: string): Promise<Result<T> | null> {
    try {
      const index = this.models.findIndex((m) => m._id === id);
      if (index !== -1) {
        this.models.splice(index, 1);
        const jsonData = JSON.stringify(this.models, null, 2);
        await fs.promises.writeFile(this.dataPath, jsonData);
        return this.models as any;
      } else {
        return null;
      }
    } catch (error) {
      throw new Error('Error deleting the model by ID');
    }
  }

  public findOne(query: FilterQuery<T>): FlattenMaps<T> | null {
    try {
      const model = this.models.find(this.filterModel(query));
      if (model) {
        return model as any;
      } else {
        return null;
      }
    } catch (error) {
      throw new Error('Error finding the model by attributes');
    }
  }

  public async paginate(filter: FilterQuery<T> = {}, options: PaginateOptions = {}): Promise<PaginateResult<T>> {
    try {
      const { page = 1, limit = 10, sort = 1 } = options;
      let data = this.models;

      if (filter) {
        data = this.models.filter(this.filterModel(filter));
      }

      if (sort) {
        if (typeof sort === 'object') {
          data = this.sortModel(data, sort);
        }
      }

      Object.entries(this.schema).forEach(([key, { ref }]) => {
        const path = `${this.path}/${ref}.json`;
        if (ref && fs.existsSync(path)) {
          const refModel: T[] = JSON.parse(fs.readFileSync(path, 'utf-8'));
          data = data.map((d) => ({
            ...d,
            [key]: refModel.filter(({ _id }) => _id === d._id),
          }));
        }
      });

      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const paginatedModels: any = data.slice(startIndex, endIndex);
      return {
        docs: paginatedModels,
        totalDocs: data.length,
        limit,
        page,
        totalPages: Math.ceil(data.length / limit),
        nextPage: page < Math.ceil(data.length / limit) ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null,
        hasNextPage: page < Math.ceil(data.length / limit),
        hasPrevPage: page > 1,
        nextPageNumber: page < Math.ceil(data.length / limit) ? page + 1 : null,
        prevPageNumber: page > 1 ? page - 1 : null,
        offset: startIndex,
        pagingCounter: startIndex + 1,
      };
    } catch (error: any) {
      throw new Error('Error paginating the models: ' + error.message);
    }
  }
}

export default Model;
