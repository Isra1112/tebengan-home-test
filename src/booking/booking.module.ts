import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { Booking } from './booking.entity';
import { BookingResolver } from './booking.resolver';
import { DateScalar } from 'src/config/datetime.scalar';

@Module({
  imports: [TypeOrmModule.forFeature([Booking])],
  controllers: [BookingController],
  providers: [BookingService,BookingResolver,
  DateScalar
],
})
export class BookingModule {}
