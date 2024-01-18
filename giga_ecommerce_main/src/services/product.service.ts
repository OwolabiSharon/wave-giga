
import Product, { IProduct } from "../models/general/product.model";
import { Types } from "mongoose";
import { IReview } from "../models/users/reviews.model";
import ApiError from '../utils/ApiError';
import httpStatus from 'http-status';


const create = async (productBody: any)=> {
    const product = await Product.create(productBody);
    return product;
};

const findAll = async () => {
    const products = await Product.find();
    return products;
};

//find one by name
const findOne = async (productName: string): Promise<IProduct> => {
    throw new ApiError(httpStatus.NOT_IMPLEMENTED, 'Route not implemented');
}


const update = async (data: any) => {
    const { id, productName, productDisplayName, productDescription, productCategory, productSubCategory, productImages, productPrice, productAmountInStock, productFulfilmentTime } = data;
    const product = await Product.findOne({ _id: id });

    if (product) {
        product.productName = productName;
        product.productDisplayName = productDisplayName;
        product.productDescription = productDescription;
        product.productCategory = productCategory;
        product.productSubCategory = productSubCategory;
        product.productImages = productImages;
        product.productPrice = productPrice;
        product.productAmountInStock = productAmountInStock;
        product.productFulfilmentTime = productFulfilmentTime;
        await product.save();
    }

    return product;
};//comeback to this later

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