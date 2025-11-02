export interface UserData {
  id: string;
  email: string;
  created_at?: string;
}

export interface UserRole {
  id: number;
  user_id: string;
  role: string;
}