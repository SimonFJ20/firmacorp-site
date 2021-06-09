import { JasonDoc } from "./jasondb";

export interface UserDoc extends JasonDoc {
    username: string,
    password: string,
    token?: string
}

export interface ProduktDoc extends JasonDoc {
    
}

