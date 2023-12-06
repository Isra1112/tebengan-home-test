import { Injectable, Inject, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Booking } from './booking.entity';
import { NotFoundException } from '@nestjs/common/exceptions';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class BookingService {
    constructor(
        @InjectRepository(Booking)
        private BookingsRepository: Repository<Booking>,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) { }

    //crud
    async findAll(): Promise<Booking[]> {
        const get = await this.cacheManager.get('bookingList') as Booking[];

        if (get) {
            return get;
        } else {
            const newListOfBookings = await this.BookingsRepository.find({ relations: ['task', 'user'] })
            await this.cacheManager.set('bookingList', newListOfBookings);
            return newListOfBookings;
        }
    }

    async findAllByUserId(userId: string): Promise<Booking[]> {
        return await this.BookingsRepository.find({ where: { userId: userId }, relations: ['task', 'user'] });
    }

    async create(booking: Booking): Promise<Booking> {
        const bookingSaved = await this.BookingsRepository.save(booking);
        await this.cacheManager.del('bookingList')
        return await this.BookingsRepository.findOne({ where: { id: bookingSaved.id }, relations: ['task', 'user'] });
    }

    async update(id: string, booking: Booking): Promise<UpdateResult> {
        await this.cacheManager.del('bookingList')

        return await this.BookingsRepository.update(id, booking);
    }

    async delete(id: string): Promise<Booking> {
        const bookingToDelete = await this.BookingsRepository.findOne({ where: { id }, relations: ['task', 'user'] });
    
        if (!bookingToDelete) {
            throw new NotFoundException(`Booking with ID ${id} not found`);
        }
    
        // Soft remove the entity and handle the DeleteResult
        const deleteResult = await this.BookingsRepository.softRemove(bookingToDelete);
        await this.cacheManager.del('bookingList');
    
        return await this.BookingsRepository.findOne({ withDeleted: true, where: { id } });
    }
}
