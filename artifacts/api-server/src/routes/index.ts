import { Router, type IRouter } from "express";
import healthRouter from "./health";
import processRouter from "./process";
import snapshotsRouter from "./snapshots";

const router: IRouter = Router();

router.use(healthRouter);
router.use(processRouter);
router.use(snapshotsRouter);

export default router;
