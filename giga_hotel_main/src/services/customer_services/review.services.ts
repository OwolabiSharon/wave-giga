import ReviewModel from '../../models/review.model';
import httpStatus from 'http-status';
import ApiError from '../../utils/ApiError';

interface CreateReviewInput {
    userId: string; // ID of the user leaving the review
    hotelId: string; // ID of the hotel being reviewed
    rating: number; // Rating given by the user (0-5)
    comment: string; // Review comment
}

interface UpdateReviewInput {
    rating?: number; // New rating (optional)
    comment?: string; // New comment (optional)
}

// Create a new review for a hotel
const createReview = async (input: CreateReviewInput) => {
    try {
        const review = await ReviewModel.create(input);
        return review;
    } catch (error) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create review');
    }
};

const getHotelReviews = async (data: any) => {
    try {
        const reviews = await ReviewModel.find({ hotelId: data.hotelId });
        return reviews;
    } catch (error) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to retrieve hotel reviews');
    }
};

// Update a review
const updateReview = async (reviewId: string, input: UpdateReviewInput) => {
    try {
        const review = await ReviewModel.findByIdAndUpdate(reviewId, input, { new: true });
        if (!review) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Review not found');
        }
        return review;
    } catch (error) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to update review');
    }
};

// Delete a review
const deleteReview = async (reviewId: string) => {
    try {
        const review = await ReviewModel.findByIdAndDelete(reviewId);
        if (!review) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Review not found');
        }
        return { message: 'Review deleted successfully' };
    } catch (error) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to delete review');
    }
};

export default {
    createReview,
    getHotelReviews,
    updateReview,
    deleteReview
};