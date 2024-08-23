import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class MembersService {

    constructor(private readonly prismaService: PrismaService) {}

    async add(organizationId: string, userId: string) {
        const organizationExist = await this.prismaService.organization.findUnique({ where: { id: organizationId }});
        if (!organizationExist) {
            throw new HttpException(`Organization not found`, HttpStatus.BAD_REQUEST);
        }

        const userExist = await this.prismaService.user.findUnique({ where: { id: userId }});
        if (!userExist) {
            throw new HttpException(`User not found`, HttpStatus.BAD_REQUEST);
        }

        const member = await this.prismaService.member.create({
            data: {
                organization_id: organizationId,
                user_id: userId
            }
        });

        return {
            member
        }
    }

    async list(organizationId: string) {
        const members = await this.prismaService.member.findMany({ where: { organization_id: organizationId }});
        return {
            members
        }
    }

    async remove(organizationId: string, userId: string) {
        const { id: memberId } = await this.prismaService.member.findFirstOrThrow({ where: { user_id: userId, organization_id: organizationId }});
        await this.prismaService.member.delete({ where: { id: memberId }});
    }
}
