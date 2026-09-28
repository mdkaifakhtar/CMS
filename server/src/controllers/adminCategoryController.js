const asyncHandler = require('express-async-handler');
const ServiceCategory = require('../models/ServiceCategory');
const Service = require('../models/Service');

// @desc    List all categories (including inactive) for admin management
// @route   GET /api/admin/categories
const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await ServiceCategory.find().sort({ sortOrder: 1, name: 1 });

  // Attach a live count of services per category so admin can see impact before deleting
  const counts = await Service.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]);
  const countMap = Object.fromEntries(counts.map((c) => [c._id.toString(), c.count]));

  const withCounts = categories.map((c) => ({
    ...c.toObject(),
    serviceCount: countMap[c._id.toString()] || 0,
  }));

  res.json({ success: true, data: withCounts });
});

const slugify = (name) => name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

// @desc    Create a new service category
// @route   POST /api/admin/categories
const createCategory = asyncHandler(async (req, res) => {
  const { name, iconUrl, sortOrder } = req.body;
  if (!name) {
    res.status(400);
    throw new Error('Category name is required');
  }

  const existing = await ServiceCategory.findOne({ name: new RegExp(`^${name}$`, 'i') });
  if (existing) {
    res.status(400);
    throw new Error('A category with this name already exists');
  }

  const category = await ServiceCategory.create({
    name,
    slug: slugify(name),
    iconUrl,
    sortOrder: sortOrder || 0,
  });

  res.status(201).json({ success: true, data: category });
});

// @desc    Update a category
// @route   PUT /api/admin/categories/:id
const updateCategory = asyncHandler(async (req, res) => {
  const category = await ServiceCategory.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  const { name, iconUrl, sortOrder } = req.body;
  if (name) {
    category.name = name;
    category.slug = slugify(name);
  }
  if (iconUrl !== undefined) category.iconUrl = iconUrl;
  if (sortOrder !== undefined) category.sortOrder = sortOrder;

  await category.save();
  res.json({ success: true, data: category });
});

// @desc    Toggle a category active/inactive (soft hide from customer catalog)
// @route   PUT /api/admin/categories/:id/toggle-active
const toggleCategoryActive = asyncHandler(async (req, res) => {
  const category = await ServiceCategory.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }
  category.isActive = !category.isActive;
  await category.save();
  res.json({ success: true, data: category });
});

// @desc    Delete a category (blocked if services still reference it)
// @route   DELETE /api/admin/categories/:id
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await ServiceCategory.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  const serviceCount = await Service.countDocuments({ category: category._id });
  if (serviceCount > 0) {
    res.status(400);
    throw new Error(
      `Cannot delete this category — ${serviceCount} service(s) still use it. Deactivate it instead, or reassign those services first.`
    );
  }

  await category.deleteOne();
  res.json({ success: true, data: { deletedId: req.params.id } });
});

module.exports = {
  getAllCategories,
  createCategory,
  updateCategory,
  toggleCategoryActive,
  deleteCategory,
};
