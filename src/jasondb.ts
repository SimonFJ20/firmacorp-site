import { readFileSync, writeFileSync } from "fs";
import { compareObjects, generateUUID } from "./utils";

export interface JasonDoc {
    id: string;
}

class JasonCollection {

    public name: string;
    private docs: JasonDoc[];
    
    public constructor(name: string, docs: JasonDoc[]) {
        this.name = name;
        this.docs = docs;
    }

    public insertOne = <T extends JasonDoc = JasonDoc>(doc: {}) => {
        const id = generateUUID(16);
        const jasonDoc: JasonDoc = {...doc, id};
        this.docs.push(jasonDoc);
        return jasonDoc as T;
    }

    public findOne = <T extends JasonDoc = JasonDoc>(query: {}) => {
        for(let i in this.docs) if(compareObjects(this.docs[i], query)) return this.docs[i] as T;
        return null;
    }

    public findAll =  <T extends JasonDoc = JasonDoc>(query: {}) => {
        const out: T[] = [];
        for(let i in this.docs) if(compareObjects(this.docs[i], query)) out.push(this.docs[i] as T);
        return out;
    }

    public updateOne = <T extends JasonDoc = JasonDoc>(query: {}, doc: {}) => {
        for(let i in this.docs) if(compareObjects(this.docs[i], query)) {
            this.docs[i] = {...this.docs[i], ...doc, id: this.docs[i].id};
            return this.docs[i] as T
        };
        return null;
    }

    public replaceOne = <T extends JasonDoc = JasonDoc>(query: {}, doc: {}) => {
        for(let i in this.docs) if(compareObjects(this.docs[i], query)) {
            this.docs[i] = {...doc, id: this.docs[i].id};
            return this.docs[i] as T
        };
        return null;
    }

    public deleteOne = <T extends JasonDoc = JasonDoc>(query: {}) => {
        for(let i = 0; i < this.docs.length; i++) if(compareObjects(this.docs[i], query)) {
            const doc: JasonDoc = {id: ''};
            Object.assign(doc, this.docs[i]);
            this.docs.splice(i, 1);
            console.log(doc);
            return doc as T;
        };
        return null;
    }

}

export class JasonDB {

    private filename: string;
    private collections: JasonCollection[];

    public constructor(filename: string) {
        this.filename = filename;
        this.collections = [];
        this.load();
    }

    public collection = (name: string) => {
        for(let i in this.collections) if(this.collections[i].name === name) return this.collections[i];
        const newCollection = new JasonCollection(name, []);
        this.collections.push(newCollection);
        return newCollection;
    }

    public load = () => {
        try {
            const raw = readFileSync(this.filename);
            const json = raw.toString();
            const data = JSON.parse(json);
            this.collections = [];
            for(let i in data.collections) {
                const name = data.collections[i].name;
                const docs = data.collections[i].docs;
                const collection = new JasonCollection(name, docs);
                this.collections.push(collection);
            }
        } catch {

        }
    }

    public save = () => {
        const data = {
            collections: this.collections
        };
        const json = JSON.stringify(data, null, 4);
        writeFileSync(this.filename, json);
    }

}

export const getJasonDB = (filename: string) => {
    const db = new JasonDB(filename);
    return db;
}
