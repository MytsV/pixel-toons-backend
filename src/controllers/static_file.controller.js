const upload = require("../middleware/upload");

const uploadFile = async (req, res) => {
  try {
    await upload(req, res);
    if (!req.file) {
      return res.send('File wasn\'t selected');
    }
    return res.send('File has been uploaded');
  } catch (err) {
    return res.send(err);
  }
};

module.exports = {uploadFile};
