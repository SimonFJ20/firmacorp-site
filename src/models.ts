import { JasonDoc } from "./jasondb";

export interface UserDoc extends JasonDoc {
    username: string,
    password: string,
    token?: string
}

export interface ProduktDoc extends JasonDoc {
    title: string,
    description: string,
    price: string,
    images: string[]
}

export interface CarouselDoc extends JasonDoc {
    main: boolean,
    products: string[]
}