import { Test, TestingModule } from '@nestjs/testing';
import { BookingResolver } from './booking.resolver';
import { BookingService } from './booking.service';
import { Booking, BookingInput } from './booking.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Task } from '../task/task.entity';
import { User } from '../user/user.entity';



describe('BookingResolver', () => {
    let resolver: BookingResolver;
    let bookingService: BookingService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BookingResolver,
                {
                    provide: BookingService,
                    useValue: {
                        sayHello: jest.fn(),
                        getListBooking: jest.fn(),
                        createBooking: jest.fn(),
                        cancelBooking: jest.fn(),
                        findAll: jest.fn().mockResolvedValue([new Booking()]), 
                        findAllByUserId: jest.fn().mockResolvedValue([new Booking()]), 
                        create: jest.fn().mockResolvedValue(new Booking()), 
                        delete: jest.fn().mockResolvedValue(new Booking()), 
                    },
                },
                {
                    provide: getRepositoryToken(Booking),
                    useClass: Repository,
                },
                {
                    provide: CACHE_MANAGER,
                    useValue: {
                        get: jest.fn(),
                        set: jest.fn(),
                        del: jest.fn(),
                    },
                },
            ],
        }).compile();

        resolver = module.get<BookingResolver>(BookingResolver);
        bookingService = module.get<BookingService>(BookingService);
    });

    describe('getListBooking', () => {
        it('should return all bookings', async () => {
            const bookings = await resolver.getListBooking(null);
            expect(bookings).toBeInstanceOf(Array);
            expect(bookings.length).toBeGreaterThan(0);

            // Verify that the mock method `findAll` is called
            expect(bookingService.findAll).toHaveBeenCalledTimes(1);
        });

        it('should return bookings for specific user', async () => {
            const userId = 'user-123';

            // Mock the response for `findAllByUserId`
            const userSpecificBookings = [
                {
                    id: 'booking-1',
                    name: 'My booking',
                    bookingDate: new Date(),
                    taskId: '1',
                    userId: userId,
                    deletedAt: null,
                    task: new Task,
                    user: new User
                }
            ];
            (bookingService.findAllByUserId as jest.Mock).mockResolvedValue(userSpecificBookings);

            const bookings = await resolver.getListBooking(userId);
            expect(bookings).toBeInstanceOf(Array);

            // Verify database call with specific userId
            expect(bookingService.findAllByUserId).toHaveBeenCalledTimes(1);
            expect(bookingService.findAllByUserId).toHaveBeenCalledWith(userId);
        });
    });

    describe('createBooking', () => {
        it('should create a new booking', async () => {
            let bookingDate = new Date();
            bookingDate.setDate(bookingDate.getDate() + 1);
            const bookingInput = {
                name: 'My new booking',
                bookingDate: bookingDate,
            } as BookingInput;
    
            // Mock the response for the create method
            const createdBooking: Booking = {
                id: 'some-id',
                name: 'My new booking',
                bookingDate: bookingDate,
                taskId: '1',
                userId: '1',
                deletedAt: null,
                task: new Task,
                user: new User
            };
            (bookingService.create as jest.Mock).mockResolvedValue(createdBooking);
    
            const result = await resolver.createBooking(bookingInput);
    
            expect(result).toEqual(createdBooking);
            expect(bookingService.create).toHaveBeenCalledTimes(1);
            expect(bookingService.create).toHaveBeenCalledWith(bookingInput);
        });
    });

    describe('cancelBooking', () => {
        it('should soft delete a booking', async () => {
            const id = 'booking-id';
            const deletedBooking = await resolver.cancelBooking(id);
            expect(deletedBooking).toBeInstanceOf(Booking);

            // Verify database call with correct ID
              expect(bookingService.delete).toHaveBeenCalledTimes(1);
              expect(bookingService.delete).toHaveBeenCalledWith(id);
        });
    });
});