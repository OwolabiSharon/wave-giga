import mongoose, { Document, Model, Schema } from 'mongoose';
import { randomString } from '../utils/util';
import validator from 'validator';

interface IToken extends Document {
    userId?: mongoose.Types.ObjectId;
    token: string;
    createdAt: Date;
    expiresAt: Date;
    isExpired: boolean;
}

interface ITokenModel extends Model<IToken> {
    generate(userId: mongoose.Types.ObjectId): Promise<IToken>;
    verify(token: string): Promise<IToken | null>;
}

const tokenSchema = new Schema<IToken>(
    {
        userId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User',
        },
        token: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        },
        expiresAt: {
        type: Date,
        required: true,
        },
    },
    {
        timestamps: true,
    }
);

tokenSchema.statics.generate = async function (userId: mongoose.Types.ObjectId): Promise<IToken> {
    const token = randomString(16);
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);
    const newToken = new Token({
        userId,
        token,
        expiresAt,
    });
    await newToken.save();
    return newToken;
};

tokenSchema.statics.verify = async function (token: string): Promise<IToken | null> {
    const foundToken = await Token.findOne({ token });
    if (foundToken && !foundToken.isExpired) {
        return foundToken;
    }
    return null;
};

const Token: ITokenModel = mongoose.model<IToken, ITokenModel>('Token', tokenSchema);

export default Token;
