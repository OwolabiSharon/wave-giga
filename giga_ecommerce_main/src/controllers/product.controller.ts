import { Request, Response } from 'express';
import httpStatus from 'http-status';
import productService from '../services/product.service';
import ProductSchema from '../validations/products.model.zod';

class productController {
    async create(req: Request, res: Response) {
        //use zod to validate req.body and then create product
        const productBody = ProductSchema.createProductSchema.parse(req.body);
        const product = await productService.create(productBody); 
        res.status(httpStatus.CREATED).send(product);
    }
    
    async findAll(req: Request, res: Response) {
        const productbody = ProductSchema.ProductFindAllSchema.parse(req.body);
        const products = await productService.findAll(productbody.paginateNumber, productbody.paginateSize);
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

    async searchProductsByName(req: Request, res: Response) {
        const products = await productService.searchProductsByName(req.body);
        res.status(httpStatus.OK).send(products);
    }

    async searchProductsByCategory(req: Request, res: Response) {
        const products = await productService.findByCategory(req.body);
        res.status(httpStatus.OK).send(products);
    }

}

export default new productController();