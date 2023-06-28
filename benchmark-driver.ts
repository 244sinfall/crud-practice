import {DbDriver} from "./db-driver";
import {PersonGenerator} from "./person-generator";
import {Person} from "./person";
import {BenchmarkRawData, BenchmarkResults} from "./benchmark.types";

export class BenchmarkDriver {
    private personGenerator: PersonGenerator
    constructor(
        private driver: DbDriver
    ) {
        this.personGenerator = new PersonGenerator();
    }
    public getDriverName() {
        return this.driver.name
    }

    private async run(operations: number): Promise<BenchmarkRawData> {
        await this.driver.connect();
        const identifiers: unknown[] = []
        const persons: Person[] = []
        const startTime = performance.now()
        for (let i = 0; i < operations; i++) {
            identifiers.push(await this.driver.create(this.personGenerator.generateOne()))
        } // create
        let create = performance.now()
        for (let i = 0; i < operations; i++) {
            persons.push(await this.driver.read(identifiers[i]))
        } // read
        let read = performance.now()
        for (let i = 0; i < operations; i++) {
            await this.driver.update(identifiers[i], persons[persons.length - 1 - i])
        } // update
        let update = performance.now()
        for (let i = 0; i < operations; i++) {
            await this.driver.delete(identifiers[i])
        } // delete
        let deleteTime = performance.now()
        const total = deleteTime - startTime
        deleteTime -= update
        update -= read
        read -= create
        create -= startTime
        await this.driver.disconnect()
        return {create, read, update, delete: deleteTime, total};
    }
    async benchmark(operations: number, runsAmount = 5): Promise<BenchmarkResults> {
        console.log(`Running ${operations} operations on ${this.driver.name} ${runsAmount} times`)
        const measurements: BenchmarkRawData[] = []
        for(let i = 0; i < runsAmount; i++) {
            measurements.push(await this.run(operations))
        }
        console.log('Calculating expected value')
        const expectedValue = {create: 0, delete: 0, read: 0, update: 0, total: 0}
        measurements.forEach(result => {
            for (let prop in expectedValue) {
                expectedValue[prop] += result[prop]
            }
        })
        for(let prop in expectedValue) {
            expectedValue[prop] = expectedValue[prop] / measurements.length
        }
        console.log('Calculating variance')
        const variance = {create: 0, delete: 0, read: 0, update: 0, total: 0}
        for(let prop in variance) {
            variance[prop] = measurements.map(rawResult => Math.pow(rawResult[prop] - expectedValue[prop], 2))
                .reduce((acc, cv) => acc + cv, 0) / measurements.length
        }
        return {
            measurements,
            expectedValue,
            variance
        }
    }
}