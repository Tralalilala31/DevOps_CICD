export interface User {
  id: string;
  nom: string;
  prenom: string;
  email: string;
}

export interface CreateUserDto {
  nom: string;
  prenom: string;
  email: string;
}

export interface UpdateUserDto {
  nom?: string;
  prenom?: string;
  email?: string;
}

export interface UserResponse {
  id: string;
  nom: string;
  prenom: string;
  email: string;
}

export interface UsersListResponse {
  users: UserResponse[];
  total: number;
  limit?: number;
}
