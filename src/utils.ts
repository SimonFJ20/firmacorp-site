
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

