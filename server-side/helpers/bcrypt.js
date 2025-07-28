import bcrpyt from "bcrypt"
const salt = 10 

export async function hashPassword (password) {
    return bcrpyt.hash(password, salt)
}

export async function comparePassword (password, hashedPassword) {
    return bcrpyt.compare(password, hashedPassword)
}
