import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    balance: {
        type: mongoose.Schema.Types.Mixed,
        default: 0,
        set: v => new mongoose.mongo.Double(v),
        get: v => v ? v.valueOf() : 0
    }
}, { toJSON: { getters: true }, toObject: { getters: true } });

export default mongoose.model('User', UserSchema);
