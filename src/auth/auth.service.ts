import { HttpException, HttpStatus, Injectable, UseGuards } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { compareSync } from "bcrypt"
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from './dto/auth.dto';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AuthService {

    constructor(private readonly userService: UsersService, private readonly jwtService: JwtService) { }

    async validateUser(email: string, password: string) {
        const user = await this.userService.exist(email);
        if (!compareSync(password, user.password)) return null;

        return user;
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.userId };
        return {
            accessToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
            refreshToken: this.jwtService.sign({}, { expiresIn: '1d' })
        };
    }

    async register(user: RegisterUserDto) {
        const { email, name, password } = user;

        const emailAlreadyUsed = await this.userService.exist(user.email);

        if (emailAlreadyUsed) {
            throw new HttpException('Email already used.', HttpStatus.BAD_REQUEST);
        }

        const _user = await this.userService.create({ email, name, password });

        return {
            user: _user
        }
    }

    async refreshToken() {
        const refreshToken = this.jwtService.sign({}, { expiresIn: '1d' })
        return {
            refreshToken
        };
    }
}
