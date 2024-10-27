import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from 'bcryptjs';
import { RegisterUserDto, LoginDto } from '../dto';
import { JwtPayload } from '../interfaces/jwt-payload';
import { LoginResponse } from '../interfaces/login-response';
import { IAuthService } from './auth.service.interface';
import { User } from '../entities/user.entity';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,

    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterUserDto): Promise<LoginResponse> {
    try {
      const { password, ...userData } = registerDto;
      const newUser = await this.userModel.create({
        password: bcryptjs.hashSync(password, 10),
        ...userData,
      });
      return this.getResponse(newUser);
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new BadRequestException(`${registerDto.email} ya existe`);
      }
      throw new InternalServerErrorException('Error inesperado');
    }
  }

  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const { email, password } = loginDto;
    const user = await this.userModel.findOne({ where: { email } });
    const message = 'Credenciales no válidas';
    if (!user) {
      throw new UnauthorizedException(`${message} - correo`);
    }
    const isPasswordValid = bcryptjs.compareSync(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException(`${message} - contraseña`);
    }
    return this.getResponse(user);
  }

  private getResponse(user: User): LoginResponse {
    const { password: _, ...userData } = user.toJSON();
    return {
      user: userData,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  async findUserById(id: string): Promise<User> {
    const user = await this.userModel.findByPk(id);
    if (!user) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }
    return user;
  }

  getJwtToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload);
  }
}
