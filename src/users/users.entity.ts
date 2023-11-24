import { Reports } from "src/reports/reports.entity"
import { Column, Entity, PrimaryGeneratedColumn, AfterInsert, OneToMany } from "typeorm"

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  password: string

  @Column()
  email: string

  @OneToMany(() => Reports, (report) => report.user)
  reports: Array<Reports>

  @AfterInsert()
  logInsert() {
    console.log('Record Inserted with ID ', this.id)
  }
}
