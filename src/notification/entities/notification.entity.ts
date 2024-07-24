import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../user/entities/user.entity";

@Entity()
export class Notification {
    
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    message: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    timeStamp: Date;

    @Column()
    status: string

    @ManyToOne(() => User, user => user.notifications)
    @JoinColumn({ name: 'user_id' })
    user: User;

    // Foreign key
    @Column({ nullable: true })
    user_id: number; 
}