import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { User } from './interfaces/user.interface';
import { LoginDto, SignupDto } from './dto/auth.dto';
import { Role } from './enums/role.enum';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {
    // Initialize with demo users
    // void this.initializeDemoUsers();
  }

  // Generate a non-expiring token
  private generateToken(userId: string): string {
    return crypto
      .createHash('sha256')
      .update(
        `${userId}-${Date.now()}-${crypto.randomBytes(16).toString('hex')}`,
      )
      .digest('hex');
  }

  private async initializeDemoUsers() {
    const demoUsers = [
      {
        email: 'admin@example.com',
        name: 'Admin User',
        password: 'admin123',
        roles: [Role.ADMIN],
      },
      {
        email: 'staff@example.com',
        name: 'Staff User',
        password: 'staff123',
        roles: [Role.STAFF],
      },
      {
        email: 'user@example.com',
        name: 'Regular User',
        password: 'user123',
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
            name: user.name,
            password: user.password,
            roles: user.roles,
          },
        });
      } catch (error) {
        console.warn(`Failed to initialize user ${user.email}:`, error);
      }
    }
  }

  async login(
    loginDto: LoginDto,
  ): Promise<{ user: Omit<User, 'password'>; token: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });

    if (!user || user.password !== loginDto.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate non-expiring token
    const token = this.generateToken(user.id);

    // Store token in database
    await this.prisma.user.update({
      where: { id: user.id },
      data: { token },
    });

    const { password, ...userWithoutPassword } = user;
    return {
      user: {
        ...userWithoutPassword,
        roles: user.roles as Role[],
      },
      token,
    };
  }

  async signup(
    signupDto: SignupDto,
  ): Promise<{ user: Omit<User, 'password'>; token: string }> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: signupDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const user = await this.prisma.user.create({
      data: {
        email: signupDto.email,
        password: signupDto.password,
        name: signupDto.name,
        roles: [Role.ADMIN],
      },
    });

    // Generate non-expiring token
    const token = this.generateToken(user.id);

    // Store token in database
    await this.prisma.user.update({
      where: { id: user.id },
      data: { token },
    });

    const { password, ...userWithoutPassword } = user;
    return {
      user: {
        ...userWithoutPassword,
        roles: user.roles as Role[],
      },
      token,
    };
  }

  // Validate token and return user
  async validateToken(token: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: { token },
    });

    if (!user) {
      return null;
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

  // Helper method to create new users
  async createUser(
    email: string,
    password: string,
    name: string,
    roles: Role[],
  ): Promise<User> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const user = await this.prisma.user.create({
      data: {
        email,
        name,
        password,
        roles,
      },
    });

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
