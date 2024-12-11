const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const propertyController = require('../controllers/propertyController');

const uploadsDir = path.resolve(__dirname, '../uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const filename = Date.now() + path.extname(file.originalname);
    cb(null, filename); 
  },
});
const upload = multer({ storage });

const router = express.Router();

router.post('/property', upload.fields([
  { name: 'mainImageFile', maxCount: 1 },
  { name: 'slider_images', maxCount: 10 },
]), propertyController.createProperty);

router.get('/property/get', propertyController.getAllProperties);

router.get('/property/get/:id', propertyController.getProperty);

router.get('/property/delete/:id', propertyController.deleteProperty);

router.put(
  '/property/update/:id',
  upload.fields([
    { name: 'mainImageFile', maxCount: 1 },
    { name: 'slider_images', maxCount: 10 },
  ]),
  propertyController. updateProperty
);

module.exports = router;
