import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'
import { config } from '../config'
import { ValidationError } from '../utils/errors'

// Ensure upload directory exists
const uploadDir = config.uploads.dir
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir)
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg'
    const filename = `${Date.now()}-${uuidv4()}${ext}`
    cb(null, filename)
  },
})

const fileFilter = (
  _req: unknown,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/jpg',
    'video/mp4',
    'video/quicktime',
  ]

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new ValidationError(`Unsupported file type: ${file.mimetype}. Allowed: JPEG, PNG, WEBP, MP4.`))
  }
}

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.uploads.maxFileSizeMb * 1024 * 1024,
  },
})
