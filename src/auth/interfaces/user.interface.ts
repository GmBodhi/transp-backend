import { Role } from '../enums/role.enum';

export interface User {
  id: string;
  email: string;
  password: string;
  roles: Role[];
  createdAt: Date;
  updatedAt: Date;
}

export interface JwtPayload {
  sub: string;
  email: string;
  roles: Role[];
  tokenVersion: number;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}
