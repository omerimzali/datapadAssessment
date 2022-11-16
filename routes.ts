import { Router } from "./deps.ts";
import { getMetrics } from "./controllers/metrics.ts";
const router = new Router();

router
  .get("/metrics", getMetrics)

export default router;