import type { SearchUser } from "./Users";

export interface TurtleCode {
    ID: string;
    code: string;
    turtles: number;
    uses: number;
    tip: string;
    codeName: string;
}

export interface TurtleData {
    ID: string;
    user: SearchUser;
    turtles: number;
    lastCollect: Date;
    nextCollect: Date;
}

export interface TurtleDataRank {
    ID: string;
    rank?: number;
    user: SearchUser;
    turtles: number;
    lastCollect: Date;
    nextCollect: Date;
}