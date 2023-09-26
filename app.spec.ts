import sinon from "sinon"
import { App } from "./app"
import { Bike } from "./bike"
import { User } from "./user"
import { Location } from "./location"
import { BikeNotFoundError } from "./errors/bike-not-found"
import { UserNotFoundError } from "./errors/user-not-found"

describe('App', () => {
    it('should correctly calculate the rent amount', async () => {
        const app = new App()
        const user = new User('Jose', 'jose@mail.com', '1234')
        await app.registerUser(user)
        const bike = new Bike('caloi mountainbike', 'mountain bike',
            1234, 1234, 100.0, 'My bike', 5, [])
        app.registerBike(bike)
        const clock = sinon.useFakeTimers();
        app.rentBike(bike.id, user.email)
        const hour = 1000 * 60 * 60
        clock.tick(2 * hour)
        const rentAmount = app.returnBike(bike.id, user.email)
        expect(rentAmount).toEqual(200.0)
    })

    it('should be able to move a bike to a specific location', () => {
        const app = new App()
        const bike = new Bike('caloi mountainbike', 'mountain bike',
            1234, 1234, 100.0, 'My bike', 5, [])
        app.registerBike(bike)
        const newYork = new Location(40.753056, -73.983056)
        app.moveBikeTo(bike.id, newYork)
        expect(bike.location.latitude).toEqual(newYork.latitude)
        expect(bike.location.longitude).toEqual(newYork.longitude)
    })

    it('should throw an exception when trying to move an unregistered bike', () => {
        const app = new App()
        const newYork = new Location(40.753056, -73.983056)
        expect(() => {
            app.moveBikeTo('fake-id', newYork)

        }).toThrow(BikeNotFoundError)
    })

    it('should correctly handle bike rent',async () => {
        const app = new App()
        const user = new User('Jose', 'jose@mail.com', '1234')
        await app.registerUser(user)
        const bike = new Bike('caloi mountainbike', 'mountain bike',
            1234, 1234, 100.0, 'My bike', 5, [])
        app.registerBike(bike)
        app.rentBike(bike.id, user.email)
        expect(app.rents.length).toEqual(1)
        expect(app.rents[0].bike.id).toEqual(bike.id)
        expect(app.rents[0].user.id).toEqual(user.id)
    })

    it('should throw an exception when trying to remove an unregistered user', async () =>{
        const app = new App()
        const user = new User('Jose', 'jose@mail.com', '1234')
        await app.registerUser(user)
        expect (() => {
            app.removeUser('joao@mail.com')
        }).toThrow(UserNotFoundError)
    })
    it('should throw an exception when trying to return an unregistered bike', async()=>{
        const app = new App()
        const user = new User('Jose', 'jose@mail.com', '1234')
        await app.registerUser(user)
        const bike = new Bike('caloi mountainbike', 'mountain bike',
            1234, 1234, 100.0, 'My bike', 5, [])
            app.registerBike(bike)
        const bike2 = new Bike('caloi speed', 'speed bike',
            3234, 3234, 1200.0, 'bike', 5, [])
        expect(()=>{
            app.returnBike(bike2.id, 'joao@mail.com')
        }).toThrow(RentNotFoundError)
    })
    it('should throw an exception when the passwords do not match.', async()=>{
        const app = new App()
        const user = new User('Jose', 'jose@mail.com', '1234')
        await app.registerUser(user)
        expect(()=>(
            app.authenticate('joao@mail', '2134')
        )).toThrow(UserNotFoundError)
        

    })
    it('should throw an exception when trying to rent an unavailable bike.', async()=>{
        const app = new App()
        const user = new User('Jose', 'jose@mail.com', '1234')
        const user2 = new User('Joao', 'joao@mail.com', '1334')
        await app.registerUser(user)
        const bike = new Bike('caloi mountainbike', 'mountain bike',
            1234, 1234, 100.0, 'My bike', 5, [])
        app.rentBike(bike.id, user.email)
        expect(()=>{
            app.rentBike(bike.id, user2.email)
        }).toThrow(UnavailableBikeError)

    it('should throw an exception when trying to find an unregistered bike', () => {
        const app = new App()          
        expect(() => {
            app.findBike('fake-id')
    
        }).toThrow(BikeNotFoundError)
    })

})
