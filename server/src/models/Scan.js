import mongoose from 'mongoose';

const recommendationSchema = new mongoose.Schema({
  issue: { type: String, required: true },
  severity: { type: String, enum: ['HIGH', 'MEDIUM', 'LOW'], required: true },
  impact: { type: String, required: true },
  recommendation: { type: String, required: true },
  auditId: { type: String, required: true },
}, { _id: false });

const auditSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: String,
  score: Number,
  numericValue: Number,
  displayValue: String,
}, { _id: false });

const scanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  url: { type: String, required: true, trim: true, maxlength: 2048 },
  status: { type: String, enum: ['PENDING', 'RUNNING', 'COMPLETED', 'FAILED'], default: 'PENDING', index: true },
  performanceScore: Number,
  accessibilityScore: Number,
  bestPracticesScore: Number,
  seoScore: Number,
  pwaScore: Number,
  metrics: {
    fcp: Number,
    lcp: Number,
    cls: Number,
    tbt: Number,
    speedIndex: Number,
  },
  audits: [auditSchema],
  recommendations: [recommendationSchema],
  lighthouseVersion: String,
  device: { type: String, default: 'DESKTOP' },
  error: { type: String, maxlength: 500 },
}, { timestamps: true, versionKey: false });

scanSchema.index({ userId: 1, createdAt: -1 });

export const Scan = mongoose.model('Scan', scanSchema);

