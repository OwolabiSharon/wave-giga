import { Document, Schema, model } from 'mongoose';

// Define interface for Ad document
interface Ad extends Document {
    title: string;
    category: string;
    description: string;
    imageUrl: string;
    redirectUrl: string;
  // Add more fields as needed
    adInformation: Schema.Types.ObjectId;
}

// Define schema for Ad
const AdSchema = new Schema<Ad>({
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    redirectUrl: { type: String, required: true },
    adInformation: { type: Schema.Types.ObjectId, ref: 'AdInformation' }
  // Add more fields as needed
});

// Create and export the Ad model
export default model<Ad>('Ad', AdSchema);
