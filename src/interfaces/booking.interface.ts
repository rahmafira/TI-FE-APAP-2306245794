export interface Booking {
    bookingId: string;
    propertyName: string;
    roomName: string;
    checkIn: string;
    checkOut: string;
    totalPrice: number;
    status: number;
}

export interface BookingDetail extends Booking {
    bookingId: string;
    propertyName: string;
    roomName: string;
    roomId: string; 
    checkInDate: string; 
    checkOutDate: string; 
    totalPrice: number;
    status: number; 
    customerId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    capacity: number
    totalDays: number;
    isBreakfast: boolean;
    extraPay: number;
    refund: number;
    createdDate: string; 
    updatedAt: string; 
}

export interface CreateBookingPayload {
    roomId: string;
    checkInDate: string;
    checkOutDate: string;
    customerId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    isBreakfast: boolean;
    capacity: number;
}

export interface PrefilledBookingData {
    roomId: string;
    roomName: string;
    capacity: number;
}

export interface BookingSelectionRoom {
    id: string;
    name: string;
    capacity: number;
}

export interface BookingSelectionRoomType {
    id: string;
    name: string;
    rooms: BookingSelectionRoom[];
}

export interface BookingSelectionProperty {
    id: string;
    name: string;
    roomTypes: BookingSelectionRoomType[];
}

export interface BookingSelectionData {
    properties: BookingSelectionProperty[];
}

export interface UpdateBookingPayload {
    bookingId: string;
    roomId: string;
    checkInDate: string;
    checkOutDate: string;
    customerId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    isBreakfast: boolean;
    capacity: number;
}

export interface UpdateBookingForm {
    currentBooking: BookingDetail;
    selectionData: BookingSelectionData;
}