import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { Roles } from './auth/decorators/roles.decorator';
import { CurrentUser } from './auth/decorators/current-user.decorator';
import { Role } from './auth/enums/role.enum';
import type { JwtPayload } from './auth/interfaces/user.interface';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Get hello message' })
  @ApiResponse({ status: 200, description: 'Returns hello message' })
  getHello(): string {
    return this.appService.getHello();
  }

  // Public route - accessible without authentication
  @Get('public')
  @ApiOperation({ summary: 'Get public data' })
  @ApiResponse({ status: 200, description: 'Returns public data' })
  getPublicData(): { message: string; access: string } {
    return {
      message: 'This is public data',
      access: 'public',
    };
  }

  // Protected route - requires authentication
  @Get('protected')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get protected data' })
  @ApiResponse({ status: 200, description: 'Returns protected data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get staff data (Staff/Admin only)' })
  @ApiResponse({ status: 200, description: 'Returns staff data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get admin data (Admin only)' })
  @ApiResponse({ status: 200, description: 'Returns admin data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
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
