import * as fs from 'fs';
import { diskStorage } from 'multer';
import * as path from 'path';

import { sanitizeString } from './sanitizeString.utils';

export const storage = diskStorage({
  destination: (req, file, callback) => {
    const tmpDir = path.join(__dirname, 'tmp');
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir);
    }
    callback(null, tmpDir);
  },
  filename: (req, file, callback) => {
    const fileExtension = path.extname(file.originalname);
    const fileName = sanitizeString(
      path.basename(file.originalname, fileExtension),
    );
    callback(null, `${fileName}-${Date.now()}${fileExtension}`);
  },
});
