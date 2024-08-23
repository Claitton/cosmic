import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { AddMemberDto, RemoveMemberDto } from './dto/members.dto';
import { MembersService } from './members.service';

@Controller('members')
export class MembersController {

    constructor(private readonly memberService: MembersService) {}

    @Post('/add')
    async add(@Body() body: AddMemberDto) {
        const { organizationId, userId } = body;

        return await this.memberService.add(organizationId, userId);
    }

    @Get(':id')
    async list(@Param('id') organizationId: string) {
        return await this.memberService.list(organizationId);
    }

    @Delete()
    async remove(@Body() body: RemoveMemberDto) {
        const { organizationId, userId } = body;
        return await this.memberService.remove(organizationId, userId);
    }

}
