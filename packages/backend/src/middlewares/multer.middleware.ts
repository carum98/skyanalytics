import multer from 'multer'
import path from 'node:path'

const uploadsFolder = path.resolve(__dirname, '..', '..', 'uploads')

const upload = multer({ 
    storage: multer.diskStorage({
        destination: (_req, _file, cb) => {
            cb(null, uploadsFolder)
        },
        filename: function(_req, file, cb) {
            cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
        }
    })
})

export const multerSingleMiddleware = (fileName: string) => upload.single(fileName)
