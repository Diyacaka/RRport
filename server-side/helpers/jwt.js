import jwt from "jsonwebtoken"
import {config} from "dotenv"
config()

const secret = process.env.SECRET_KEY

export async function signToken (payload) {
    return jwt.sign(payload, secret)
}

export async function verifyToken(token) {
    return jwt.verify(token, secret)
}