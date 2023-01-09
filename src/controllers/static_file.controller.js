const upload = require('../middleware/upload');
const mongoose = require('mongoose');
const {GridFSBucket} = require('mongodb');

const uploadFile = async (req, res) => {
  try {
    await upload(req, res);
    if (!req.file) {
      return res.send('File wasn\'t selected');
    }
    return res.send({
      filename: req.file.filename,
    });
  } catch (err) {
    return res.send(err);
  }
};

const downloadFile = async (req, res) => {
  try {
    const {db} = mongoose.connection;

    const bucket = new GridFSBucket(db, {
      bucketName: 'uploads',
    });
    const downloadStream = bucket.openDownloadStreamByName(req.params.name);

    downloadStream.on('data', (data) => {
      return res.write(data);
    });

    downloadStream.on('error', (err) => {
      // 404 Not Found
      return res.status(404).send('File not found');
    });

    downloadStream.on('end', () => res.end());
  } catch (err) {
    // Server error
    return res.status(500).send(err);
  }
};

module.exports = {uploadFile, downloadFile};
