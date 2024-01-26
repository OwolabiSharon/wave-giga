import { PaginatedResults, paginate } from '../models/general/paginate.model';
import Product, { IProduct } from "../models/general/product.model";
import { Types } from "mongoose";
import { IReview } from "../models/users/reviews.model";
import ApiError from '../utils/ApiError';
import httpStatus from 'http-status';
import { query } from 'express';

interface SearchByNameResult {
    product: IProduct;
    relevance: number;
}

interface SearchResponse {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    results: SearchByNameResult[];
}

const create = async (productBody: any)=> {
    const product = await Product.create(productBody);
    return product;
};

const findAll = async (
    page: number,
    pageSize: number 
): Promise<PaginatedResults<IProduct>> => {
    return await paginate<IProduct>(Product, page, pageSize);
};

const findById = async (productId: Types.ObjectId): Promise<IProduct | null> => {
    return await Product.findById(productId);
};


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

const remove = async (productId: Types.ObjectId): Promise<IProduct | null> => {
    const product = await Product.findById(productId);
    if (!product) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
    }
    await product.remove();
    return product;
};

const searchProductsByName = async (
    query: string,
    page: number = 1,//default page is 1
    pageSize: number = 10//default page size is 10
): Promise<SearchResponse> => {
    try {
        // Use text index to perform a text search
        const results = await Product.searchByText(query);
        // Calculate relevance scores based on text score
        const searchResults: SearchByNameResult[] = results.map((product) => ({
            product,
            relevance: product.score || 0,
        }));
        // Sort the results by relevance in descending order
        searchResults.sort((a, b) => b.relevance - a.relevance);

        // Paginate the results
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedResults = searchResults.slice(startIndex, endIndex);

        // Create the response object
        const response: SearchResponse = {
            totalItems: searchResults.length,
            totalPages: Math.ceil(searchResults.length / pageSize),
            currentPage: page,
            pageSize: pageSize,
            results: paginatedResults,
        };

        return response;
    } catch (error) {
        console.error('Error during product search:', error);
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
    }
};

const findByCategory = async (
    productCategory: string,
    page: number = 1,//default page is 1
    pageSize: number = 10//default page size is 10 
    ): Promise<IProduct[]> => {
        try{
            //check if category exists
            if (!productCategory) {
                throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
            }
            const results = await Product.findByCategory(productCategory);
            // check if the results are empty
            if (results.length === 0) {
                throw new ApiError(httpStatus.NOT_FOUND, 'No products found');
            }
            //paginate results
            const startIndex = (page - 1) * pageSize;
            const endIndex = startIndex + pageSize;
            const paginatedResults = results.slice(startIndex, endIndex);
            return paginatedResults;
        } catch (error){
            console.error('Error during product search:', error);
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
        }
}

const filterByPrice = async (
    query: string,
    minPrice: number,
    maxPrice: number,
    page: number = 1,//default page is 1
    pageSize: number = 10//default page size is 10 
    ): Promise<IProduct[]> => {
        try{
            //get all products with the query
            const results = await Product.searchByText(query);
            //filter products by price
            const filteredResults = results.filter((product) => product.productPrice >= minPrice && product.productPrice <= maxPrice);
            // check if the results are empty
            if (filteredResults.length === 0) {
                throw new ApiError(httpStatus.NOT_FOUND, 'No products found');
            }
            //paginate results
            const startIndex = (page - 1) * pageSize;
            const endIndex = startIndex + pageSize;
            const paginatedResults = filteredResults.slice(startIndex, endIndex);
            return paginatedResults;
        } catch (error){
            console.error('Error during product search:', error);
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
        }
}

const filterByPriceAndCategory = async (
    query: string,
    minPrice: number,
    maxPrice: number,
    productCategory: string,
    page: number = 1,//default page is 1
    pageSize: number = 10//default page size is 10 
    ): Promise<IProduct[]> => {
        try{
            //get all products with the query
            const results = await Product.searchByText(query);
            //filter products by price
            const filteredResults = results.filter((product) => product.productPrice >= minPrice && product.productPrice <= maxPrice);
            //filter products by category
            const filteredResults2 = filteredResults.filter((product) => product.productCategory === productCategory);
            // check if the results are empty
            if (filteredResults2.length === 0) {
                throw new ApiError(httpStatus.NOT_FOUND, 'No products found');
            }
            //paginate results
            const startIndex = (page - 1) * pageSize;
            const endIndex = startIndex + pageSize;
            const paginatedResults = filteredResults2.slice(startIndex, endIndex);
            return paginatedResults;
        } catch (error){
            console.error('Error during product search:', error);
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
        }
}

