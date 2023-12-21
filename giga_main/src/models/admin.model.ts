import mongoose, { Document, Model, Schema } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';



/* This is defining an interface for the User model in the Mongoose schema. It extends the Document
interface provided by Mongoose and adds additional properties and methods specific to the User
model. These properties include name, userName, email, password, createdAt, and updatedAt. The
methods include isPasswordMatch, isEmailTaken, and isUserNameTaken, which are used to check if a
given password, email, or username is already taken in the database. */
interface IAdmin extends Document {
  userName: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  isPasswordMatch(password: string): Promise<boolean>;
  isEmailTaken(email: string, excludeUserId?: string): Promise<boolean>;
  isUserNameTaken(userName: string, excludeUserId?: string): Promise<boolean>;
}

/* This interface is extending the Mongoose Model interface for the User model and adding two static
methods: `isEmailTaken` and `isUserNameTaken`. These methods are used to check if a given email or
username is already taken in the database, and they take an optional `excludeUserId` parameter to
exclude a specific user from the search. The methods return a Promise that resolves to a boolean
value indicating whether the email or username is taken or not. */
interface IAdminModel extends Model<IAdmin> {
  isEmailTaken(email: string, excludeUserId?: string): Promise<boolean>;
  isUserNameTaken(userName: string, excludeUserId?: string): Promise<boolean>;
}

const adminSchema = new mongoose.Schema<IAdmin>(
  {
    userName: {
      type: String, 
      required: true,
      default: "Admin",
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (value: string) => validator.isEmail(value),
        message: 'Invalid email',
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
    },
  },
  
  {
    timestamps: true,
  }
);

adminSchema.statics.isEmailTaken = async function (email: string, excludeUserId: string): Promise<boolean> {
  email = email.toLowerCase();
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

adminSchema.statics.isUserNameTaken = async function (userName: string, excludeUserId): Promise<boolean> {
  userName = userName.toLowerCase();
  const user = await this.findOne({ userName, _id: { $ne: excludeUserId } });
  return !!user;
};

adminSchema.methods.isPasswordMatch = async function (password: string): Promise<boolean> {
  const user = this as IAdmin;
  return bcrypt.compare(password, user.password);
};

adminSchema.pre('save', async function (next) {
  const user = this as IAdmin;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const User: IAdminModel = mongoose.model<IAdmin, IAdminModel>('Admin', adminSchema);
export default User;