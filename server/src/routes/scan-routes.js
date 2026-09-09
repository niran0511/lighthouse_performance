import { Router } from 'express';
import { createScanController } from '../controllers/scan-controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { asyncHandler } from '../utils/async-handler.js';

export function createScanRouter(dependencies) {
  const controller = createScanController(dependencies);
  const router = Router();
  router.use(authenticate);
  router.post('/', asyncHandler(controller.create));
  router.get('/', asyncHandler(controller.list));
  router.get('/:id', asyncHandler(controller.getById));
  router.post('/:id/retry', asyncHandler(controller.retry));
  router.delete('/:id', asyncHandler(controller.remove));
  return router;
}

