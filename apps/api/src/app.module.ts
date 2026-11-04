import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EvaluationsModule } from './evaluations/evaluations.module';

@Module({
  imports: [EvaluationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
