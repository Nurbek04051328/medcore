import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateUserDto } from "../dto/create-user.dto";
import * as bcrypt from "bcrypt"
import { UpdateUserDto } from "../dto/update-user.dto";


@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  private excludePassword(user:any) {
    const { password, ...safeUser } = user;
    return safeUser
  }

  async create(dto: CreateUserDto) {

    const existUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if(existUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        role: dto.role
      }
    });

    
    return this.excludePassword(user);
  }

  async findAll() {
    const users = await this.prisma.user.findMany();

    return users.map((user) => this.excludePassword(user));
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException("User not found")
    }

    return this.excludePassword(user);
  }

  async findByEmailWithPassword(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async update(id: string, dto: UpdateUserDto) {
    await this.findOne(id);

    const data: any = {...dto};

    if (dto.password) {
      data.password = await bcrypt.hash(dto.password,10);
    }

    const user = await this.prisma.user.update({
      where: { id },
      data,
    });

    return this.excludePassword(user);
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.user.delete({
      where: { id },
    });

    return { message: "User deleted successfully" }
  }

  async updateRefreshToken(userId: string, refreshToken: string | null) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken },
    });
  }

}