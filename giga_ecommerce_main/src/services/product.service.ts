import { PaginatedResults, paginate } from '../models/general/paginate.model';
import Product, { IProduct } from "../models/general/product.model";
import { IReview } from "../models/users/reviews.model";
import { EventSender } from '../utils/eventSystem';
import { Types, Schema } from 'mongoose';
import ApiResponse from '../utils/ApiResponse';
import ApiError from '../utils/ApiError';
import httpStatus from 'http-status';
import { query } from 'express';

interface searchPayload {
    page: number;
    limit: number;
    product: IProduct;
    relevance: number;
    sort: string;
    category: string;
    subCategory: string;
    shop: string;
}

interface createProductPayload {
    vendor: Schema.Types.ObjectId;
    shop: Schema.Types.ObjectId;
    productName: string;
    productDisplayName: string;
    productDescription: string;
    productCategory: string;
    productSubCategory: string;
    productImages: string[];
    productPrice: number;
    productAmountInStock: number;
    productFulfilmentTime: number;
}

// interface SearchResponse {
//     page: number;
//     currentPage: number;
//     pageSize: number;
//     results: SearchByNameResult[];
// }

export class ProductService {
    private eventSender: EventSender;

    constructor(eventSender: EventSender) {
        this.eventSender = eventSender;
    }

    public async create(payload: createProductPayload): Promise<ApiResponse<any>> {
        try {
            const { vendor, shop, productName, productDisplayName, productDescription, productCategory, productSubCategory, productImages, productPrice, productAmountInStock, productFulfilmentTime } = payload;
            
            // Additional validation or business logic before creating the product
    
            const product = await Product.create({ vendor, shop, productName, productDisplayName, productDescription, productCategory, productSubCategory, productImages, productPrice, productAmountInStock, productFulfilmentTime });
            
            // Additional logic after creating the product, if needed
    
            return new ApiResponse(201, product.toObject()); // 201 Created status
        } catch (error:any) {
            console.error('Error creating product:', error.message);
    
            if (error instanceof ApiError) {
                // Handle specific ApiError instances
                return new ApiResponse(error.statusCode, { error: error.message });
            } else if (error.name === 'ValidationError') {
                // Handle validation errors (e.g., required fields missing)
                return new ApiResponse(400, { error: 'Validation error', details: error.errors });
            } else {
                // Handle other errors
                return new ApiResponse(500, { error: 'Internal server error' });
            }
        }
    }
}

export default new ProductService(new EventSender());




// const create = async (productBody: any)=> {
//     const product = await Product.create(productBody);
//     return product;
// };

// const findAll = async (
//     page: number,
//     pageSize: number 
// ): Promise<PaginatedResults<IProduct>> => {
//     return await paginate<IProduct>(Product, page, pageSize);
// };

// const findById = async (productId: Types.ObjectId): Promise<IProduct | null> => {
//     return await Product.findById(productId);
// };


// const update = async (data: any) => {
//     const { id, productName, productDisplayName, productDescription, productCategory, productSubCategory, productImages, productPrice, productAmountInStock, productFulfilmentTime } = data;
//     const product = await Product.findOne({ _id: id });

//     if (product) {
//         product.productName = productName;
//         product.productDisplayName = productDisplayName;
//         product.productDescription = productDescription;
//         product.productCategory = productCategory;
//         product.productSubCategory = productSubCategory;
//         product.productImages = productImages;
//         product.productPrice = productPrice;
//         product.productAmountInStock = productAmountInStock;
//         product.productFulfilmentTime = productFulfilmentTime;
//         await product.save();
//     }

//     return product;
// };//comeback to this later

// const remove = async (productId: Types.ObjectId): Promise<IProduct | null> => {
//     const product = await Product.findById(productId);
//     if (!product) {
//         throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
//     }
//     await product.remove();
//     return product;
// };

