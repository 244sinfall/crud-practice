import {Person} from "./person";

export class PersonGenerator {
    firstNames = ["Dmitry", "Alexey", "Vladimir"]
    lastNames = ["Ivanov", "Petrov", "Sidorov"]
    countries = ["Russia", "United States", "Argentina"]
    generateOne() {
        const randomIntBetween = (from: number, to: number) => {
            const min = Math.ceil(from);
            const max = Math.floor(to);
            return Math.floor(Math.random() * (max - min) + min);
        }
        const randomIndex = <T>(arr: T[]) => {
            return arr[randomIntBetween(0, arr.length-1)]
        }
        return new Person(randomIndex(this.firstNames),
            randomIndex(this.lastNames),
            randomIntBetween(18, 75),
            randomIndex(this.countries))
    }
}