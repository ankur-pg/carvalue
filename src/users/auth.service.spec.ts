import { Test } from '@nestjs/testing'
import { AuthService } from './auth.service'
import { UsersService } from './users.service'
import { User } from './users.entity'

let authService: AuthService

beforeEach(async () => {
  // create fake user service
  const fakeUsersService: Partial<UsersService> = {
    find: () => Promise.resolve([]),
    createUser: (email: string, password: string) => Promise.resolve({id: 1, email, password} as User)
  }

  const module = await Test.createTestingModule({
    providers: [
      AuthService,
      {
        provide: UsersService,
        useValue: fakeUsersService
      }
    ]
  }).compile()

  authService = module.get(AuthService)
})

it('can create an instance of auth service', async () => {
  expect(authService).toBeDefined()
})

it('calls signup and returns a user', async () => {
  const email = 'a@a.com'
  const pwd = '123'
  const newUser = await authService.signup(email, pwd)
  const [salt, hash] = newUser.password.split('.')

  expect(newUser).toEqual(expect.objectContaining({id: 1, email }))
  expect(salt).toBeDefined()
  expect(hash).toBeDefined()
})