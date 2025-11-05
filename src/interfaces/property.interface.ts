export interface Property {
  propertyId: string;
  propertyName: string;
  type: number;
  activeStatus: number;
  totalRoom: number;
}

export interface RoomDetail {
    roomId: string;
    name: string;
    availabilityStatus: number;
}

export interface RoomTypeDetail {
    roomTypeId: string;
    name: string;
    description: string;
    price: number;
    capacity: number;
    facility: string;
    listRoom: RoomDetail[];
}

export interface PropertyDetail extends Property {
    description: string;
    income: number;
    province: number;
    address: string;
    ownerName: string;
    ownerId: string;
    createdDate: string; 
    updatedDate: string; 
    listRoomType: RoomTypeDetail[];
}

export interface CreateRoomTypePayload {
    name: string;
    facility: string;
    capacity: number;
    price: number;
    floor: number;
    numberOfUnits: number;
    description: string;
}

export interface CreatePropertyPayload {
    propertyName: string;
    type: number | null;
    province: number | null;
    address: string;
    description: string;
    ownerId: string;
    ownerName: string;
    listRoomType: CreateRoomTypePayload[];
}

export interface UpdateRoomTypePayload {
    roomTypeId: string;
    capacity: number;
    price: number;
    description: string;
    facility: string;
}

export interface UpdatePropertyPayload {
    propertyId: string;
    propertyName: string;
    address: string;
    description: string;
    listRoomType: UpdateRoomTypePayload[];
}

export interface PropertyHeader {
    propertyId: string;
    propertyName: string;
    type: number;
}

export interface ScheduleMaintenancePayload {
    roomId: string;
    maintenanceStart: string; 
    maintenanceEnd: string; 
}