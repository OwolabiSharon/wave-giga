import mongoose, { Document, Schema } from 'mongoose';

interface IReview extends Document {
    userId: Schema.Types.ObjectId;
    hotelId: Schema.Types.ObjectId;
    rating: number;
    comment: string;
}

interface IReviewModel extends mongoose.Model<IReview> {
}

const ReviewSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    hotelId: { type: Schema.Types.ObjectId, ref: 'Hotel', required: true },
    rating: { type: Number, required: true , default: 0},
    comment: { type: String, required: true }
},{
    timestamps: true
});

//on save of a review, update the hotel rating
ReviewSchema.post('save', function (doc: IReview) {
    const Hotel = mongoose.model('Hotel');
    Hotel.findById(doc.hotelId, (err: any, hotel: {
        save(): unknown; starRating: number; 
}) => {
        if (err) {
            console.log(err);
        } else {
            Hotel.find({hotelId: doc.hotelId}, (err: any, reviews: { rating: number; }[]) => {
                if (err) {
                    console.log(err);
                } else {
                    let totalRating = 0;
                    reviews.forEach((review: { rating: number; }) => {
                        totalRating += review.rating;
                    });
                    hotel.starRating = totalRating / reviews.length;
                    hotel.save();
                }
            });
        }
    });
});

//on delete of a review, update the hotel rating
ReviewSchema.post('remove', function (doc: IReview) {
    const Hotel = mongoose.model('Hotel');
    Hotel.findById(doc.hotelId, (err: any, hotel: {
        save(): unknown; starRating: number; 
}) => {
        if (err) {
            console.log(err);
        } else {
            Hotel.find({hotelId: doc.hotelId}, (err: any, reviews: { rating: number; }[]) => {
                if (err) {
                    console.log(err);
                } else {
                    let totalRating = 0;
                    reviews.forEach((review: { rating: number; }) => {
                        totalRating += review.rating;
                    });
                    hotel.starRating = totalRating / reviews.length;
                    hotel.save();
                }
            });
        }
    });
});

const Review: IReviewModel = mongoose.model<IReview, IReviewModel>('Review', ReviewSchema);

export default Review;