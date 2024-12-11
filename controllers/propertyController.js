const Property = require('../models/propertyModel');
const fs = require('fs');
const path = require('path');

// Create a new property
const createProperty = async (req, res) => {
  try {
    const { category, propertyName, propertyDescription, perNightPrice, location, startDate, endDate, guests,bedrooms,beds,bathrooms,amenities,safetyItems,standoutAmenities,placeFeatures,placeType, } = req.body;

    // Handle image paths
    const mainImageFile = req.files['mainImageFile'] ? req.files['mainImageFile'][0] : null;
    const sliderImages = req.files['slider_images'] || [];

    const mainimagename = mainImageFile ? `uploads/${mainImageFile.filename}` : null;

    const sliderImageNames = sliderImages.map(file => `uploads/${file.filename}`);
    
    // Create a new property document
    const newProperty = new Property({
      category,
      propertyName,
      propertyDescription,
      perNightPrice,
      location,
      mainImageFile: mainimagename,
      sliderImages: sliderImageNames, 
      startDate,
      endDate,
      guests: guests || 1,  
      bedrooms: bedrooms || 1, 
      beds: beds || 1, 
      bathrooms: bathrooms || 1,  
      amenities: amenities || [],
      safetyItems: safetyItems || [],
      standoutAmenities: standoutAmenities || [],
      placeFeatures: placeFeatures || [],
      placeType, 
    });

    await newProperty.save();
    res.status(201).json({ message: 'Property added successfully', property: newProperty });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding property', error });
  }
};

const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find(); 
    res.status(200).json(properties); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching properties', error });
  }
};


const getProperty = async (req, res) => {
  try {
    const { id } = req.params;  // Get the id from the route parameters
    const property = await Property.findById(id);  // Find the property by id

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });  // If property not found, return a 404 error
    }

    res.status(200).json(property);  // Return the found property as a response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching property', error });  // Handle server error
  }
};


const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params; 
    console.log('Deleting property with id:', id); 

    const property = await Property.findById(id); 
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });  
    }


    if (property.mainImageFile) {
      const mainImagePath = path.join(__dirname, '..', property.mainImageFile); // Adjust path as necessary
      console.log('Deleting main image at path:', mainImagePath); // Log image path
      if (fs.existsSync(mainImagePath)) {
        fs.unlinkSync(mainImagePath);
        console.log('Main image deleted successfully');
      } else {
        console.log('Main image file not found');
      }
    }

    if (property.sliderImages && Array.isArray(property.sliderImages)) {
      property.sliderImages.forEach(image => {
        const sliderImagePath = path.join(__dirname, '..', image); // Adjust path as necessary
        console.log('Deleting slider image at path:', sliderImagePath); // Log each image path
        if (fs.existsSync(sliderImagePath)) {
          fs.unlinkSync(sliderImagePath);
          console.log('Slider image deleted successfully');
        } else {
          console.log('Slider image not found');
        }
      });
    }

    const deletedProperty = await Property.findByIdAndDelete(id); 
    if (!deletedProperty) {
      return res.status(404).json({ message: 'Property not found during deletion' });
    }

    console.log('Property deleted successfully');
    res.status(200).json({ message: 'Property and images deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting property and images', error });
  }
};




  const updateProperty = async (req, res) => {
    const { id } = req.params;

    const {
        category,
        propertyName,
        propertyDescription,
        perNightPrice,
        location,
        startDate,
        endDate,
        placeType,
        guests,
        bathrooms,
        bedrooms,
        beds,
        amenities,
        standoutAmenities,
        safetyItems,
        placeFeatures
    } = req.body;

    const mainImage = req.files?.mainImageFile ? req.files.mainImageFile[0] : null;
    const newSliderImages = req.files?.slider_images || [];
    const existingSliderImages = req.body.existing_slider_images 
        ? Array.isArray(req.body.existing_slider_images)
            ? req.body.existing_slider_images
            : [req.body.existing_slider_images]
        : [];

    try {
        // Find the existing property by ID
        const property = await Property.findById(id);

        if (!property) {
            return res.status(404).json({ message: "Property not found" });
        }

        // Update property fields
        property.category = category || property.category;
        property.propertyName = propertyName || property.propertyName;
        property.propertyDescription = propertyDescription || property.propertyDescription;
        property.perNightPrice = perNightPrice || property.perNightPrice;
        property.location = location || property.location;
        property.startDate = startDate || property.startDate;
        property.endDate = endDate || property.endDate;
        property.placeType = placeType || property.placeType;
        property.guests = guests || property.guests;
        property.bathrooms = bathrooms || property.bathrooms;
        property.bedrooms = bedrooms || property.bedrooms;
        property.beds = beds || property.beds;
        property.amenities = amenities || property.amenities;
        property.standoutAmenities = standoutAmenities || property.standoutAmenities;
        property.safetyItems = safetyItems || property.safetyItems;
        property.placeFeatures = placeFeatures || property.placeFeatures;

        // Update main image if provided
        if (mainImage) {
            // Remove old main image if exists
            if (property.mainImage) {
                const oldMainImagePath = path.join(__dirname, "..", "uploads", property.mainImage);
                if (fs.existsSync(oldMainImagePath)) {
                    fs.unlinkSync(oldMainImagePath);
                }
            }
            property.mainImage = mainImage.filename;
        }

        // Handle slider images
        const allSliderImages = [
          ...existingSliderImages.map((file) => `${file}`),
          ...newSliderImages.map((file) => `uploads/${file.filename}`)
      ];

        // Remove old slider images that are not in the updated list
        const imagesToRemove = property.sliderImages.filter(
            (oldImage) => !allSliderImages.includes(oldImage)
        );
        imagesToRemove.forEach((image) => {
            const oldImagePath = path.join(__dirname, "..", "uploads", image);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        });

        // Update slider images
        property.sliderImages = allSliderImages;

        // Save the updated property
        await property.save();
        console.log("Saving property with placeType:", property.placeType);

        return res.status(200).json({
            message: "Property updated successfully",
            property,
        });
    } catch (error) {
        console.error("Error updating property:", error);
        return res.status(500).json({ message: "Server error", error });
    }
  };


  module.exports = { createProperty,getAllProperties,getProperty,deleteProperty,updateProperty };
