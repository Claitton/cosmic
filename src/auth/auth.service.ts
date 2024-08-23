import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { compareSync } from "bcrypt"
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from './dto/auth.dto';

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
            access_token: this.jwtService.sign(payload),
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
}
