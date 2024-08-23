import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { Organization } from '@prisma/client';
import { randomUUID } from 'crypto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class OrganizationsService {

    constructor(private readonly prismaService: PrismaService) { }

    async create(organization: Omit<Organization, "id">) {
        const id = randomUUID();
        const { email, name } = organization;

        const organizationAlreadyExist = await this.prismaService.organization.findFirst({ where: { name } });
        if (organizationAlreadyExist) {
            throw new HttpException(`This org: ${name} already exist.`, HttpStatus.BAD_REQUEST);
        }

        const _organization = await this.prismaService.organization.create({ data: { id, name, email } });

        return {
            organization: _organization
        }
    }

    async list() {
        const organizations = await this.prismaService.organization.findMany();

        return {
            organizations
        }
    }

    async find(organizationId: string) {
        const organization = await this.prismaService.organization.findUniqueOrThrow({ where: { id: organizationId } });

        return {
            organization
        }
    }

    async update(organizationId: string, organization: Omit<Organization, "id">) {
        const _organization = await this.prismaService.organization.update({
            where: {
                id: organizationId
            },
            data: organization
        });

        return {
            organization: _organization
        }
    }

    async delete(organizationId: string) {
        const organization = await this.prismaService.organization.delete({ where: { id: organizationId } });

        return {
            organization
        }
    }
}
