import { User } from "src/users/users.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Reports {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  price: number

  @Column()
  make: string

  @Column()
  model: string

  @Column()
  year: number

  @Column()
  lng: number

  @Column()
  lat: number

  @Column()
  mileage: number

  @Column({ default: false })
  approved: boolean

  @ManyToOne(() => User, (user) => user.reports)
  user: User
}
