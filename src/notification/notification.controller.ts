import { Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { Notification } from './entities/notification.entity'; 
import { notificationMessage } from 'src/shared/constant/constant';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';

@Controller('notifications')
@UseGuards(new JwtAuthGuard())
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  async findAll(): Promise<{ message: string; notification: Notification[] }> {
    const notifications = await this.notificationService.findAll();
    return {
      message: notificationMessage.notificationFetched,
    notification:notifications
    ,
    };
  }
  @Put(':id')
  markAsRead(@Param('id') id: string): Promise<{ message: string; notification: Notification }> {
    return this.notificationService.markAsRead(id);
  }
}