// const searchProductsByName = async (
//     query: string,
//     page: number = 1,//default page is 1
//     pageSize: number = 10//default page size is 10
// ): Promise<SearchResponse> => {
//     try {
//         // Use text index to perform a text search
//         const results = await Product.searchByText(query);
//         // Calculate relevance scores based on text score
//         const searchResults: SearchByNameResult[] = results.map((product) => ({
//             product,
//             relevance: product.score || 0,
//         }));
//         // Sort the results by relevance in descending order
//         searchResults.sort((a, b) => b.relevance - a.relevance);

//         // Paginate the results
//         const startIndex = (page - 1) * pageSize;
//         const endIndex = startIndex + pageSize;
//         const paginatedResults = searchResults.slice(startIndex, endIndex);

//         // Create the response object
//         const response: SearchResponse = {
//             totalItems: searchResults.length,
//             totalPages: Math.ceil(searchResults.length / pageSize),
//             currentPage: page,
//             pageSize: pageSize,
//             results: paginatedResults,
//         };

//         return response;
//     } catch (error) {
//         console.error('Error during product search:', error);
//         throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
//     }
// };

// const findByCategory = async (
//     productCategory: string,
//     page: number = 1,//default page is 1
//     pageSize: number = 10//default page size is 10 
//     ): Promise<IProduct[]> => {
//         try{
//             //check if category exists
//             if (!productCategory) {
//                 throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
//             }
//             const results = await Product.findByCategory(productCategory);
//             // check if the results are empty
//             if (results.length === 0) {
//                 throw new ApiError(httpStatus.NOT_FOUND, 'No products found');
//             }
//             //paginate results
//             const startIndex = (page - 1) * pageSize;
//             const endIndex = startIndex + pageSize;
//             const paginatedResults = results.slice(startIndex, endIndex);
//             return paginatedResults;
//         } catch (error){
//             console.error('Error during product search:', error);
//             throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
//         }
// }

// const filterByPrice = async (
//     query: string,
//     minPrice: number,
//     maxPrice: number,
//     page: number = 1,//default page is 1
//     pageSize: number = 10//default page size is 10 
//     ): Promise<IProduct[]> => {
//         try{
//             //get all products with the query
//             const results = await Product.searchByText(query);
//             //filter products by price
//             const filteredResults = results.filter((product) => product.productPrice >= minPrice && product.productPrice <= maxPrice);
//             // check if the results are empty
//             if (filteredResults.length === 0) {
//                 throw new ApiError(httpStatus.NOT_FOUND, 'No products found');
//             }
//             //paginate results
//             const startIndex = (page - 1) * pageSize;
//             const endIndex = startIndex + pageSize;
//             const paginatedResults = filteredResults.slice(startIndex, endIndex);
//             return paginatedResults;
//         } catch (error){
//             console.error('Error during product search:', error);
//             throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
//         }
// }

// const filterByPriceAndCategory = async (
//     query: string,
//     minPrice: number,
//     maxPrice: number,
//     productCategory: string,
//     page: number = 1,//default page is 1
//     pageSize: number = 10//default page size is 10 
//     ): Promise<IProduct[]> => {
//         try{
//             //get all products with the query
//             const results = await Product.searchByText(query);
//             //filter products by price
//             const filteredResults = results.filter((product) => product.productPrice >= minPrice && product.productPrice <= maxPrice);
//             //filter products by category
//             const filteredResults2 = filteredResults.filter((product) => product.productCategory === productCategory);
//             // check if the results are empty
//             if (filteredResults2.length === 0) {
//                 throw new ApiError(httpStatus.NOT_FOUND, 'No products found');
//             }
//             //paginate results
//             const startIndex = (page - 1) * pageSize;
//             const endIndex = startIndex + pageSize;
//             const paginatedResults = filteredResults2.slice(startIndex, endIndex);
//             return paginatedResults;
//         } catch (error){
//             console.error('Error during product search:', error);
//             throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
//         }
// }

