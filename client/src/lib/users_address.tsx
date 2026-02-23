export interface User {
    id: number;
    email: string;
    hashedPassword: string;
    createdAt: string;
}

export interface Address {
    id: number;
    name: string;
    description: string;
    lng: number;
    lat: number;
    user: User;
    createdAt: Date;
}