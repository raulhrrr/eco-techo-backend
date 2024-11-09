import { TelemetryProcessResponse } from 'src/telemetry/interfaces/telemetry-process-response';
import { RegisterUserDto, LoginDto, UserDTO } from '../dto';
import { LoginResponse } from '../interfaces/login-response';

export interface IAuthService {
  register(registerDto: RegisterUserDto): Promise<TelemetryProcessResponse>;
  login(loginDto: LoginDto): Promise<LoginResponse>;
  findUserById(id: string): Promise<UserDTO>;
}
