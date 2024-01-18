import { Router } from 'express';
import CategoryController from '../controllers/category.controller';

const router = Router();

router.get('/', CategoryController.getAllCategories);
router.get('/:categoryName', CategoryController.getCategoryByName);
router.post('/', CategoryController.createCategory);
router.delete('/', CategoryController.deleteCategory);

export default router;