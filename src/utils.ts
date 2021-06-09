
const UUID_CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNPQRSTUVWXYZ1234567890';
const UUID_CHARS_LENGTH = 61;

export const generateUUID = (length: number) => {
    let id = '';
    for(let i = 0; i < length; i++) id += UUID_CHARS.charAt(Math.floor(Math.random() * UUID_CHARS_LENGTH));
    return id;
}

export const compareObjects = (primary: {}, secondary: {}) => {
    try {
        // @ts-ignore
        for(let i in primary) if(primary[i] !== secondary[i]) return false;
    } catch {
        return false;
    }
    return true;
}

export const validateUsername = (username: string) => {
    const regex = /<|>/g;
    if(typeof(username) === 'string' && username.trim().length > 0 && !username.match(regex)) return true;
    return false;
}

export const validateEmail = (email: string): boolean => {
    const re = /^[\w\.\-]+@[\w\-]+\.?[\w\-]+\.\w{2,}$/;
    return re.test(email)
}

export const exists = (...values: any[]) => {
    for(let i in values) if(values[i] === null || values[i] === undefined) return false;
    return true;
}

export const either = (value1: any, value2: any) => {
    return value1 ? value1 : value2;
}

