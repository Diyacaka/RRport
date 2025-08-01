import { v2 as cloudinary } from "cloudinary";
import { config } from "dotenv";
config();

cloudinary.config({
    cloud_name: process.env.CClOUD_NAME,
    api_key: process.env.CCLOUD_API_KEY,
    api_secret: process.env.CCLOUD_API_SECRET
})

export default cloudinary