import { Document, Schema, model } from 'mongoose';

export type UserDocument = Document & {
  firstName: string
  lastName: string
  email: string
  profilePicture?: string
  roles: string[]
  permissions: string[]
  isVerified: boolean
};

const schema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  profilePicture: String,
  roles: { type: [String], default: [] },
  permissions: { type: [String], default: [] },
  isVerified: { type: Boolean, default: false }
});

export default model<UserDocument>('User', schema);
