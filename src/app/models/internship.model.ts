export interface Internship {
  id?: number;
  department: string;
  mentor: string;
  startDate: Date;
  endDate: Date;
  userId?: number; // Foreign key from associations
  createdAt?: Date;
  updatedAt?: Date;
}
