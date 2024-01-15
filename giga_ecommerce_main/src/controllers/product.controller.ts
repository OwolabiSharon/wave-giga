import { Request, Response } from 'express';
import httpStatus from 'http-status';
import productService from 'src/services/product.service';

class productController {
    async create(req: Request, res: Response) {
        const product = await productService.create(req.body);
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