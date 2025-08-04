export interface User {
  id?: number;
  username: string;
  email: string;
  password?: string; // Optional for frontend display
  createdAt?: Date;
  updatedAt?: Date;
}
