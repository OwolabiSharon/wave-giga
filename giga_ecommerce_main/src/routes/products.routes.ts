import { Router } from 'express';
import productController from '../controllers/product.controller';
const router = Router();

router.get('/', productController.findAll);
router.post('/create', productController.create);
router.put('/update', productController.update);
router.delete('/remove', productController.remove);
router.post('/search', productController.searchProductsByName);
router.post('/searchByCategory', productController.searchProductsByCategory);

export default router;