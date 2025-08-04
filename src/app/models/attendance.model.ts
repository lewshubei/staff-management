export interface Attendance {
  id?: number;
  checkInTime?: Date;
  checkOutTime?: Date;
  workingHours?: number;
  userId?: number; // Foreign key from associations
  createdAt?: Date;
  updatedAt?: Date;
}
