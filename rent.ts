import { Bike } from "./bike";
import { User } from "./user";

export class Rent {
    
    private constructor(
        public bike: Bike,
        public user: User,
        public start: Date,
        public end?: Date
    ) {}
}
