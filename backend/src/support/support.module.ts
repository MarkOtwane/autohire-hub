import Module from 'module';
import { PrismaService } from 'src/prisma/prisma.service';
import { SupportController } from './support.controller';
import { SupportService } from './support.service';

@Module({
  controllers: [SupportController],
  providers: [SupportService, PrismaService],
})
export class SupportModule {}
