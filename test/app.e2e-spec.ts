import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as pactum from 'pactum';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import { LoginDto, SignupDto } from '../src/auth/dto';
import { EditUserDto } from '../src/user/dto';
import { CreateBookmarkDto } from '../src/bookmark/dto';

describe('App e2e', () => {
  let app: INestApplication;
  let glowsphereTestDb: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );

    const PORT_NUMBER: number = 3333;

    await app.init();
    await app.listen(PORT_NUMBER);

    glowsphereTestDb = app.get(PrismaService);
    await glowsphereTestDb.cleanDb();
    pactum.request.setBaseUrl(`http://localhost:${PORT_NUMBER}`);
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    describe('Sign Up', () => {
      it('should throw error if email is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ password: 'Name@1234' })
          .expectStatus(HttpStatus.BAD_REQUEST);
      });

      it('should throw error if password is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ email: 'name@example.com' })
          .expectStatus(HttpStatus.BAD_REQUEST);
      });

      it('should throw error if no body provided', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .expectStatus(HttpStatus.BAD_REQUEST);
      });

      it('should sign up', () => {
        const signupDto: SignupDto = {
          email: 'name@example.com',
          password: 'Name@1234',
        };

        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(signupDto)
          .expectStatus(HttpStatus.CREATED)
          .expectBodyContains(signupDto.email); // checks if the email is in the response body.
      });
    });

    describe('Log In', () => {
      it('should throw error if email is empty', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({ password: 'XXXX@1234' })
          .expectStatus(HttpStatus.BAD_REQUEST);
      });

      it('should throw error if password is empty', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({ email: 'name@example.com' })
          .expectStatus(HttpStatus.BAD_REQUEST);
      });

      it('should throw error if no body provided', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .expectStatus(HttpStatus.BAD_REQUEST);
      });

      it('should throw error if user does not exist', () => {
        const loginDto: LoginDto = {
          email: 'name22@example.com',
          password: 'XXXX@1234',
        };

        return pactum
          .spec()
          .post('/auth/login')
          .withBody(loginDto)
          .expectStatus(HttpStatus.FORBIDDEN);
      });

      it('should log in', () => {
        const loginDto: LoginDto = {
          email: 'name@example.com',
          password: 'Name@1234',
        };

        return pactum
          .spec()
          .post('/auth/login')
          .withBody(loginDto)
          .expectStatus(HttpStatus.OK)
          .stores('userAccessToken', 'access_token') // stores the value of the access_token in the userAccessToken variable.
          .stores('userId', 'id'); // stores the value of the id in the userId variable.
      });
    });
  });

  describe('User', () => {
    describe('Get Me', () => {
      it('should get current user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withBearerToken('$S{userAccessToken}')
          .expectStatus(HttpStatus.OK);
      });
    });

    describe('Edit User', () => {
      it('should get current user', () => {
        const editUserDto: EditUserDto = {
          email: 'john@example.com',
          firstName: 'John',
        };

        return (
          pactum
            .spec()
            .patch('/users/me')
            .withBearerToken('$S{userAccessToken}')
            .withBody(editUserDto)
            // .withHeaders({
            //   Authorization: `Bearer $S{userAccessToken}`,
            // })
            .expectStatus(HttpStatus.NO_CONTENT)
        );
      });
    });
  });

  describe('Bookmark', () => {
    describe('Get Bookmarks', () => {
      it('should get empty bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withBearerToken('$S{userAccessToken}')
          .expectStatus(HttpStatus.OK)
          .expectBodyContains([]);
        // .inspect();
      });
    });

    describe('Create Bookmark', () => {
      const createBookmarkDto: CreateBookmarkDto = {
        title: 'Bookmark 1',
        link: 'https://example.com',
        description: 'This is a bookmark',
      };
      it('should create a bookmark', async () => {
        return await pactum
          .spec()
          .post('/bookmarks')
          .withBearerToken('$S{userAccessToken}')
          .withBody(createBookmarkDto)
          .expectStatus(HttpStatus.CREATED)
          .stores('bookmarkId', 'id'); // stores the value of the id in the bookmarkId variable.
      });
    });

    describe('Get Bookmark by Id', () => {
      it('should get bookmark by id', () => {
        return pactum
          .spec()
          .get('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withBearerToken('$S{userAccessToken}')
          .expectStatus(HttpStatus.OK);
        // .inspect();
      });
    });

    describe('Get Bookmarks', () => {
      it('should get bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withBearerToken('$S{userAccessToken}')
          .expectStatus(HttpStatus.OK)
          .expectJsonLength(1); // checks if the response body contains 1 element.
        // .expectBodyContains();
        // .inspect();
      });
    });

    describe('Edit Bookmark', () => {});

    describe('Delete Bookmark', () => {});
  });
});
