import {Person} from "./person";

export interface DbDriver {
    name: string
    connect(): Promise<void>
    create(object: Person): Promise<unknown> // unknown identifier
    read(identifier: unknown): Promise<Person>
    update(identifier: unknown, newInfo: Person): Promise<void>
    delete(identifier: unknown): Promise<void>
    disconnect(): Promise<void>
}