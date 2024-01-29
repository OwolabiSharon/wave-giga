import { Router } from 'express';
import { ProductService } from '../services/product.service';
import ProductController from '../controllers/product.controller';

const router = Router();
const productService = new ProductService();
const productController: ProductController = new ProductController(productService);

router.get('/', productController.getAll);
router.post('/create', productController.create);
router.get('/search', productController.search);
router.put('/update', productController.update);
router.delete('/remove', productController.remove);
router.post('/add-review', productController.addReview);
router.delete('/remove-review', productController.removeReview);
router.get('/get-product-rating', productController.getProductRating);
router.get('/get-product-reviews', productController.getProductReviews);
router.get('/get-product', productController.getProduct);
router.get('/get-popular-products', productController.getPopularProducts);
router.get('/get-new-products', productController.getNewProducts);
router.get('/get-featured-products', productController.getFeaturedProdcuts);
export default router;