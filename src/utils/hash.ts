import { genSaltSync, hashSync, compareSync } from 'bcrypt';

function createHash(password: string): string {
  return hashSync(password, genSaltSync());
}

function verifyHash(req: string, db: string): boolean {
  return compareSync(req, db);
}

export { createHash, verifyHash };
