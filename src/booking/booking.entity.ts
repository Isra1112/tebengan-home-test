import { Field, ID, InputType, ObjectType, DateScalarMode } from '@nestjs/graphql';
import { IsNotEmpty, Validate, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface, IsDefined } from 'class-validator';
import { Task } from '../task/task.entity';
import { User } from '../user/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, DeleteDateColumn } from 'typeorm';

@ValidatorConstraint({ name: 'bookingDateNotPast', async: false })
export class BookingDateNotPastConstraint implements ValidatorConstraintInterface {
    validate(bookingDate: Date, args: ValidationArguments) {
        const currentDate = new Date();
        return bookingDate >= currentDate;
    }

    defaultMessage(args: ValidationArguments) {
        return 'Booking date cannot be in the past';
    }
}

@ObjectType()
@Entity()
export class Booking {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field(() => String)
    @Column()
    name: string;

    @IsNotEmpty({ message: 'bookingDate is required' })
    @Validate(BookingDateNotPastConstraint, {
        message: 'Booking date cannot be in the past',
    })
    @Field(() => Date)
    @Column({ type: 'timestamp'}) 
    bookingDate: Date;

    @ManyToOne(() => Task, (task) => task.bookings)
    task: Task;

    @Column()
    taskId: string;

    @Field(() => User)
    @ManyToOne(() => User, (user) => user.booking)
    user: User;

    @Column()
    userId: string;

    // cancel booking date
    @Field(() => String,{ nullable: true, defaultValue: null })
    @Column({ nullable: true })
    @DeleteDateColumn({ name: 'deletedAt' })
    deletedAt: string;


}

@InputType("BookingInput")
export class BookingInput {
    @IsDefined({ message: 'name is required' })
    @Field(() => String)
    name: string;

    @IsDefined({ message: 'task is required' })
    @Field(() => String)
    taskId: string;

    @IsDefined({ message: 'user is required' })
    @Field(() => String)
    userId: string;

    // booking date canot lower than today
    @IsNotEmpty({ message: 'bookingDate is required' })
    @Validate(BookingDateNotPastConstraint, {
        message: 'Booking date cannot be in the past',
    })
    @Field(() => Date)
    bookingDate: Date;
}
