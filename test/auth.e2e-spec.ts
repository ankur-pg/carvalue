import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Authentication System (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles signup request', () => {
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: 'e2et2@t.com', password: '123' })
      .expect(201)
      .then((res) => {
        const { id, email } = res.body
        expect(id).toBeDefined()
        expect(email).toEqual('e2et2@t.com')
      })
  });

  it('signup as a new user and get the logged in user', async () => {
    const httpRequest = await request(app.getHttpServer())
    const res = await httpRequest.post('/auth/signup').send({ email: 'e2et2@t.com', password: '123' })
    const cookie = res.get('Set-Cookie')
    
    const { body } = await httpRequest.get('/auth/whoami')
              .set('Cookie', cookie)
              .send().expect(200)
    expect(body.email).toEqual('e2et2@t.com')

    const loginResponse = await httpRequest.post('/auth/signin').send({ email: 'e2et2@t.com', password: '123' })
    expect(loginResponse).toBeDefined()
    expect(loginResponse.body.email).toEqual('e2et2@t.com')
  })
});
