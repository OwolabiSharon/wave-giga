import { Request, Response } from 'express';
import httpStatus from 'http-status';
import productService from '../services/product.service';
import ProductSchema from '../validations/products.model.zod';

class productController {
    async create(req: Request, res: Response) {
        //use zod to validate req.body and then create product
        const product = await productService.create(ProductSchema.parse(req.body));
        res.status(httpStatus.CREATED).send(product);
    }
    
    async findAll(req: Request, res: Response) {
        const products = await productService.findAll();
        res.status(httpStatus.OK).send(products);
    }
    
    async update(req: Request, res: Response) {
        const product = await productService.update( req.body);
        res.status(httpStatus.OK).send(product);
    }

    async remove(req: Request, res: Response) {
        const product = await productService.remove(req.body);
        res.status(httpStatus.OK).send(product);
    }

}

export default new productController();