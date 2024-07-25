import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../user/entities/user.entity";
import { IsString } from "class-validator";

@Entity()
export class Notification {
    
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    @IsString()
    message: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    timeStamp: Date;

    @Column({ default: false })
    isRead: boolean;

    @ManyToOne(() => User, user => user.notifications)
    @JoinColumn({ name: 'user_id' })
    user: User;

    // Foreign key
    @Column({ nullable: true })
    @IsString()
    user_id: string; 
}