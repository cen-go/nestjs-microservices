import { Role } from '../enums/role.enum';

export interface RequestUser {
  id: string;
  email: string;
  userName: string;
  role: Role;
  lastSeen: Date;
}

export interface CreatedProduct {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  description: string;
  price: number;
  status: 'ACTIVE' | 'INACTIVE' | 'DRAFT';
  imageUrl: string | null;
  userId: string;
}
