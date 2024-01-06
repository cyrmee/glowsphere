import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto, SignupDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private glowsphereDb: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async login(loginDto: LoginDto) {
    // find the user by email
    const user = await this.glowsphereDb.user.findUnique({
      where: {
        email: loginDto.email,
      },
    });
    // if user does not exist throw exception
    if (!user) throw new ForbiddenException('Credentials incorrect');

    // compare passwords
    const pwMatch = await argon.verify(user.hash, loginDto.password);

    // if password incorrect throw exception
    if (!pwMatch) throw new ForbiddenException('Credentials incorrect');

    return await this.signToken(user.id, user.email);
  }

  async signup(signupDto: SignupDto) {
    // generate the password hash
    const hash = await argon.hash(signupDto.password);

    // OPTIONAL: save the new user in the db
    /* try {
      const user = await this.glowsphereDb.user.create({
        data: {
          email: dto.email,
          hash: hash,
        },
        select: {
          id: true,
          email: true,
          createdAt: true,
        },
      });

      // return the saved user
      return user;
    } catch {} */

    try {
      const user = await this.glowsphereDb.user.create({
        data: {
          email: signupDto.email,
          hash: hash,
        },
      });

      delete user.hash;

      // TODO: return the saved user
      return {
        'user info': user,
        token: await this.signToken(user.id, user.email),
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }
  }

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email: email,
    };

    const token = await this.jwt.signAsync(payload, {
      expiresIn: this.config.get('JWT_EXPIRATION_TIME'),
      secret: this.config.get('JWT_SECRET'),
    });

    return {
      access_token: token,
    };
  }
}
