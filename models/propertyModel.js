const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  category: { type: String, required: true },
  propertyName: { type: String, required: true },
  propertyDescription: { type: String, required: true },
  perNightPrice: { type: Number, required: true },
  location: { type: String, required: true },
  mainImageFile: { type: String, required: true },
  sliderImages: [{ type: String }],  
  startDate: { type: Date },
  endDate: { type: Date },
  guests: { type: Number, default: 1 },
  bedrooms: { type: Number, default: 1 },
  beds: { type: Number, default: 1 },
  bathrooms: { type: Number, default: 1 },
  amenities: [{ type: String }],  
  safetyItems: [{ type: String }], 
  standoutAmenities: [{ type: String }],  
  placeFeatures: [{ type: String }],  
  placeType: { type: String, required: true }, 
}, { timestamps: true });

const Property = mongoose.model('Property', propertySchema);
module.exports = Property;
