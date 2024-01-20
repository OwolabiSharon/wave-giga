import { Document, Model, model, Schema,Types } from 'mongoose';

export interface ICategory extends Document {
    categoryName: string;
    categoryDescription: string;
    categoryImage: string;
    categorySubCategories: Types.ObjectId[];
    categoryProducts: Types.ObjectId[];
}

interface ICategoryModel extends Model<ICategory> {
    isCategoryTaken(categoryName: string): boolean;
    doesCategoryExist(categoryName: string): boolean;
    isSubCategoryInCategory(categoryName: string, subCategoryName: string): boolean;
    getCategoryObjectId(categoryName: string): Types.ObjectId;
}

const categorySchema = new Schema<ICategory>({
    categoryName: { type: String, required: true },
    categoryDescription: { type: String, required: true },
    categoryImage: { type: String, required: true },
    categorySubCategories: [{ type: Schema.Types.ObjectId, ref: 'SubCategory', default: []}],
    categoryProducts: [{ type: Schema.Types.ObjectId, ref: 'Product', default: []}],
    
},
{
    timestamps: true,
});

categorySchema.statics.isCategoryTaken = async function (categoryName: string) {
    const category = await this.findOne({ categoryName });
    return !!category;
};

categorySchema.statics.doesCategoryExist = async function (categoryName: string) {
    const category = await this.findOne({ categoryName });
    return !!category;
}

categorySchema.statics.isSubCategoryInCategory = async function (categoryId: any, subCategoryId: any) {
    const category = await this.findOne({ _id: categoryId, categorySubCategories: subCategoryId });
    return !!category;
}

categorySchema.statics.getCategoryObjectId = async function (categoryName: string) {
    const category = await this.findOne({ categoryName });
    return category._id;
}

const Category = model<ICategory, ICategoryModel>('Category', categorySchema);

export default Category;

