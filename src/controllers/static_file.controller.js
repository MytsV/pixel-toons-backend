const upload = require('../middleware/upload');
const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');
const sendMsg = require("../middleware/message_builder");

const uploadFile = async (req, res) => {
  try {
    await upload(req, res);
    if (!req.file) {
      return sendMsg(res, 'file_not_selected', 422);
    }
    return res.send({
      filename: req.file.filename,
    });
  } catch (err) {
    return sendMsg(res, 'server_error', 500);
  }
};

const downloadFile = async (req, res) => {
  try {
    const { db } = mongoose.connection;

    const bucket = new GridFSBucket(db, {
      bucketName: 'uploads',
    });
    const downloadStream = bucket.openDownloadStreamByName(req.params.name);

    downloadStream.on('data', (data) => res.write(data));

    downloadStream.on('error', (_) =>
      // 404 Not Found
      sendMsg(res, 'file_not_found', 404)
    );

    downloadStream.on('end', () => res.end());
  } catch (err) {
    // Server error
    return sendMsg(res, 'server_error', 500);
  }
};

module.exports = { uploadFile, downloadFile };
