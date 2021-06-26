import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { Role } from '../role/role.entity';
import { CreateRoleDto, ReadRoleDto, UpdateRoleDto } from './dtos';
import { RoleRepository } from './role.repository';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleRepository)
    private readonly _roleRepository: RoleRepository,
  ) {}

  async get(id: number): Promise<ReadRoleDto> {
    if (!id) {
      throw new BadRequestException('id must be sent');
    }

    const role: Role = await this._roleRepository.findOne(id, {
      where: { status: 'ACTIVE' },
    });

    if (!role) {
      throw new NotFoundException();
    }

    return plainToClass(ReadRoleDto, role);
  }

  async getAll(): Promise<ReadRoleDto[]> {
    const roles: Role[] = await this._roleRepository.find({
      where: { status: 'ACTIVE' },
    });

    return roles.map((role: Role) => plainToClass(ReadRoleDto, role));
  }

  //Usamos el partial porque algunos de los campos del DTO puede venir vacío
  async create(role: Partial<CreateRoleDto>): Promise<CreateRoleDto> {
    //Deben haber varias validaciones
    const savedRole: Role = await this._roleRepository.save(role);
    return plainToClass(CreateRoleDto, savedRole);
  }

  async update(
    roleId: number,
    role: Partial<UpdateRoleDto>,
  ): Promise<UpdateRoleDto> {
    const foundRole: Role = await this._roleRepository.findOne(roleId, {
      where: { status: 'ACTIVE' },
    });
    if (!foundRole) {
      throw new NotFoundException('This role does not exist');
    }

    foundRole.name = role.name;
    foundRole.description = role.description;

    const updateRole: Role = await this._roleRepository.save(foundRole);

    return plainToClass(UpdateRoleDto, updateRole);
  }

  async delete(id: number): Promise<void> {
    const roleExists = await this._roleRepository.findOne(id, {
      where: { status: 'ACTIVATE' },
    });

    if (!roleExists) {
      throw new NotFoundException();
    }

    await this._roleRepository.update(id, { status: 'INACTIVE' });
  }
}