const filterByPriceAndSubCategory = async (
    query: string,
    minPrice: number,
    maxPrice: number,
    productSubCategory: string,
    page: number = 1,//default page is 1
    pageSize: number = 10//default page size is 10 
    ): Promise<IProduct[]> => {
        try{
            //get all products with the query
            const results = await Product.searchByText(query);
            //filter products by price
            const filteredResults = results.filter((product) => product.productPrice >= minPrice && product.productPrice <= maxPrice);
            //filter products by category
            const filteredResults2 = filteredResults.filter((product) => product.productSubCategory === productSubCategory);
            // check if the results are empty
            if (filteredResults2.length === 0) {
                throw new ApiError(httpStatus.NOT_FOUND, 'No products found');
            }
            //paginate results
            const startIndex = (page - 1) * pageSize;
            const endIndex = startIndex + pageSize;
            const paginatedResults = filteredResults2.slice(startIndex, endIndex);
            return paginatedResults;
        } catch (error){
            console.error('Error during product search:', error);
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
        }
}

const filterByCategory = async (
    query: string,
    productCategory: string,
    page: number = 1,//default page is 1
    pageSize: number = 10//default page size is 10 
    ): Promise<IProduct[]> => {
        try{
            //get all products with the query
            const results = await Product.searchByText(query);
            //filter products by category
            const filteredResults = results.filter((product) => product.productCategory === productCategory);
            // check if the results are empty
            if (filteredResults.length === 0) {
                throw new ApiError(httpStatus.NOT_FOUND, 'No products found');
            }
            //paginate results
            const startIndex = (page - 1) * pageSize;
            const endIndex = startIndex + pageSize;
            const paginatedResults = filteredResults.slice(startIndex, endIndex);
            return paginatedResults;
        } catch (error){
            console.error('Error during product search:', error);
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
        }
}

const filterBySubCategory = async (
    query: string,
    productSubCategory: string,
    page: number = 1,//default page is 1
    pageSize: number = 10//default page size is 10 
    ): Promise<IProduct[]> => {
        try{
            //get all products with the query
            const results = await Product.searchByText(query);
            //filter products by category
            const filteredResults = results.filter((product) => product.productSubCategory === productSubCategory);
            // check if the results are empty
            if (filteredResults.length === 0) {
                throw new ApiError(httpStatus.NOT_FOUND, 'No products found');
            }
            //paginate results
            const startIndex = (page - 1) * pageSize;
            const endIndex = startIndex + pageSize;
            const paginatedResults = filteredResults.slice(startIndex, endIndex);
            return paginatedResults;
        } catch (error){
            console.error('Error during product search:', error);
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
        }
}

const filterByPriceAndSubCategoryAndCategory = async (
    query: string,
    minPrice: number,
    maxPrice: number,
    productSubCategory: string,
    productCategory: string,
    page: number = 1,//default page is 1
    pageSize: number = 10//default page size is 10 
    ): Promise<IProduct[]> => {
        try{
            //get all products with the query
            const results = await Product.searchByText(query);
            //filter products by price
            const filteredResults = results.filter((product) => product.productPrice >= minPrice && product.productPrice <= maxPrice);
            //filter products by category
            const filteredResults2 = filteredResults.filter((product) => product.productSubCategory === productSubCategory);
            //filter products by category
            const filteredResults3 = filteredResults2.filter((product) => product.productCategory === productCategory);
            // check if the results are empty
            if (filteredResults3.length === 0) {
                throw new ApiError(httpStatus.NOT_FOUND, 'No products found');
            }
            //paginate results
            const startIndex = (page - 1) * pageSize;
            const endIndex = startIndex + pageSize;
            const paginatedResults = filteredResults3.slice(startIndex, endIndex);
            return paginatedResults;
        } catch (error){
            console.error('Error during product search:', error);
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
        }
}






export default {
    create,
    findAll,
    searchProductsByName,
    update,
    remove,
    findByCategory,
    filterByPrice,
    filterByPriceAndCategory,
    filterByPriceAndSubCategory,
    filterByCategory,
    filterBySubCategory,
    filterByPriceAndSubCategoryAndCategory,
    findById
}