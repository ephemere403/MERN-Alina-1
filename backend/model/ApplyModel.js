import mongoose from "mongoose";

const applySchema = new mongoose.Schema({
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Not authorized']
    },
    title: {
        type: String,
        required: [true, 'Title is not specified']
    },
    amount: {
        type: Number,
        required: [true, 'Amount is not specified']
    },
    date: {
        type: Date,
        required: [true, 'Date is not specified']
    },
    description: String,
    status: {
        type: String,
        enum: ['open', 'confirmed', 'revoked'],
        default: 'open'
    }
});


export const ApplyModel = mongoose.model('Apply', applySchema);
