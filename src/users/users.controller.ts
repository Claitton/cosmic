import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto/users.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {

    constructor(private readonly userService: UsersService) { }

    @Post()
    async create(@Body() body: CreateUserDto) {
        const { email, name, password } = body;
        return await this.userService.create({ email, name, password });
    }

    @Get(':id')
    async find(@Param('id') userId: string) {
        return await this.userService.find(userId);
    }

    @Put(':id')
    async update(@Param('id') userId: string, @Body() body: UpdateUserDto) {
        const { email, name } = body;
        return await this.userService.update(userId, { email, name });
    }
}
