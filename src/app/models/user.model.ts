export interface User {
  id?: number;
  username: string;
  email: string;
  password?: string; // Optional for frontend display
  fullName?: string;
  roleId?: number; // If role ID is direct property
  role?: {
    // If role is nested object
    id: number;
    name: string;
  };
  createdAt?: string;
  updatedAt?: Date;
}
