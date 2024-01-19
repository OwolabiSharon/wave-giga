import { Document, Model, Types } from 'mongoose';

interface PaginatedResults<T extends Document> {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    results: T[];
}

/**
 * Paginate documents for a given mongoose model.
 * @param model The mongoose model for which pagination is applied.
 * @param page The current page number (default is 1).
 * @param pageSize The number of items per page (default is 10).
 * @returns Paginated results including total items, total pages, current page, page size, and document results.
 */
const paginate = async <T extends Document>(
    model: Model<T>,
    page: number = 1,
    pageSize: number = 10
): Promise<PaginatedResults<T>> => {
    try {
        // Count the total number of documents
        const totalItems = await model.countDocuments();

        // Calculate the total number of pages
        const totalPages = Math.ceil(totalItems / pageSize);

        // Find documents for the specified page and page size
        const results = await model.find()
            .skip((page - 1) * pageSize)
            .limit(pageSize);

        // Create the paginated results object
        const paginatedResults: PaginatedResults<T> = {
            totalItems,
            totalPages,
            currentPage: page,
            pageSize,
            results,
        };

        return paginatedResults;
    } catch (error) {
        console.error('Error during pagination:', error);
        throw new Error('Pagination failed');
    }
};


export { PaginatedResults, paginate };