import { Role } from '../enums/role.enum';

export interface RequestUser {
  id: string;
  email: string;
  userName: string;
  role: Role;
  lastSeen: Date;
}
