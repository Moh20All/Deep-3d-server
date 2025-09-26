const Category = require('../models/Category');

// POST /admin/categories - Create new category
const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        
        const category = new Category({
            name,
            description
        });
        
        await category.save();
        
        res.status(201).json({
            success: true,
            data: category,
            message: 'Category created successfully'
        });
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({
                success: false,
                error: 'Category name already exists'
            });
        } else {
            res.status(500).json({
                success: false,
                error: 'Failed to create category'
            });
        }
    }
};

// GET /admin/categories - Get all categories
const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({})
            .sort({ name: 1 });
        
        res.json({
            success: true,
            data: categories,
            count: categories.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch categories'
        });
    }
};

// PUT /admin/categories/:id - Update category
const updateCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            { name, description },
            { new: true, runValidators: true }
        );
        
        if (!category) {
            return res.status(404).json({
                success: false,
                error: 'Category not found'
            });
        }
        
        res.json({
            success: true,
            data: category,
            message: 'Category updated successfully'
        });
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({
                success: false,
                error: 'Category name already exists'
            });
        } else {
            res.status(500).json({
                success: false,
                error: 'Failed to update category'
            });
        }
    }
};

// DELETE /admin/categories/:id - Delete category
const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        
        if (!category) {
            return res.status(404).json({
                success: false,
                error: 'Category not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Category deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to delete category'
        });
    }
};

module.exports = {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory
};
