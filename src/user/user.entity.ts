import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Booking } from '../booking/booking.entity';
import { Task } from '../task/task.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column()
  name: string;

  @Field(() => String)
  @Column()
  address: String;

//   @Field(() => Task)
  @OneToMany(() => Booking, (booking) => booking.user)
  booking: Booking;
}


