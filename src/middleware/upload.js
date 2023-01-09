const {GridFsStorage} = require('multer-gridfs-storage');
const multer = require('multer');
const util = require('util');

const storage = new GridFsStorage({
  url: process.env.DB_URL,
  file: (req, file) => {
    const prefix = Date.now();
    return {
      bucketName: 'uploads',
      filename: `${prefix}-pxt-${file.originalname}`,
    };
  },
});

const uploadFiles = multer({
  storage: storage,
}).single('file');
const upload = util.promisify(uploadFiles);
module.exports = upload;
