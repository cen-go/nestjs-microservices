import { Module } from '@nestjs/common';
import { CatalogController } from './catalog.controller';
import { CatalogService } from './catalog.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [ConfigModule.forRoot(), PrismaModule],
  controllers: [CatalogController],
  providers: [CatalogService],
})
export class CatalogModule {}
