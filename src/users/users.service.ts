import { Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto/users.dto';
import { PrismaService } from 'src/prisma.service';
import { hashSync } from 'bcrypt';

@Injectable()
export class UsersService {

    constructor(private readonly prismaService: PrismaService) { }

    async create(user: CreateUserDto) {
        const { email, name, password } = user;
        const _user = await this.prismaService.user.create({ data: { email, name, password: hashSync(password, 10) } });
        return {
            user: _user
        }
    }

    async find(userId: string) {
        const user = await this.prismaService.user.findUnique({ where: { id: userId }});
        return {
            user
        }
    }

    async update(userId: string, user: UpdateUserDto) {
        const _user = await this.prismaService.user.update({
            where: {
                id: userId
            },
            data: {
                ...user
            }
        });

        return {
            user: _user
        }
    }
}
