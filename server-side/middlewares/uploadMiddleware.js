import multer from 'multer'
import {CloudinaryStorage} from 'multer-storage-cloudinary'
import cloudinary from '../helpers/cloudinary.js'

const storage = new CloudinaryStorage({
    cloudinary:cloudinary,
    params: {
        folder: 'RRport',
        allowed_format: ['jpg', 'jpeg', 'png', 'webp', 'mp4'],
        resource_type: 'auto'
    }
})

const upload = multer({storage})

export default upload