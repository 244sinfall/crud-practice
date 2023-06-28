import {DbDriver} from "./db-driver";
import {Person} from "./person";
import {ClickHouseClient, createClient} from "@clickhouse/client";

export class ClickhouseDriver implements DbDriver {
    name = "Clickhouse"
    private client: ClickHouseClient
    private userId = 1
    constructor() {
        this.client = createClient({host: 'http://clickhouse:8123'});
    }
    async connect(){
        await this.client.command({
            query: 'CREATE DATABASE IF NOT EXISTS persons'
        })
        await this.client.command({
            query: "CREATE TABLE IF NOT EXISTS persons.persons (id Int64, firstName String, lastName String, age Int64, country String) Engine = MergeTree Primary Key(id)"
        })
    }
    async disconnect() {
        await this.client.command({
            query: 'DROP TABLE persons.persons'
        })
    }
    async create(object: Person): Promise<unknown> {
        const id = this.userId
        await this.client.insert({
            table: 'persons.persons',
            values: [{id, ...object}],
            format: "JSONEachRow"

        })
        this.userId++
        return id;
    }

    async delete(identifier: unknown): Promise<void> {
        await this.client.query({
            query: `ALTER TABLE persons.persons DELETE WHERE id = ${identifier}`
        })
    }

    async read(identifier: unknown): Promise<Person> {
        const res = await this.client.query({
            query: `SELECT * FROM persons.persons WHERE id = ${identifier}`,
            format: "JSON"
        })
        const json: {data: Person[]} = await res.json()
        return json.data[0]
    }

    async update(identifier: unknown, newInfo: Person): Promise<void> {
        await this.client.query({
            query: `ALTER TABLE persons.persons UPDATE firstName = '${newInfo.firstName}', age = ${newInfo.age}, lastName = '${newInfo.lastName}', country = '${newInfo.country}' WHERE id = ${identifier}`
        })
        return
    }

}