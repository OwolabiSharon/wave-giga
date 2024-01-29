import { Router } from 'express';
import subCategoryController from '../controllers/subCategory.controller';

const router = Router();

router.post('/', subCategoryController.createSubCategory);
router.get('/', subCategoryController.getAllSubCategories);
router.get('/getAllProducts', subCategoryController.getAllProductsBySubCategory);
router.delete('/delete/:id', subCategoryController.deleteSubCategory);
router.put('/update/:id', subCategoryController.updateSubCategory);


export default router;