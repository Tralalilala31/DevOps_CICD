export enum UserRole {
  USER = "user",
  ADMIN = "admin",
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
}

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  password?: string;
  role?: UserRole;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  // Mot de passe exclu des réponses pour la sécurité
}

export interface UsersListResponse {
  users: UserResponse[];
  total: number;
  limit?: number;
}
