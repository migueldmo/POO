import { Bike } from "./bike";
import { Rent } from "./rent";
import { User } from "./user";


export class App {
    users: User[] = []
    bikes: Bike[] = []
    rents: Rent[] = []

    findUser(email: string): User | undefined {
        return this.users.find(user => user.email === email)
    }

    removeUser(email: string): void{
        const index = this.users.findIndex(user => user.email === email)
        const hUsers = this.users.slice(0, index)
        const xUsers = this.users[index+1]
        const zUsers = hUsers.concat(xUsers)
    }

    returnBike(bike: Bike): void{

    }
    rentBike(rents: Rent[], bike: Bike, user: User, 
        startDate: Date, endDate: Date): void{
        Rent.create(rents, bike, user, startDate, endDate)
        
    }

    registerBike(bike: Bike): void{
        for(const rBike of this.bikes){
            if(rBike.id === bike.id){
                throw new Error('Duplicated bike!')
            }
        }
        bike.id = crypto.randomUUID()
        this.bikes.push(bike)
    }

    registerUser(user: User): void {
        for (const rUser of this.users) {
            if (rUser.email === user.email){
                throw new Error('Duplicate user.')
            }
        }
        user.id = crypto.randomUUID()
        this.users.push(user)
    }
}