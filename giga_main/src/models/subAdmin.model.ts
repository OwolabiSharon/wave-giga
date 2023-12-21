import mongoose, { Document, Model, Schema } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import {} from "../utils/util"

interface ISubAdmin extends Document {
    userName: string;
    firstName: string;
    lastName: string;
    otherNames: string;
    email: string;
    active: boolean;
    workEmail: string;
    phoneNumber: string;
    password: string;
    changeKey: string;
    dualAuth: boolean;
    authSecretKey: string;
    createdBy?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
    isPasswordMatch(password: string): Promise<boolean>;
    isEmailTaken(email: string, excludeUserId?: string): Promise<boolean>;
    isUserNameTaken(userName: string, excludeUserId?: string): Promise<boolean>;
    isChangeKeyMatch(changeKey: string): Promise<boolean>;
    isChangeKeyTaken(changeKey: string, excludeUserId?: string): Promise<boolean>;
    twoFactorAuth(): Promise<boolean>;
}

interface ISubAdminModel extends Model<ISubAdmin> {
    isEmailTaken(email: string, excludeUserId?: string): Promise<boolean>;
    isUserNameTaken(userName: string, excludeUserId?: string): Promise<boolean>;
    isChangeKeyTaken(changeKey: string, excludeUserId?: string): Promise<boolean>;
    
}

const subAdminSchema = new Schema<ISubAdmin>(
    {
        userName: {
        type: String,
        required: true,
        default: "SubAdmin",
        trim: true,
        lowercase: true,
        },
        email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: {
            validator: (value: string) => validator.isEmail(value),
            message: 'Invalid email',
        },
        verified: {
            // type: Boolean,
        },
        },
        firstName: {
        type: String,
        required: true,
        trim: true,
        },
        lastName: {
        type: String,
        required: true,
        trim: true,
        },
        otherNames: {
        type: String,
        trim: true,
        },
        active: {
        type: Boolean,
        required: true,
        default: true,
        },
        phoneNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        },
        workEmail: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        },
        password: {
        type: String,
        required: true,
        trim: true,
        minlength: 8,
        },
        changeKey: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        },
        dualAuth: {
        type: Boolean,
        required: true,
        default: false,
        },
        authSecretKey: {
        type: String,
        trim: true,
        },
        createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'Admin',
        },
    },
    {
        timestamps: true,
    }
);

subAdminSchema.statics.isEmailTaken = async function (
    email: string,
    excludeUserId?: string
): Promise<boolean> {
    const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
    return !!user;
};

subAdminSchema.statics.isUserNameTaken = async function (
    userName: string,
    excludeUserId: string
): Promise<boolean> {
    const user = await this.findOne({ userName, _id: { $ne: excludeUserId } });
    return !!user;
};

subAdminSchema.statics.isChangeKeyTaken = async function (
    changeKey: string,
    excludeUserId: string
): Promise<boolean> {
    const user = await this.findOne({ changeKey, _id: { $ne: excludeUserId } });
    return !!user;
};

subAdminSchema.methods.isPasswordMatch = async function (
    password: string
): Promise<boolean> {
    const user = this as ISubAdmin;
    return bcrypt.compare(password, user.password);
};

subAdminSchema.methods.isChangeKeyMatch = async function (
    changeKey: string
): Promise<boolean> {
    const user = this as ISubAdmin;
    return bcrypt.compare(changeKey, user.changeKey);
};



//check if dualAuth is true
/* The `subAdminSchema.methods.twoFactorAuth` function is a method defined on the `subAdminSchema`
schema. It is used to check if the `dualAuth` property of a sub-admin document is set to `true` or
`false`. */
subAdminSchema.methods.twoFactorAuth = async function (): Promise<boolean> {
    const user = this as ISubAdmin;
    return user.dualAuth;
};

subAdminSchema.pre<ISubAdmin>("save", async function (next) {
    const user = this as ISubAdmin;
    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    if (user.isModified("changeKey")) {
        user.changeKey = await bcrypt.hash(user.changeKey, 8);
    }
    next();
});

const User: ISubAdminModel = mongoose.model<ISubAdmin, ISubAdminModel>(
    "subAdmin",
    subAdminSchema
);

export default User;
