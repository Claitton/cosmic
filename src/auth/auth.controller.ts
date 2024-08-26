import { Body, Controller, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @UseGuards(AuthGuard('local'))
    @Post('login')
    async login(@Request() req) {
        return await this.authService.login(req.user);
    }

    @Post('register')
    async register(@Body() body: RegisterUserDto) {
        const { email, name, password } = body;
        await this.authService.register({ email, name, password });
        return 'User register with sucess.';
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('refresh-token')
    async refreshToken() {
        return await this.authService.refreshToken();
    }
}
