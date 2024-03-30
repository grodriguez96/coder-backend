type Res = Response<any, Record<string, any>>;

declare namespace Express {
  export interface Request {
    user: any;
    token: string;
  }
  export interface Response {
    success200: (x: any) => Res;
    success201: (x: any) => Res;
    error400: (x: any) => Res;
    error401: () => Res;
    error403: () => Res;
    error404: () => Res;
  }
}
