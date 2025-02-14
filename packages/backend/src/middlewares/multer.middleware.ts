import multer from 'multer'
import path from 'node:path'
import fs from 'node:fs/promises'

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

export const multerNoneMiddleware = () => upload.none()

export const multerArrayMiddleware = (fileName: string, maxCount: number) => upload.array(fileName, maxCount)

// Helpers
export async function readFile(file: Express.Multer.File) {
    try {
        return await fs.readFile(file.path)
    } catch (err) {
        console.error("Error reading file:", err)
        throw err
    }
}

export function removeFile(file: Express.Multer.File) {
    try {
        return fs.unlink(file.path)
    } catch (err) {
        console.error("Error removing file:", err)
        throw err
    }
}