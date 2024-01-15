import { Document, Model, model, Schema,Types } from 'mongoose';

export interface ICategory extends Document {
    categoryName: string;
    categoryDescription: string;
    categoryImage: string;

    categorySubCategories: Types.ObjectId[];
    categoryProducts: Types.ObjectId[];
}

interface ICategoryModel extends Model<ICategory> {
    
}

const categorySchema = new Schema<ICategory>({
    categoryName: { type: String, required: true },
    categoryDescription: { type: String, required: true },
    categoryImage: { type: String, required: true },
    categorySubCategories: [{ type: Schema.Types.ObjectId, ref: 'SubCategory', required: true , default: []}],
    categoryProducts: [{ type: Schema.Types.ObjectId, ref: 'Product', required: true , default: []}],
    
},
{
    timestamps: true,
});

const Category = model<ICategory, ICategoryModel>('Category', categorySchema);

export default Category;

