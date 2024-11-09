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
import { Role, User } from '../entities';
import { TelemetryProcessResponse } from 'src/telemetry/interfaces/telemetry-process-response';
import { ADMINISTRATOR_ROLE } from 'src/constants';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,

    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterUserDto): Promise<TelemetryProcessResponse> {
    try {
      const { password, ...userData } = registerDto;
      await this.userModel.create({
        password: password ? bcryptjs.hashSync(password, 10) : '',
        ...userData,
      });
      return { statusCode: 201, message: 'Usuario creado exitósamente' };
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new BadRequestException(`${registerDto.email} ya existe`);
      }
      throw new InternalServerErrorException('Error inesperado');
    }
  }

  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const { email, password } = loginDto;
    const user = await this.userModel.findOne({
      where: { email, isActive: true },
      include: [{
        model: Role,
        where: { name: ADMINISTRATOR_ROLE },
      }]
    });

    const message = 'Credenciales no válidas';
    if (!user) {
      throw new UnauthorizedException(`${message} - Correo`);
    }

    const isPasswordValid = bcryptjs.compareSync(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException(`${message} - Contraseña`);
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
