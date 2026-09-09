import mongoose from 'mongoose';
import { ScanService } from '../services/scan-service.js';
import { Scan } from '../models/Scan.js';
import { AppError } from '../utils/app-error.js';

export function createScanController({ scanService = new ScanService(), scanModel = Scan } = {}) {
  const getOwnedScan = async (id, userId) => {
    if (!mongoose.isValidObjectId(id)) throw new AppError('The requested scan identifier is invalid.', 400, 'INVALID_ID');
    const scan = await scanModel.findOne({ _id: id, userId });
    if (!scan) throw new AppError('Scan not found.', 404, 'SCAN_NOT_FOUND');
    return scan;
  };

  return {
    create: async (req, res) => {
      const scan = await scanService.create(req.user._id, req.body?.url);
      scanService.schedule(scan._id);
      res.status(202).json({ success: true, message: 'Scan queued successfully.', scan });
    },
    list: async (req, res) => {
      const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
      const scans = await scanModel.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(limit);
      res.json({ success: true, scans });
    },
    getById: async (req, res) => {
      const scan = await getOwnedScan(req.params.id, req.user._id);
      res.json({ success: true, scan });
    },
    retry: async (req, res) => {
      const scan = await getOwnedScan(req.params.id, req.user._id);
      if (scan.status === 'RUNNING' || scan.status === 'PENDING') throw new AppError('This scan is already in progress.', 409, 'SCAN_IN_PROGRESS');
      scan.status = 'PENDING';
      scan.error = undefined;
      await scan.save();
      scanService.schedule(scan._id);
      res.status(202).json({ success: true, message: 'Scan retry queued successfully.', scan });
    },
    remove: async (req, res) => {
      const scan = await getOwnedScan(req.params.id, req.user._id);
      await scan.deleteOne();
      res.status(204).send();
    },
  };
}

