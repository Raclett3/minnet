export const validateUsername = (username: string) => /^[a-zA-Z0-9]{1,32}$/.test(username);
export const validateRemoteUsername = (username: string) => /^[a-zA-Z0-9_-]+/.test(username);
export const validatePassword = (password: string) => /^[\x20-\x7e]{8,64}$/.test(password);
