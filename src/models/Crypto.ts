import mongoose, { Schema, Document } from 'mongoose';
import { ICrypto } from '../types/Crypto';

const cryptoSchema: Schema = new Schema({
  id: { type: String, unique: true },
  symbol: { type: String },
  name: { type: String },
  image: { type: Object },
  market_data: { type: [Object], default: [] },
  last_updated: { type: Date, required: true }
});

export const Crypto = mongoose.model<ICrypto>('Crypto', cryptoSchema);
 