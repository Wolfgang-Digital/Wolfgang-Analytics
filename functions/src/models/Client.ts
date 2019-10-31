import { Document, Schema, model } from 'mongoose';

export type ClientDocument = Document & {
  pagespeedUrls: string[]
};

const schema = new Schema({
  pagespeedUrls: { type: [String], default: [] }
});

export default model<ClientDocument>('Client', schema);