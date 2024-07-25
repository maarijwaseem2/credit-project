import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { User } from '../user/entities/user.entity';
import { notificationMessage } from 'src/shared/constant/constant';

@Injectable()
export class NotificationService {
    constructor(
        @InjectRepository(Notification)
        private notificationRepository: Repository<Notification>,
    ) {}

    async createUserVerificationNotification(user: User): Promise<Notification> {
        const message = `Hello, ${user.name}! Your account has been verified.`;
        const notification = this.notificationRepository.create({
            message,
            user,
            isRead: true,
            timeStamp: new Date(),
        });
        return this.notificationRepository.save(notification);
    }
    async findAll(): Promise<Notification[]> {
      return this.notificationRepository.find();
    }
    
    async markAsRead(id: string): Promise<{ message: string; notification: Notification }> {
      const notification = await this.notificationRepository.findOne({ where: { id } });
      if (notification) {
        notification.isRead = true;
        const updatedNotification = await this.notificationRepository.save(notification);
    
        return {
          message: notificationMessage.notificationUpdated,
          notification: updatedNotification,
        };
      } else {
        throw new Error('Notification not found');
      }
    }
  }