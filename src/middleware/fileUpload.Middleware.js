
import fs from 'fs';
import multer from 'multer';

// Set up multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = './uploads/';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true }); // Create directory if it doesn't exist
        }
        cb(null, dir); // Save files to 'uploads' directory
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString().replace(/:/g, '_') + file.originalname); // Timestamped file names
    }
});
// Export multer middleware
export const upload = multer({ storage: storage });
