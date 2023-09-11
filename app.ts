import { Bike } from "./bike";
import { Rent } from "./rents";
import { User } from "./user";
import crypto from 'crypto'

export class App {
    users: User[] = []
    bikes: Bike[] = []
    rents: Rent[] = []

    findUser(email: string): User {
        return this.users.find(user => user.email === email)
    }

    registerUser(user: User): string {
        for (const rUser of this.users) {
            if (rUser.email === user.email) {
                throw new Error('Duplicate user.')
            }
        }
        const newId = crypto.randomUUID()
        user.id = newId
        this.users.push(user)
        return newId
    }

    registerBike(bike: Bike): string {
        const newId = crypto.randomUUID()
        bike.id = newId
        this.bikes.push(bike)
        return newId
    }

    removeUser(email: string): void {
        const userIndex = this.users.findIndex(user => user.email === email)
        if (userIndex !== -1) {
            this.users.splice(userIndex, 1)
            return
        }
        throw new Error('User does not exist.')
    }
    
    rentBike(bikeId: string, userEmail: string, start: Date): void {
        const bike = this.bikes.find(bike => bike.id === bikeId)
        if (!bike) {
            throw new Error('Bike not found.')
        }
        const user = this.findUser(userEmail)
        if (!user) {
            throw new Error('User not found.')
        }
        if(!bike.available){
            throw new Error('Bike Unavailable')
        }
        const newRent = Rent.create(this.bikes, bike, user, start)

        this.rents.push(newRent)
    }

    returnBike(bikeId: string, userEmail: string, start: Date): number {
        const end = new Date
        const rent = this.rents.find(rent => 
            rent.bike.id === bikeId 
        )
        if (rent) {
            const diff = Math.abs(end - start)
            return diff * rent.bike.rate
        }
        throw new Error('Rent not found.')
    }
}
