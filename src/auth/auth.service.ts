import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { User, JwtPayload, TokenPair } from './interfaces/user.interface';
import { LoginDto } from './dto/auth.dto';
import { Role } from './enums/role.enum';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  // Token versions for rotation (consider moving to database in production)
  private tokenVersions: Map<string, number> = new Map();

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    // Initialize with demo users
    void this.initializeDemoUsers();
  }

  private async initializeDemoUsers() {
    const demoUsers = [
      {
        email: 'admin@example.com',
        password: await bcrypt.hash('admin123', 10),
        roles: [Role.ADMIN],
      },
      {
        email: 'staff@example.com',
        password: await bcrypt.hash('staff123', 10),
        roles: [Role.STAFF],
      },
      {
        email: 'user@example.com',
        password: await bcrypt.hash('user123', 10),
        roles: [Role.PUBLIC],
      },
    ];

    // Try to insert demo users using Prisma
    for (const user of demoUsers) {
      try {
        await this.prisma.user.upsert({
          where: { email: user.email },
          update: {},
          create: {
            email: user.email,
            password: user.password,
            roles: user.roles,
          },
        });
      } catch (error) {
        console.warn(`Failed to initialize user ${user.email}:`, error);
      }
    }
  }

  async login(loginDto: LoginDto): Promise<TokenPair> {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokenPair(user);
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    // Fetch user from database using Prisma
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return null;
    }

    // Initialize token version if not exists
    if (!this.tokenVersions.has(user.id)) {
      this.tokenVersions.set(user.id, 0);
    }

    return {
      id: user.id,
      email: user.email,
      password: user.password,
      roles: user.roles as Role[],
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  validateTokenVersion(userId: string, tokenVersion: number): boolean {
    const currentVersion = this.tokenVersions.get(userId);
    return currentVersion === tokenVersion;
  }

  async refreshTokens(user: JwtPayload): Promise<TokenPair> {
    // Fetch user from database using Prisma
    const fullUser = await this.prisma.user.findUnique({
      where: { id: user.sub },
    });

    if (!fullUser) {
      throw new UnauthorizedException('User not found');
    }

    // Increment token version for rotation
    const currentVersion = this.tokenVersions.get(fullUser.id) || 0;
    const newVersion = currentVersion + 1;
    this.tokenVersions.set(fullUser.id, newVersion);

    const userObj: User = {
      id: fullUser.id,
      email: fullUser.email,
      password: fullUser.password,
      roles: fullUser.roles as Role[],
      createdAt: fullUser.createdAt,
      updatedAt: fullUser.updatedAt,
    };

    return this.generateTokenPair(userObj, newVersion);
  }

  logout(userId: string): void {
    // Invalidate all tokens by incrementing version
    const currentVersion = this.tokenVersions.get(userId) || 0;
    this.tokenVersions.set(userId, currentVersion + 1);
  }

  private generateTokenPair(user: User, tokenVersion?: number): TokenPair {
    const version =
      tokenVersion !== undefined
        ? tokenVersion
        : this.tokenVersions.get(user.id) || 0;

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
      tokenVersion: version,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRATION'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION'),
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  // Helper method to create new users
  async createUser(
    email: string,
    password: string,
    roles: Role[],
  ): Promise<User> {
    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user using Prisma
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        roles,
      },
    });

    this.tokenVersions.set(user.id, 0);

    return {
      id: user.id,
      email: user.email,
      password: user.password,
      roles: user.roles as Role[],
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
