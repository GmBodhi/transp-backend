import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

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

  @Get('public')
  @ApiOperation({ summary: 'Get public data' })
  @ApiResponse({ status: 200, description: 'Returns public data' })
  getPublicData(): { message: string; access: string } {
    return {
      message: 'This is public data',
      access: 'public',
    };
  }
}
