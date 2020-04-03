export function randomString(length) {
    return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
}

export const combineTwo = (one,two) => ((!one || !two) ? `${one || ''}${two || ''}`: `${one}, ${two}`)

export const getExtension = (uri) => !uri ? null : uri.substr(uri.lastIndexOf('.'));
