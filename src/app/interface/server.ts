import { Status } from './../enums/status.enum';
export interface Server {
    id: number;
    ipAddress: string;
    name: string;
    memory: string;
    imageUrl: string;
    status: Status;
}