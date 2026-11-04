import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      service: 'journeylens-api',
      timestamp: new Date().toISOString(),
    };
  }
}