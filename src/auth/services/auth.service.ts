import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
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
    private userModel: typeof User,

    private jwtService: JwtService,
  ) { }

  async register(registerDto: RegisterUserDto): Promise<LoginResponse> {
    try {
      const { password, ...userData } = registerDto;
      const newUser = await this.userModel.create({
        password: bcryptjs.hashSync(password, 10),
        ...userData
      });
      return this.getResponse(newUser);
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new BadRequestException(`${registerDto.email} already exists!`);
      }
      throw new InternalServerErrorException('Something terrible happened!!!');
    }
  }

  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const { email, password } = loginDto;
    const user = await this.userModel.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Not valid credentials - email');
    }
    const isPasswordValid = bcryptjs.compareSync(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Not valid credentials - password');
    }
    return this.getResponse(user);
  }

  private getResponse(user: User): LoginResponse {
    const { password: _, ...userData } = user.toJSON();
    return {
      user: userData,
      token: this.getJwtToken({ id: user.id })
    };
  }

  async findUserById(id: string): Promise<User> {
    const user = await this.userModel.findByPk(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  getJwtToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload);
  }
}