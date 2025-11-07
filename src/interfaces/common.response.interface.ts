export interface CommonResponseInterface<T> {
  data: T;
  message: string;
  status: number;
  timestamp: Date;
}

export interface ScheduleMaintenancePayload {
    roomId: string;
    maintenanceStart: string; 
    maintenanceEnd: string; 
}