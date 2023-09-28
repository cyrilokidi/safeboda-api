import { Driver } from 'src/drivers/entities/driver.entity';
import { Passenger } from 'src/passengers/entities/passenger.entity';
import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export const DRIVER_PASSENGER_STATUS_ONGOING_UNIQUE_CONSTRAINT =
  'driver_passenger_status_ongoing_unique_constraint';

export enum ERideStatus {
  ['ONGOING'] = 'ongoing',
  ['DONE'] = 'done',
}

@Entity({
  name: 'rides',
})
// @Index(['driver', 'passenger', 'status'], {
//   unique: true,
//   where: '(status = "ongoing")',
// })
// @Check(`"passenger_id" IS NOT NULL AND "driver_id" IS NOT NULL AND "status" <> 'done'`)
export class Ride {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Passenger, (passenger) => passenger.ride, {
    nullable: false,
  })
  @JoinColumn({
    name: 'passenger_id',
  })
  passenger: Passenger;

  @ManyToOne(() => Driver, (driver) => driver.ride, {
    nullable: false,
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