// const filterByPriceAndSubCategory = async (
//     query: string,
//     minPrice: number,
//     maxPrice: number,
//     productSubCategory: string,
//     page: number = 1,//default page is 1
//     pageSize: number = 10//default page size is 10 
//     ): Promise<IProduct[]> => {
//         try{
//             //get all products with the query
//             const results = await Product.searchByText(query);
//             //filter products by price
//             const filteredResults = results.filter((product) => product.productPrice >= minPrice && product.productPrice <= maxPrice);
//             //filter products by category
//             const filteredResults2 = filteredResults.filter((product) => product.productSubCategory === productSubCategory);
//             // check if the results are empty
//             if (filteredResults2.length === 0) {
//                 throw new ApiError(httpStatus.NOT_FOUND, 'No products found');
//             }
//             //paginate results
//             const startIndex = (page - 1) * pageSize;
//             const endIndex = startIndex + pageSize;
//             const paginatedResults = filteredResults2.slice(startIndex, endIndex);
//             return paginatedResults;
//         } catch (error){
//             console.error('Error during product search:', error);
//             throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
//         }
// }

// const filterByCategory = async (
//     query: string,
//     productCategory: string,
//     page: number = 1,//default page is 1
//     pageSize: number = 10//default page size is 10 
//     ): Promise<IProduct[]> => {
//         try{
//             //get all products with the query
//             const results = await Product.searchByText(query);
//             //filter products by category
//             const filteredResults = results.filter((product) => product.productCategory === productCategory);
//             // check if the results are empty
//             if (filteredResults.length === 0) {
//                 throw new ApiError(httpStatus.NOT_FOUND, 'No products found');
//             }
//             //paginate results
//             const startIndex = (page - 1) * pageSize;
//             const endIndex = startIndex + pageSize;
//             const paginatedResults = filteredResults.slice(startIndex, endIndex);
//             return paginatedResults;
//         } catch (error){
//             console.error('Error during product search:', error);
//             throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
//         }
// }

// const filterBySubCategory = async (
//     query: string,
//     productSubCategory: string,
//     page: number = 1,//default page is 1
//     pageSize: number = 10//default page size is 10 
//     ): Promise<IProduct[]> => {
//         try{
//             //get all products with the query
//             const results = await Product.searchByText(query);
//             //filter products by category
//             const filteredResults = results.filter((product) => product.productSubCategory === productSubCategory);
//             // check if the results are empty
//             if (filteredResults.length === 0) {
//                 throw new ApiError(httpStatus.NOT_FOUND, 'No products found');
//             }
//             //paginate results
//             const startIndex = (page - 1) * pageSize;
//             const endIndex = startIndex + pageSize;
//             const paginatedResults = filteredResults.slice(startIndex, endIndex);
//             return paginatedResults;
//         } catch (error){
//             console.error('Error during product search:', error);
//             throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
//         }
// }

// const filterByPriceAndSubCategoryAndCategory = async (
//     query: string,
//     minPrice: number,
//     maxPrice: number,
//     productSubCategory: string,
//     productCategory: string,
//     page: number = 1,//default page is 1
//     pageSize: number = 10//default page size is 10 
//     ): Promise<IProduct[]> => {
//         try{
//             //get all products with the query
//             const results = await Product.searchByText(query);
//             //filter products by price
//             const filteredResults = results.filter((product) => product.productPrice >= minPrice && product.productPrice <= maxPrice);
//             //filter products by category
//             const filteredResults2 = filteredResults.filter((product) => product.productSubCategory === productSubCategory);
//             //filter products by category
//             const filteredResults3 = filteredResults2.filter((product) => product.productCategory === productCategory);
//             // check if the results are empty
//             if (filteredResults3.length === 0) {
//                 throw new ApiError(httpStatus.NOT_FOUND, 'No products found');
//             }
//             //paginate results
//             const startIndex = (page - 1) * pageSize;
//             const endIndex = startIndex + pageSize;
//             const paginatedResults = filteredResults3.slice(startIndex, endIndex);
//             return paginatedResults;
//         } catch (error){
//             console.error('Error during product search:', error);
//             throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
//         }
// }






// export default {
//     create,
//     findAll,
//     searchProductsByName,
//     update,
//     remove,
//     findByCategory,
//     filterByPrice,
//     filterByPriceAndCategory,
//     filterByPriceAndSubCategory,
//     filterByCategory,
//     filterBySubCategory,
//     filterByPriceAndSubCategoryAndCategory,
//     findById
// }