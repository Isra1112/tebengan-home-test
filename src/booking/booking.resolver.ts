import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Booking, BookingInput } from "./booking.entity";
import { BookingService } from "./booking.service";
import { ValidationError } from "@nestjs/apollo";

@Resolver('Post')
// @UseInterceptors(CacheInterceptor)
export class BookingResolver {
    constructor(private readonly bookingService: BookingService) { 
    }

    @Query(() => String)
    sayHelloBooking(): string {
        return 'Hello World!';
    }

    @Query(() => [Booking])
    // @CacheKey('bookingList')
    // @CacheTTL(20)
    // @UseInterceptors(CacheInterceptor)
    async getListBooking(@Args('userId', { nullable: true, defaultValue: null }) userId: string): Promise<Booking[]> {
        
        if (userId) {
            return await this.bookingService.findAllByUserId(userId);
        }
        return await this.bookingService.findAll();
    }

    // @CacheKey('bookingList')
    @Mutation(() => Booking)
    async createBooking(@Args({ name: 'BookingInput', type: () => BookingInput }) booking: BookingInput): Promise<Booking> {
        let bookingDateToDate = new Date(booking.bookingDate);

        if (bookingDateToDate < new Date()) {
            throw new ValidationError('Booking date cannot be in the past');
        }

        let bookingToCreate = new Booking();
        bookingToCreate.name = booking.name;
        bookingToCreate.taskId = booking.taskId;
        bookingToCreate.userId = booking.userId;
        bookingToCreate.bookingDate = booking.bookingDate;


        return await this.bookingService.create(bookingToCreate);
    }

    // cancel booking
    @Mutation(() => Booking)
    async cancelBooking(@Args('id') id: string): Promise<Booking> {
        return await this.bookingService.delete(id);
    }
}