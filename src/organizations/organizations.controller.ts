import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CreateOrganizationDto, UpdateOrganizationDto } from './dto/organizations.dto';
import { OrganizationsService } from './organizations.service';

@Controller('organizations')
export class OrganizationsController {

    constructor(private readonly organizationService: OrganizationsService) { }

    @Post()
    async create(@Body() body: CreateOrganizationDto) {
        const { email, name } = body;

        return await this.organizationService.create({ email, name });
    }

    @Put(':id')
    async update(@Param('id') organizationId: string, @Body() body: UpdateOrganizationDto) {
        const { email, name } = body;
        return await this.organizationService.update(organizationId, { email, name });
    }

    @Get()
    async list() {
        return await this.organizationService.list();        
    }

    @Get(':id')
    async find(@Param('id') organizationId: string) {
        return await this.organizationService.find(organizationId);
    }

    @Delete(':id')
    async delete(@Param('id') organizationId: string) {
        const organization = await this.organizationService.delete(organizationId)
    }
}
