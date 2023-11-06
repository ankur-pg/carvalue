import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  createUser(email: string, password: string) {
    // Using create helps to execute any hooks defined in the entity
    const user = this.repo.create({email, password})

    return this.repo.save(user)
  }

  async findOne(id: number) {
    if(!id) {
      return null
    }
    return await this.repo.findOne({ where: {id} })
  }

  find (email: string) {
    return this.repo.find({ where: {email} })
  }

  async update (id: number, attributes: Partial<User>) {
    const user = await this.findOne(id)
    if(!user) {
      throw new NotFoundException('user not found')
    }
    Object.assign(user, attributes)
    return this.repo.save(user)
  }

  async remove (id: number) {
    const user = await this.findOne(id)
    if(!user) {
      throw new NotFoundException('user not found')
    }

    return this.repo.remove(user)
  }
}
