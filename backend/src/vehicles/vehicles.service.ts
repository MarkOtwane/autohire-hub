/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { SearchVehicleDto } from './dto/search-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@Injectable()
export class VehiclesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateVehicleDto) {
    return this.prisma.vehicle.create({
      data: {
        ...dto,
        category: dto.category as any,
        fuelType: dto.category as any,
      },
    });
  }

  async findAll() {
    return this.prisma.vehicle.findMany();
  }

  async findOne(id: string) {
    return this.prisma.vehicle.findUnique({ where: { id } });
  }

  async update(id: string, dto: UpdateVehicleDto) {
    const { category, fuelType, ...rest } = dto;
    return this.prisma.vehicle.update({
      where: { id },
      data: {
        ...rest,
        ...(category !== undefined && { category: { set: category } }),
        ...(fuelType !== undefined && { fuelType: { set: fuelType } }),
      },
    });
  }

  async remove(id: string) {
    return this.prisma.vehicle.delete({ where: { id } });
  }

  async search(dto: SearchVehicleDto) {
    return this.prisma.vehicle.findMany({
      where: {
        AND: [
          dto.location
            ? { location: { contains: dto.location, mode: 'insensitive' } }
            : {},
          dto.category
            ? { category: { equals: dto.category as any } } // or as string
            : {},
          dto.keyword
            ? {
                OR: [
                  { name: { contains: dto.keyword, mode: 'insensitive' } },
                  {
                    description: { contains: dto.keyword, mode: 'insensitive' },
                  },
                ],
              }
            : {},
        ],
      },
    });
  }
}
