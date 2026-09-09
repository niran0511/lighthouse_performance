import { Scan } from '../models/Scan.js';
import { AppError } from '../utils/app-error.js';
import { parsePublicHttpUrl, validatePublicTarget } from '../utils/url-safety.js';
import { executeLighthouse } from './lighthouse-service.js';
import { generateRecommendations } from './recommendation-service.js';

export class ScanService {
  constructor({ scanModel = Scan, validateTarget = validatePublicTarget, lighthouseRunner = executeLighthouse } = {}) {
    this.scanModel = scanModel;
    this.validateTarget = validateTarget;
    this.lighthouseRunner = lighthouseRunner;
  }

  async create(userId, url) {
    const normalizedUrl = parsePublicHttpUrl(url).toString();
    return this.scanModel.create({ userId, url: normalizedUrl, status: 'PENDING', device: 'DESKTOP' });
  }

  schedule(scanId) {
    setImmediate(() => this.run(scanId).catch(() => undefined));
  }

  async run(scanId) {
    const scan = await this.scanModel.findByIdAndUpdate(scanId, { status: 'RUNNING', error: null }, { new: true });
    if (!scan) return;

    try {
      const safeUrl = await this.validateTarget(scan.url);
      const report = await this.lighthouseRunner(safeUrl);
      const recommendations = generateRecommendations(report.rawAudits);
      await this.scanModel.findByIdAndUpdate(scanId, {
        status: 'COMPLETED',
        url: safeUrl,
        performanceScore: report.performanceScore,
        accessibilityScore: report.accessibilityScore,
        bestPracticesScore: report.bestPracticesScore,
        seoScore: report.seoScore,
        pwaScore: report.pwaScore,
        metrics: report.metrics,
        audits: report.audits,
        recommendations,
        lighthouseVersion: report.lighthouseVersion,
      });
    } catch (error) {
      const safeError = error instanceof AppError ? error.message : 'Unable to analyze the provided URL.';
      await this.scanModel.findByIdAndUpdate(scanId, { status: 'FAILED', error: safeError });
    }
  }
}

