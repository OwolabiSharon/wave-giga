import { Document, Schema, model } from 'mongoose';

interface AdInformation extends Document {
    accountReached: number;
    accountEngaged: number;
    accountConverted: number;
    clickThroughRate: number;
}

const AdInformationSchema = new Schema<AdInformation>({
    accountReached: { type: Number, required: true , default: 0},
    accountEngaged: { type: Number, required: true , default: 0},
    accountConverted: { type: Number, required: true , default: 0},
    clickThroughRate: { type: Number, required: true ,  default: 0}
});


