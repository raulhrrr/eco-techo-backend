export interface UserDTO {
    id: string;
    email: string;
    name: string;
    password?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}