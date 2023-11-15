import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common"
import { UsersService } from "./users.service"
import { randomBytes, scrypt as _scrypt } from 'crypto'
import { promisify } from 'util'

const scrypt = promisify(_scrypt)

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async signup(email: string, password: string) {
    const users = await this.usersService.find(email)

    if(users.length) {
      throw new BadRequestException('Email in use')
    }

    // generate salt
    const salt = randomBytes(8).toString('hex')

    // hash the salt and password
    const hash = (await scrypt(password, salt, 32)) as Buffer

    const result = salt + '.' + hash.toString('hex')

    // create user and save it
    return this.usersService.createUser(email, result)
  }

  async encryptPassword(password: string, salt: string) {
    return (await scrypt(password, salt, 32)) as Buffer
  }

  async signin(email: string, password: string) {
    /*
    1. get user using email
    2. get password from db
    3. get salt and hash from password
    4. apply salt to user supplied password
    5. check if hash from 3 and 4 match
    */
   const [user] = await this.usersService.find(email)
   if(!user) {
    throw new NotFoundException('User not found')
   }

   const [salt, hash] = user.password.split('.')
   const hashUserPassword = await this.encryptPassword(password, salt)

   if(hashUserPassword.toString('hex') !== hash) {
    throw new BadRequestException('Incorrect email or password')
   }

   return user
  }
}
