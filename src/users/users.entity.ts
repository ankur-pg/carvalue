import { Column, Entity, PrimaryGeneratedColumn, AfterInsert } from "typeorm"

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  password: string

  @Column()
  email: string

  @AfterInsert()
  logInsert() {
    console.log('Record Inserted with ID ', this.id)
  }
}
