const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');;
aws.config.loadFromPath(__dirname + '/../config/s3.json');

const upload = multer({
    storage : s3,
    bucket : 'matemate-ver2',
    cl : 'public-read',
    key : function(req, file, cb) {
        cb(null, Date.now() + '.'+file.originalname.split('.').pop());
    }
}, 'NONE');

module.exports = upload;