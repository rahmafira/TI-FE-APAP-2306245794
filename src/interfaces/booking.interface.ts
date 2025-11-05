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
    customerId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    totalDays: number;
    isBreakfast: boolean;
    extraPay: number;
    refund: number;
    createdDate: string; 
    updatedAt: string; 
}