import { Bike } from "./bike";
import { Crypt } from "./crypt";
import { Rent } from "./rent";
import { User } from "./user";
import { Location } from "./location";
//import crypto from 'crypto'
import { BikeNotFoundError } from "./errors/bike-not-found-error";
import { UserNotFoundError } from "./errors/user-not-found";
import { UnavailableBikeError } from "./errors/unavailable-bike";
import { RentNotFoundError } from "./errors/rent-not-found";
import { DuplicatedUserError } from "./errors/duplicated-user";

export class App {
    users: User[] = []
    bikes: Bike[] = []
    rents: Rent[] = []
    crypt: Crypt = new Crypt()

    findUser(email: string): User {
        const user = this.users.find(user => user.email === user.email)
        if(!user) throw new UserNotFoundError()
        return user
    }

    async registerUser(user: User): Promise<string> {
        for (const rUser of this.users) {
            if (rUser.email === user.email) {
                throw new DuplicatedUserError()
            }
        }
        const newId = crypto.randomUUID()
        user.id = newId
        const encryptedPassword = await this.crypt.encrypt(user.password)
        user.password = encryptedPassword
        this.users.push(user)
        return newId
    }

    async authenticate(userEmail: string, password: string): Promise<boolean> {
        const user = this.findUser(userEmail)
        if (!user) throw new Error('User not found.')
        return await this.crypt.compare(password, user.password)
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
        throw new UserNotFoundError()
    }
    
    rentBike(bikeId: string, userEmail: string): void {
        const bike = this.findBike(bikeId)
        if (!bike.available) {
            throw new UnavailableBikeError
        }
        const user = this.findUser(userEmail)
        bike.available = false
        const newRent = new Rent(bike, user, new Date())
        this.rents.push(newRent)
    }

    returnBike(bikeId: string, userEmail: string): number {
        const now = new Date()
        const rent = this.rents.find(rent =>
            rent.bike.id === bikeId &&
            rent.user.email === userEmail &&
            !rent.end
        )
        if (!rent) throw new RentNotFoundError
        rent.end = now
        rent.bike.available = true
        const hours = diffHours(rent.end, rent.start)
        return hours * rent.bike.rate
    }

    listUsers(): User[] {
        return this.users
    }

    listBikes(): Bike[] {
        return this.bikes
    }

    listRents(): Rent[] {
        return this.rents
    }

    moveBikeTo(bikeId: string, location: Location) {
        const bike = this.findBike(bikeId)
        bike.location.latitude = location.latitude
        bike.location.longitude = location.longitude
    }

    findBike(bikeId: string): Bike{
        const bike = this.bikes.find(bike => bike.id === bikeId)
        if(!bike) throw new BikeNotFoundError()
        return bike
    }
}


function diffHours(dt2: Date, dt1: Date) {
  var diff = (dt2.getTime() - dt1.getTime()) / 1000;
  diff /= (60 * 60);
  return Math.abs(diff);
}
