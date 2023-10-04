import { Driver } from '../../drivers/entities/driver.entity';
import { Passenger } from '../../passengers/entities/passenger.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum ERideStatus {
  ['ONGOING'] = 'ongoing',
  ['DONE'] = 'done',
}

@Entity({
  name: 'rides',
})
@Index(['passenger', 'status'], {
  unique: true,
  where: `("status" <> 'done')`,
})
@Index(['driver', 'status'], {
  unique: true,
  where: `("status" <> 'done')`,
})
export class Ride {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Passenger, (passenger) => passenger.ride, {
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'passenger_id',
  })
  passenger: Passenger;

  @ManyToOne(() => Driver, (driver) => driver.ride, {
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'driver_id',
  })
  driver: Driver;

  @Column({
    name: 'pickup_point_latitude',
    type: 'decimal',
    nullable: false,
  })
  pickupPointLatitude: number;

  @Column({
    name: 'pickup_point_longitude',
    type: 'decimal',
    nullable: false,
  })
  pickupPointLongitude: number;

  @Column({
    name: 'destination_latitude',
    type: 'decimal',
    nullable: false,
  })
  destinationLatitude: number;

  @Column({
    name: 'destination_longitude',
    type: 'decimal',
    nullable: false,
  })
  destinationLongitude: number;

  @Column({
    name: 'status',
    type: 'enum',
    enum: ERideStatus,
    default: ERideStatus.ONGOING,
  })
  status: ERideStatus;

  @CreateDateColumn({
    name: 'created_at',
    nullable: false,
  })
  createdAt: Date;
}
