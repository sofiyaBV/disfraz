import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Auth API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/auth/register (POST)', () => {
    it('<0T 2V4E8;8B8 @5TAB@0FVN 7 =520;V4=8< email', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'invalid-email',
          password: 'password123',
        })
        .expect(400);
    });

    it('<0T 2V4E8;8B8 @5TAB@0FVN 7 :>@>B:8< ?0@>;5<', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: '123',
        })
        .expect(400);
    });

    it('<0T 2V4E8;8B8 @5TAB@0FVN 157 email', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          password: 'password123',
        })
        .expect(400);
    });

    it('<0T 2V4E8;8B8 @5TAB@0FVN 157 password', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'test@example.com',
        })
        .expect(400);
    });
  });

  describe('/auth/login (POST)', () => {
    it('<0T 2V4E8;8B8 ;>3V= 7 =520;V4=8< email', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'invalid-email',
          password: 'password123',
        })
        .expect(400);
    });

    it('<0T 2V4E8;8B8 ;>3V= 157 credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({})
        .expect(400);
    });

    it('<0T 2V4E8;8B8 ;>3V= 7 =5VA=CNG8< :>@8ABC20G5<', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123',
        })
        .expect(401);
    });
  });

  describe('/auth/profile (GET)', () => {
    it('<0T 2V4E8;8B8 4>ABC? 157 B>:5=0', () => {
      return request(app.getHttpServer()).get('/auth/profile').expect(401);
    });

    it('<0T 2V4E8;8B8 4>ABC? 7 =520;V4=8< B>:5=><', () => {
      return request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });
  });
});
