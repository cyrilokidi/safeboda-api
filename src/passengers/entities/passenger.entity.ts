import { Ride } from '../../rides/entities/ride.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'passengers',
})
export class Passenger {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'name',
    type: 'varchar',
    nullable: false,
  })
  name: string;

  @Column({
    name: 'phone',
    type: 'varchar',
    nullable: false,
    unique: true,
  })
  phone: string;

  @CreateDateColumn({
    name: 'created_at',
    nullable: false,
  })
  createdAt: Date;

  @OneToMany(() => Ride, (ride) => ride.driver, {
    cascade: true,
  })
  ride?: Ride[];
}
