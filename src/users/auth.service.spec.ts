import { Test } from '@nestjs/testing'
import { AuthService } from './auth.service'
import { UsersService } from './users.service'
import { User } from './users.entity'
import { NotFoundException } from '@nestjs/common'

let authService: AuthService

beforeEach(async () => {
  // create fake user service
  const fakeUser = new User()
  fakeUser.id = 1
  fakeUser.email = 'a@a.com'
  fakeUser.password = 'jkl.313233'

  const findUser = async (email: string) => {
    if(email === 'b@b.com') {
      return [fakeUser]
    }

    return []
  }

  const fakeUsersService: Partial<UsersService> = {
    find: findUser,
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
  console.log(newUser.password)

  expect(newUser).toEqual(expect.objectContaining({id: 1, email }))
  expect(salt).toBeDefined()
  expect(hash).toBeDefined()
})

it('calls signup and throws error for existing user', async () => {
  const email = 'b@b.com'
  const pwd = '123'
  let newUser
  try {
    newUser = await authService.signup(email, pwd)
  } catch (err) { }
  expect(newUser).toBeUndefined()
})

it('call signin with incorrect email and throw exception', async () => {
  await expect(authService.signin('a@a.com', '123')).rejects.toThrow(NotFoundException)
})

it('calls signin with correct email', async () => {
  const hashedPassword = '123'
  jest.spyOn(authService, 'encryptPassword').mockImplementation(async () => Buffer.from(hashedPassword))

  const user = await authService.signin('b@b.com', '123')
  const [salt, hash] = user.password.split('.')

  expect(salt).toBeDefined()
  expect(hash).toBeDefined()
})
