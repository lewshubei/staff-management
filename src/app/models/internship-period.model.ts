export interface InternshipPeriod {
  id?: number;
  startDate: Date;
  endDate: Date;
  userId?: number; // Foreign key from associations
  createdAt?: Date;
  updatedAt?: Date;
}
