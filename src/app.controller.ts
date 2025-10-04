import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { Roles } from './auth/decorators/roles.decorator';
import { CurrentUser } from './auth/decorators/current-user.decorator';
import { Role } from './auth/enums/role.enum';
import type { JwtPayload } from './auth/interfaces/user.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // Public route - accessible without authentication
  @Get('public')
  getPublicData(): { message: string; access: string } {
    return {
      message: 'This is public data',
      access: 'public',
    };
  }

  // Protected route - requires authentication
  @Get('protected')
  @UseGuards(JwtAuthGuard)
  getProtectedData(@CurrentUser() user: JwtPayload): {
    message: string;
    user: JwtPayload;
  } {
    return {
      message: 'This is protected data',
      user,
    };
  }

  // Staff only route
  @Get('staff')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.STAFF, Role.ADMIN)
  getStaffData(@CurrentUser() user: JwtPayload): {
    message: string;
    access: string;
    user: string;
  } {
    return {
      message: 'This is staff-only data',
      access: 'staff',
      user: user.email,
    };
  }

  // Admin only route
  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  getAdminData(@CurrentUser() user: JwtPayload): {
    message: string;
    access: string;
    user: string;
  } {
    return {
      message: 'This is admin-only data',
      access: 'admin',
      user: user.email,
    };
  }
}
