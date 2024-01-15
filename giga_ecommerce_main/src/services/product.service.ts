// import Rabbit from '../rabbitMq/setup';
import Product from "src/models/general/product.model";
import { Types } from "mongoose";
import { IProduct } from "src/models/general/product.model";
import { IReview } from "src/models/users/reviews.model";
import ApiError from '../utils/ApiError';
import httpStatus from 'http-status';
// const rabbit = new Rabbit();

const create = async (productBody: IProduct): Promise<IProduct> => {
    const product = await Product.create(productBody);
    // rabbit.send('product.create', product);
    return product;
}

const findAll = async (): Promise<IProduct[]> => {
    return Product.find();
}

//find one by name
const findOne = async (productName: string): Promise<IProduct> => {
    throw new ApiError(httpStatus.NOT_IMPLEMENTED, 'Route not implemented');
}

const update = async (productBody: IProduct): Promise<IProduct> => {
    const product = await Product.findById(productBody.productId);
    if (!product) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
    }
    Object.assign(product, productBody);
    await product.save();
    return product;
}

const remove = async (productId: Types.ObjectId): Promise<IProduct> => {
    const product = await Product.findById(productId);
    if (!product) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
    }
    await product.remove();
    return product;
}



export default {
    create,
    findAll,
    findOne,
    update,
    remove,
}