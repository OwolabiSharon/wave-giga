import mongoose, { Document, Model, Schema, Types } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';



/* This is defining an interface for the User model in the Mongoose schema. It extends the Document
interface provided by Mongoose and adds additional properties and methods specific to the User
model. These properties include name, userName, email, password, createdAt, and updatedAt. The
methods include isPasswordMatch, isEmailTaken, and isUserNameTaken, which are used to check if a
given password, email, or username is already taken in the database. */
interface IUser extends Document {
  profilePicture: string;// this will be a url using cloudinary
  firstName: string;
  lastName: string;
  otherNames: string;
  userName: string;
  email: string;
  address: string;// might make this an object 
  zipCode: number;
  gender: string;
  country: string;
  //uneeded but its on the figma design
  bodyWeight: number;
  areaOfInterest: string;
  ageGroup: string;
  [key: string]: any;

  //check if this is the right type
  password: string;
  creditCard?: mongoose.Types.ObjectId;
  phoneNumber: Number;
  ratings: number[];
  averageRating: number;
  emailVerificationToken: String;
  emailVerificationExpires: Date;
  isEmailVerified: Boolean;
  taxiProfile?: mongoose.Types.ObjectId;
  taxiProfileType: String;
  createdAt: Date;
  updatedAt: Date;
  isPasswordMatch(password: string): Promise<boolean>;
  isEmailTaken(email: string, excludeUserId?: string): Promise<boolean>;
  isUserNameTaken(userName: string, excludeUserId?: string): Promise<boolean>;
  isPasswordMatch(password: string): Promise<boolean>;
  updatePassword(password: string): Promise<void>;
  updateProfile(updateBody: any): Promise<IUser>;
}

/* This interface is extending the Mongoose Model interface for the User model and adding two static
methods: `isEmailTaken` and `isUserNameTaken`. These methods are used to check if a given email or
username is already taken in the database, and they take an optional `excludeUserId` parameter to
exclude a specific user from the search. The methods return a Promise that resolves to a boolean
value indicating whether the email or username is taken or not. */
interface IUserModel extends Model<IUser> {
  isEmailTaken(email: string, excludeUserId?: string): Promise<boolean>;
  isUserNameTaken(userName: string, excludeUserId?: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    otherNames: {
      type: String,
    },
    userName: {
      type: String, 
      required: true,
      unique: true,
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
    address: {
      type: String,
      required: true,
    },
    zipCode: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
    },
    emailVerificationToken: {
      type: String,
    },
    emailVerificationExpires: {
      type: Date,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    phoneNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    ratings: [{ type: Number, default: [] }],
    averageRating: { type: Number, default: 0 },
    creditCard: {
      type: String,
      ref: 'CreditCard',
    },
    taxiProfile: {
      type: Schema.Types.ObjectId,
      ref: 'taxiProfileType',
      default: null // This will determine the model to reference dynamically
    },
    taxiProfileType: {
      type: String,
      required: true,
      enum: ['TaxiDriver', 'TaxiCustomer'],
      default: 'TaxiCustomer'
    }
    //we will add other fields for like other services like social_media_friends or followers and what not
  },
  
  {
    timestamps: true,
  }
);

userSchema.statics.isEmailTaken = async function (email: string, excludeUserId: string): Promise<boolean> {
  email = email.toLowerCase();
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

userSchema.statics.isUserNameTaken = async function (userName: string, excludeUserId): Promise<boolean> {
  userName = userName.toLowerCase();
  const user = await this.findOne({ userName, _id: { $ne: excludeUserId } });
  return !!user;
};

userSchema.methods.isPasswordMatch = async function (password: string): Promise<boolean> {
  const user = this as IUser;
  return bcrypt.compare(password, user.password);
}; 

userSchema.methods.updatePassword = async function (password: string): Promise<void> {
  const user = this as IUser;
  user.password = password;
  await user.save();
};


//still needs to be tested
userSchema.methods.updateProfile = async function (updateBody: any): Promise<IUser> {
  const user = this as IUser;

  // Check if the updateBody object contains any properties that are not allowed to be updated.
  const disallowedProperties = ['_id', 'createdAt', 'updatedAt'];
  for (const property of disallowedProperties) {
    if (property in updateBody) {
      throw new Error(`The property ${property} cannot be updated.`);
    }
  }

  // Update the user object with the properties from the updateBody object.
  Object.keys(updateBody).forEach((key) => {
    user[key] = updateBody[key];
  });

  // Save the user object.
  await user.save();

  // Return the updated user object.
  return user;
};


userSchema.pre('save', async function (next) {
  const user = this as IUser;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  if (user.isModified('ratings')) {
    // Calculate the average rating based on the list of ratings
    const totalRatings = user.ratings.length;
    if (totalRatings > 0) {
      const sumOfRatings = user.ratings.reduce((acc, rating) => acc + rating, 0);
      user.averageRating = sumOfRatings / totalRatings;
    } else {
      user.averageRating = 0;
    }
  }
  next();
});

const User: IUserModel = mongoose.model<IUser, IUserModel>('User', userSchema);
export default User;