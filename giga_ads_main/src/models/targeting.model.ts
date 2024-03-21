import { Document, Schema, model } from 'mongoose';

// Define interface for Targeting document
interface Targeting extends Document {
  demographics: {
    ageRange: { min: number; max: number };
    gender: string;
    // Add more demographic fields as needed
  };
  interests: string[]; // Array of strings for interests

  // Add more targeting options as needed
}

// Define schema for Targeting

