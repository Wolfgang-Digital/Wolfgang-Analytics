import { Document, Schema, model } from 'mongoose';

export type AccountDocument = Document & {
  email: string
  accessToken?: string
  refreshToken?: string
};

const schema = new Schema({
  email: { type: String, required: true, unique: true },
  accessToken: String,
  refreshToken: String
});

export default model<AccountDocument>('Account', schema);
