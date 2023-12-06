import { Test, TestingModule } from '@nestjs/testing';
import { BookingService } from './booking.service';
import { Booking } from './booking.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult, AfterSoftRemove } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { NotFoundException } from '@nestjs/common/exceptions';

describe('BookingService', () => {
  let service: BookingService;
  let repository: Repository<Booking>;
  let bookingList: Booking[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingService,
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

    service = module.get<BookingService>(BookingService);
    repository = module.get(getRepositoryToken(Booking));
    // Mock the save method of the repository
    jest.spyOn(repository, 'save').mockResolvedValue({} as Booking);

    // Mock the delete method of the repository
    jest.spyOn(repository, 'delete').mockResolvedValue({} as DeleteResult);

    // Mock the find method of the repository
    jest.spyOn(repository, 'find').mockResolvedValue([] as Booking[]);
    jest.spyOn(repository, 'findOne').mockResolvedValue(null);


    // delete all bookings from cache and repository
    await service['cacheManager'].del('bookingList');
    await repository.delete({});

    // create a mock booking
    const bookingDate = new Date();
    bookingDate.setDate(bookingDate.getDate() + 1);
    const newBooking: Booking = {
      name: 'test1',
      bookingDate,
      taskId: '1',
      userId: '1'
    } as Booking;
    let bookingCreated = await service['BookingsRepository'].save(newBooking);


    bookingList = await service.findAll();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return cached data if available', async () => {
      const cachedData: Booking[] = bookingList;
      jest.spyOn(service['cacheManager'], 'get').mockResolvedValue(cachedData);

      const result = await service.findAll();

      expect(result).toEqual(cachedData);
    });

    it('should return data from the repository if not cached', async () => {
      const repositoryData: Booking[] = bookingList;
      jest.spyOn(service['cacheManager'], 'get').mockResolvedValue(null);
      jest.spyOn(service['BookingsRepository'], 'find').mockResolvedValue(repositoryData);
      jest.spyOn(service['cacheManager'], 'set').mockResolvedValue(null);

      const result = await service.findAll();

      expect(result).toEqual(repositoryData);
    });

    it('should find all bookings by userId', async () => {
      const repositoryData: Booking[] = bookingList;
      jest.spyOn(service['BookingsRepository'], 'find').mockResolvedValue(repositoryData);

      const result = await service.findAllByUserId('1');

      expect(result).toEqual(repositoryData);
    });
  });

  describe('create', () => {
    it('should create a new booking and update the cache', async () => {
      let bookingDate = new Date();
      bookingDate.setDate(bookingDate.getDate() + 1);
      const newBooking: Booking = {
        name: 'test',
        bookingDate,
        taskId: '1',
        userId: '1'
      } as Booking;
      const result:Booking = await service.create(newBooking);
      const savedBooking: Booking = result;
      jest.spyOn(service['BookingsRepository'], 'save').mockResolvedValue(savedBooking);

      jest.spyOn(service['cacheManager'], 'del').mockResolvedValue(null);


      expect(result).toEqual(savedBooking);
      expect(service['cacheManager'].del).toHaveBeenCalledWith('bookingList');
    });
  });

  describe('update', () => {
    it('should update a booking and update the cache', async () => {
      const bookingId = 'uuid';
      let updatedBooking: Booking = {
        id: 'uuid',
        name: 'test',
        bookingDate: new Date(),
        taskId: '1',
        userId: '1'
       } as Booking;
      updatedBooking.name = 'updated name';

      jest.spyOn(service['BookingsRepository'], 'update').mockResolvedValue({} as UpdateResult);
      jest.spyOn(service['cacheManager'], 'del').mockResolvedValue(null);

      const result = await service.update(bookingId, updatedBooking);

      expect(result).toEqual({});
      expect(service['cacheManager'].del).toHaveBeenCalledWith('bookingList');
    });
  });

  describe('delete', () => {
    it('should delete a booking and update the cache', async () => {
      const bookingId = 'some-id';
      const deletedBooking: Booking = { 
        id: 'some-id',
        name: 'test',
        bookingDate: new Date(),
        taskId: '1',
        userId: '1'
       } as Booking;

       

      jest.spyOn(service['BookingsRepository'], 'findOne').mockResolvedValue(deletedBooking);
      jest.spyOn(service['BookingsRepository'], 'softRemove').mockResolvedValue(deletedBooking);
      jest.spyOn(service['cacheManager'], 'del').mockResolvedValue(null);

      const result = await service.delete(bookingId);

      expect(result).toEqual(deletedBooking);
      expect(service['cacheManager'].del).toHaveBeenCalledWith('bookingList');
    });

    it('should throw NotFoundException if the booking to delete is not found', async () => {
      const bookingId = 'non-existent-id';

      jest.spyOn(service['BookingsRepository'], 'findOne').mockResolvedValue(null);

      await expect(service.delete(bookingId)).rejects.toThrowError(NotFoundException);
    });
  });

});
