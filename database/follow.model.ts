import { Schema, model, models, Document } from 'mongoose';

export interface IFollow extends Document {
    follower: Schema.Types.ObjectId;
    following: Schema.Types.ObjectId;
    createdAt: Date;
}

const FollowSchema = new Schema({
    follower: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    following: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
});


const Follow = models.Follow || model('Follow', FollowSchema);

export default Follow;
