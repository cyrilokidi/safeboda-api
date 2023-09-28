import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SigninDto } from './dto/signin.dto';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

export interface IAuthUser {
  email?: string;
  accessToken: string;
}

export interface IAccessTokenPayload {
  sub: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async signin(signin: SigninDto): Promise<IAuthUser> {
    const isAdmin =
      process.env.ADMIN_EMAIL === signin.email &&
      process.env.ADMIN_PASSWORD === signin.password;
    if (!isAdmin) throw new UnauthorizedException();
    const accessTokenPayload: IAccessTokenPayload = {
      sub: process.env.ADMIN_EMAIL,
    };
    const accessTokenOptions: JwtSignOptions = {
      secret: process.env.JWT_AUTH_ACCESS_TOKEN_SECRET,
      expiresIn: '1d',
    };
    return {
      email: process.env.ADMIN_EMAIL,
      accessToken: this.jwtService.sign(accessTokenPayload, accessTokenOptions),
    } as IAuthUser;
  }
}
