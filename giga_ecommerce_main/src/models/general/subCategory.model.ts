import { Document, Model, model, Schema,Types } from 'mongoose';

export interface ISubCategory extends Document {
    subCategoryName: string;
    subCategoryDescription: string;
    subCategoryImage: string;
    subCategoryProducts: Types.ObjectId[];
}

interface ISubCategoryModel extends Model<ISubCategory> {
    
}

const subCategorySchema = new Schema<ISubCategory>({
    subCategoryName: { type: String, required: true },
    subCategoryDescription: { type: String, required: true },
    subCategoryImage: { type: String, required: true },
    subCategoryProducts: [{ type: Schema.Types.ObjectId, ref: 'Product', default: []}],
    
},
{
    timestamps: true,
});

const SubCategory: ISubCategoryModel = model<ISubCategory, ISubCategoryModel>('SubCategory', subCategorySchema);

export default SubCategory;