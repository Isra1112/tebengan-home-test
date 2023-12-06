import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { Booking } from '../booking/booking.entity';
import { Column, Entity, ManyToOne,OneToMany, PrimaryGeneratedColumn } from 'typeorm';


@ObjectType()
@Entity()
export class Task {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column()
  title: string;

  @Field(() => [Booking], { nullable: true })
  @OneToMany(() => Booking, (booking) => booking.task)
  bookings: Booking[];

}

@InputType("TaskInput")
export class TaskInput {
  @Field(() => String)
  title: string;
}
