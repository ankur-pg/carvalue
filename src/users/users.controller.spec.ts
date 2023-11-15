import { Test, TestingModule } from '@nestjs/testing'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { AuthService } from './auth.service'
import { User } from './users.entity'
import { NotFoundException } from '@nestjs/common'

describe('UsersController', () => {
  let controller: UsersController
  let fakeUsersService: Partial<UsersService>
  let fakeAuthService: Partial<AuthService>

  const findUsers = async (email: string) => {
    if(email === 'b@b.com') {
      return []
    }

    return [{ id: 1, email: 'a@a.com', password: '123'} as User]
  }

  fakeUsersService = {
    findOne: (id: number) => {
      return Promise.resolve({ id, email: 'a@a.com', password: '123'} as User)
    },
    find: findUsers
  }

  fakeAuthService = {}

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService
        },
        {
          provide: AuthService,
          useValue: fakeAuthService
        }
      ],
      controllers: [UsersController],
    }).compile()

    controller = module.get<UsersController>(UsersController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('should return users', async () => {
    const users = await controller.findAllUsers('a@a.com')
    expect(users.length).toEqual(1)
  })

  it('should throw error', async () => {
    const users = await controller.findAllUsers('b@b.com')
    expect(users.length).toEqual(0)
  })
})
