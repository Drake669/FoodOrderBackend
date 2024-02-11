import bycrypt from "bcrypt"

export const generateSalt =async () => {
    return await bycrypt.genSalt()
}

export const generateHashedPassword =async (password:string, salt: string) => {
    return await bycrypt.hash(password, salt)
}

export const validatePassword =async (enteredPassword:string, userPassword: string, salt: string) => {
    return await generateHashedPassword(enteredPassword, salt) === userPassword
}