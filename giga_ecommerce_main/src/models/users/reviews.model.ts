import { Document, Schema, model,Types} from 'mongoose';

export interface IReview extends Document {
    user: Types.ObjectId;
    productId: Types.ObjectId;
    review: string;
    rating: number;
}


const reviewSchema = new Schema<IReview>({
    user: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    productId:{ type: Schema.Types.ObjectId, ref: 'product', required: true },
    review: { type: String, required: true },
    rating: { type: Number, required: true ,default: 0, min: 0, max: 5},
},
{
    timestamps: true,
});

// Static method to calculate the average rating for a product
reviewSchema.statics.averageRating = async function (productId: Types.ObjectId) {
    const result = await this.aggregate([
        {
        $match: { productId },
        },
        {
        $group: {
            _id: null,
            averageRating: { $avg: '$rating' },
        },
        },
    ]);
    
    return result.length > 0 ? result[0].averageRating : 0;
    };

const Review = model<IReview>('Review', reviewSchema);
export default Review;
