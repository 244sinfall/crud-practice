
import {DbDriver} from "./db-driver";
import {Person} from "./person";
import {createClient, RedisClientType} from "redis";

export class RedisDriver implements DbDriver{
    name = "Redis"
    private client: RedisClientType
    private currentIdentifier = 1
    constructor() {
        this.client = createClient({
            url: 'redis://redis:6379' // docker-compose container name instead of ip
        })
    }
    async connect() {
        if(this.client.isReady) return
        return new Promise<void>((resolve, reject) => {
            this.client.connect()
            this.client.on('ready', () => {
                resolve()
            })
            this.client.on('error', () => {
                process.stdout.write("Error on redis")
                reject();
                process.exit(1);
            })
        })
    }
    async disconnect() {
        return await this.client.disconnect()
    }
    async create(object: Person): Promise<unknown> {
        const identifier = `person:${this.currentIdentifier}`
        this.currentIdentifier++
        await this.client.set(identifier, JSON.stringify(object))
        return identifier
    }

    async delete(identifier: unknown): Promise<void> {
        await this.client.del(String(identifier))
    }

    async read(identifier: unknown): Promise<Person> {
        return JSON.parse(await this.client.get(String(identifier)))
    }

    async update(identifier: unknown, newInfo: Person): Promise<void> {
        await this.client.set(String(identifier), JSON.stringify(newInfo))
    }
}