const asyncHandler = require('express-async-handler');
const { uploadBufferToCloudinary } = require('../utils/cloudinaryUpload');
const Vendor = require('../models/Vendor');

// @desc    Upload one or more images to Cloudinary / local storage and return their URLs & save metadata
// @route   POST /api/uploads/images
// @access  Private (vendor or admin)
const uploadImages = asyncHandler(async (req, res) => {
  const files = req.files || (req.file ? [req.file] : []);
  if (!files || files.length === 0) {
    res.status(400);
    throw new Error('No files were provided for upload');
  }

  const category = req.body.category || 'Cover Image';
  const customCategoryName = req.body.customCategoryName || '';

  const urls = [];
  const photoRecords = [];

  for (const file of files) {
    // eslint-disable-next-line no-await-in-loop
    const result = await uploadBufferToCloudinary(file.buffer, {
      folder: 'carwash-platform/shop-images',
      resourceType: 'image',
      originalName: file.originalname,
    });
    const finalUrl = result.secure_url || result.url;
    urls.push(finalUrl);
    photoRecords.push({
      imageUrl: finalUrl,
      category,
      customCategoryName: category === 'Other' ? customCategoryName : '',
      uploadedAt: new Date(),
    });
  }

  const primaryUrl = urls[0];

  // If user is a vendor, persist the uploaded images into MongoDB vendor profile
  if (req.user && req.user.vendorProfile) {
    const vendor = await Vendor.findById(req.user.vendorProfile);
    if (vendor) {
      photoRecords.forEach((p) => {
        vendor.shopPhotos.push(p);
        if (!vendor.galleryImages.includes(p.imageUrl)) {
          vendor.galleryImages.push(p.imageUrl);
        }
      });
      if (category === 'Cover Image' || !vendor.coverImageUrl) {
        vendor.coverImageUrl = primaryUrl;
      }
      await vendor.save();
    }
  }

  res.status(201).json({
    success: true,
    data: {
      url: primaryUrl,
      urls,
      photoRecords,
    },
    url: primaryUrl,
  });
});

module.exports = { uploadImages };


