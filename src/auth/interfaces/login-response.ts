import { UserDTO } from '../dto';

export interface LoginResponse {
  user: UserDTO;
  token: string;
}
