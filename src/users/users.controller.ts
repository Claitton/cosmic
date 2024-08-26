import { Body, Controller, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto/users.dto';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {

    constructor(private readonly userService: UsersService) { }

    // @Post()
    // async create(@Body() body: CreateUserDto) {
    //     const { email, name, password } = body;
    //     return await this.userService.create({ email, name, password });
    // }

    @UseGuards(AuthGuard('jwt'))
    @Get(':id')
    async find(@Param('id') userId: string) {
        return await this.userService.find(userId);
    }

    @UseGuards(AuthGuard('jwt'))
    @Put(':id')
    async update(@Param('id') userId: string, @Body() body: UpdateUserDto) {
        const { email, name } = body;
        return await this.userService.update(userId, { email, name });
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('me')
    async me(@Request() req) {
        return {
            message: 'Success'
        }
    }
}
