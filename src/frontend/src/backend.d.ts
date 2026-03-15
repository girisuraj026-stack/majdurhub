import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Job {
    id: bigint;
    workType: string;
    description: string;
    address: string;
    areaSqft: bigint;
    customerId: Principal;
    calculatedPrice: bigint;
    startDate: string;
}
export interface Rating {
    review: string;
    workerId: bigint;
    bookingId: bigint;
    stars: bigint;
    customerId: Principal;
}
export interface Booking {
    id: bigint;
    status: Status;
    workerId: bigint;
    paymentMethod: PaymentMethod;
    jobId: bigint;
    customerId: Principal;
    totalPrice: bigint;
}
export interface Worker {
    id: bigint;
    workType: string;
    owner: Principal;
    city: string;
    name: string;
    experience: bigint;
    mobile: string;
    rateAmount: bigint;
    rateType: RateType;
}
export interface UserProfile {
    name: string;
    role: string;
}
export enum PaymentMethod {
    upi = "upi",
    cash = "cash",
    wallet = "wallet"
}
export enum RateType {
    perday = "perday",
    sqft = "sqft",
    runningft = "runningft"
}
export enum Status {
    pending = "pending",
    completed = "completed",
    accepted = "accepted",
    inProgress = "inProgress"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addRating(bookingId: bigint, stars: bigint, review: string): Promise<void>;
    adminGetPlatformStats(): Promise<{
        totalWorkers: bigint;
        totalBookings: bigint;
        completedBookings: bigint;
        totalRevenue: bigint;
    }>;
    adminListAllBookings(): Promise<Array<Booking>>;
    adminListAllWorkers(): Promise<Array<Worker>>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    calculatePrice(workType: string, areaSqft: bigint): Promise<bigint>;
    createBooking(jobId: bigint, workerId: bigint, paymentMethod: PaymentMethod): Promise<bigint>;
    createJob(workType: string, areaSqft: bigint, address: string, startDate: string, description: string): Promise<bigint>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getWorkerAverageRating(workerId: bigint): Promise<number | null>;
    getWorkerRatings(workerId: bigint): Promise<Array<Rating>>;
    isCallerAdmin(): Promise<boolean>;
    listBookingsByCustomer(customerId: Principal): Promise<Array<Booking>>;
    listBookingsByWorker(workerId: bigint): Promise<Array<Booking>>;
    listJobsByCustomer(customerId: Principal): Promise<Array<Job>>;
    listWorkers(): Promise<Array<Worker>>;
    listWorkersByType(workType: string): Promise<Array<Worker>>;
    registerWorker(name: string, mobile: string, city: string, experience: bigint, workType: string, rateType: RateType, rateAmount: bigint): Promise<bigint>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateBookingStatus(bookingId: bigint, status: Status): Promise<void>;
    updateWorker(id: bigint, name: string, mobile: string, city: string, experience: bigint, workType: string, rateType: RateType, rateAmount: bigint): Promise<void>;
}
