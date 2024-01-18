import { Router } from 'express';
import CategoryController from '../controllers/category.controller';

const router = Router();

router.get('/', CategoryController.getAllCategories);
router.get('/:categoryName', CategoryController.getCategoryByName);
router.post('/', CategoryController.createCategory);
router.delete('/', CategoryController.deleteCategory);
router.delete('/multiple', CategoryController.deleteMultipleCategories);
router.put('/', CategoryController.updateCategory);



export default router;