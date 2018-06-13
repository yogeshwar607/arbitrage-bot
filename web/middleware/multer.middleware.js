const multer = require('multer');
const uuid = require('uuid/v1');

const docstorage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, './uploads/documents');
  },
  filename(req, file, cb) {
    const fileExtension = file.originalname.split('.')[1];
    const originalname = file.originalname.split('.')[0];
    const filename = [originalname, uuid(), fileExtension].join('.');
    cb(null, filename);
  },
});


const fileFilter = function (req, file, cb) {
  cb(null, true);
};


const docsMulter = multer({
  storage: docstorage,
  fileFilter: fileFilter,
}).any();


module.exports = { docsMulter };