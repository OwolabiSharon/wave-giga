import { Document, Model, model, Schema,Types } from 'mongoose';
// call user ID into the user using rabbit

interface IShop extends Document {
    user: Types.ObjectId;
    shopName: string;//
    normalizedName: string;
    earnings: number;
    KYC: boolean;
    email: string;
    KYCData: Types.ObjectId;
    phoneNumber: string;
    location: { type: 'Point'; coordinates: [number, number] };
    availability: boolean;
    rating: number;
    numberOfSales: number;
    customerSatisfaction: number;
    products: Types.ObjectId[];
    vendorType: string;
    reportCount: number;
    currentOrder: Schema.Types.ObjectId | null;
    doesUserHaveShop(user: string): Promise<boolean>;//checks if user already has a shop 
}

interface IShopModel extends Model<IShop> {
    isShopNameTaken(shopName:string): Promise<boolean>;

}

const shopSchema = new Schema<IShop>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    shopName: { type: String, required: true },
    earnings: { type: Number, default: 0 },
    normalizedName: { type: String, required: true},
    phoneNumber: { type: String, required: true },
    location: {
        type: 'Point',
        coordinates: { type: [Number], required: true },
    },
    email: { type: String,required : true },
    availability: { type: Boolean, default: true },
    KYC: { type: Boolean, default: false },
    KYCData: { type: Schema.Types.ObjectId, ref: 'KYC', default: null },
    rating: { type: Number, default: 0 },
    vendorType: {type: String, enum: ['Grocery', 'Food', 'Pharmacy', 'Other'], required: true},//get back to this (time stamp 20:06, 19/09/2023)
    numberOfSales: { type: Number, default: 0 },
    customerSatisfaction: { type: Number, default: 0 },
    currentOrder: { type: Schema.Types.ObjectId, ref: 'Order', default: null },
    reportCount: { type: Number, default: 0 },
    products: [{ type: Schema.Types.ObjectId, ref: 'Product', default: [] }],

},
{
    timestamps: true,
});

shopSchema.index({ location: '2dsphere' });



shopSchema.statics.isShopNameTaken = async function (normalizedName:string): Promise<boolean> {

    const shop = await this.findOne({ normalizedName });
    return !!shop;
};



const Shop: IShopModel = model<IShop, IShopModel>('Shop', shopSchema);
export default Shop;

