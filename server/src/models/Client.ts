import { Document, Schema, SchemaTypes, model } from 'mongoose';

import { View, Services, Goal, Kpi } from '../types';

export type ClientDocument = Document & {
  name: string
  services: Services[]
  tier: number
  industry: string
  leads: string[]
  team: string[]
  gaAccount: string
  facebookAdsId?: string
  seoMonitorId?: string
  mainViewId?: string
  views: View[]
  goals: Goal[]
  kpis: Kpi[]
  pagespeedUrls: string[]
};

const schema = new Schema({
  name: { type: String, required: true, unique: true },
  services: { type: [String], default: [] },
  tier: { type: Number, required: true },
  leads: { type: [SchemaTypes.ObjectId], ref: 'User', default: [] },
  team: { type: [SchemaTypes.ObjectId], ref: 'User', default: [] },
  gaAccount: { type: String, required: true },
  industry: { type: String, required: true },
  facebookAdsId: String,
  seoMonitorId: String,
  views: [{
    id: String,
    name: String,
    accountId: String,
    webPropertyId: String,
    websiteUrl: String
  }],
  mainViewId: String,
  goals: [{
    id: String,
    viewId: String,
    name: String,
    url: String
  }],
  kpis: [{

  }],
  pagespeedUrls: { type: [String], default: [] }
});

export default model<ClientDocument>('Client', schema);