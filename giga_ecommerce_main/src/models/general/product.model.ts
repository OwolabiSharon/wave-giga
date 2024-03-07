import { Document, Model, model, Schema,Types } from 'mongoose';
import Review, { IReview } from '../users/reviews.model'; 

export interface IProduct extends Document {
    vendor: Types.ObjectId;
    shop: Types.ObjectId;
    productName: string;
    productDisplayName: string;//might not be needed
    productDescription: string;
    productCategory: string;
    productSubCategory: string;
    productImages: string[];
    productPrice: number;
    productAmountInStock: number;
    productRating: number;
    productFulfilmentTime: number;
    productReviews: Types.ObjectId[];

}

interface IProductModel extends Model<IProduct> {
    averageRating(productId: Types.ObjectId): Promise<number>;
    searchByText(query: string): Promise<IProduct[]>;
}

const productSchema = new Schema<IProduct>({
    vendor: { type: Schema.Types.ObjectId, ref: 'vendor', required: true },
    shop: { type: Schema.Types.ObjectId, ref: 'Shop', required: true },
    productName: { type: String, required: true },
    productDisplayName: { type: String, required: true },
    productDescription: { type: String, required: true },
    productCategory: { type: String, required: true },
    productSubCategory: { type: String, required: true },
    productImages: [{ type: String, required: true }],
    productPrice: { type: Number, required: true },
    productAmountInStock: { type: Number, required: true },
    //create section for product rating and set default to 0
    productRating: { type: Number, required: true, default: 0 },
    productFulfilmentTime: { type: Number, required: true},
    productReviews: [{ type: Schema.Types.ObjectId, ref: 'Review', required: true , default: []}],
    
},
{
    timestamps: true,
});

productSchema.statics.averageRating = async function (productId: Types.ObjectId): Promise<number> {
    const reviews = await Review.find({ productId });
    if (reviews.length === 0) return 0;
    
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / reviews.length;
};

// Text index on productName and productDescription
productSchema.index({ productName: 'text', productDescription: 'text' });

productSchema.statics.searchByText = async function (query: string): Promise<IProduct[]> {
    const results = await this.find(
        { $text: { $search: query } },
        { score: { $meta: 'textScore' } }
    )
        .sort({ score: { $meta: 'textScore' } })
        .exec();

    return results;
};

productSchema.pre('save', async function (next) {
    const product = this as IProduct;
    if (product.isModified('productReviews')) {
        const avgRating = await Product.averageRating(product._id);
        product.productRating = avgRating;
    }
    next();
});

const Product: IProductModel = model<IProduct, IProductModel>('Product', productSchema);

export default Product;

