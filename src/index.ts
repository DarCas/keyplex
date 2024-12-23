/**
 * @author      Dario Casertano <dario@casertano.name>
 * @copyright   Copyright (c) 2024-present Casertano Dario – All rights reserved.
 * @license     MIT
 */

import forEach from 'lodash/forEach'
import { default as lodashKeys } from 'lodash/keys'

export abstract class KeyPlex {
    protected readonly dbname: string

    constructor(dbname?: string) {
        if (dbname) {
            this.dbname = dbname
        } else {
            this.dbname = new URL(location.href)
                .hostname.split('.')
                .reverse()
                .join('.')
        }
    }

    get<T = unknown>(key: string, def: T | null = null): T {
        const data = this.getItem(this.getPath(key))

        return ( data ? JSON.parse(data) : def ) as T
    }

    set<T = unknown>(key: string, value: T): void {
        this.setItem(this.getPath(key), JSON.stringify(value))
    }

    del(key: string): void {
        const path = this.getPath(key)

        if (path.endsWith('%')) {
            const pattern = path.substring(0, path.length - 1)

            forEach(this.keys(), (key) => {
                if (key.startsWith(pattern)) {
                    this.removeItem(key)
                }
            })
        } else {
            this.removeItem(this.getPath(key))
        }
    }

    has(key: string): boolean {
        return ( this.get(key) !== null )
    }

    abstract keys(): string[]

    protected getPath(key: string): string {
        return [
            `@${this.dbname}`,
            key,
        ].join('/')
    }

    protected abstract getItem(key: string): string | null

    protected abstract setItem(key: string, value: string): void

    protected abstract removeItem(key: string): void
}

export class LocalPlex extends KeyPlex {
    keys = (): string[] => lodashKeys(localStorage)

    protected getItem = (key: string): string | null => localStorage.getItem(key)
    protected setItem = (key: string, value: string): void => localStorage.setItem(key, value)
    protected removeItem = (key: string): void => localStorage.removeItem(key)
}

export class SessionPlex extends KeyPlex {
    keys = (): string[] => lodashKeys(sessionStorage)

    protected getItem = (key: string): string | null => sessionStorage.getItem(key)
    protected setItem = (key: string, value: string): void => sessionStorage.setItem(key, value)
    protected removeItem = (key: string): void => sessionStorage.removeItem(key)
}
