import { Router, type IRouter } from "express";
import healthRouter from "./health";
import contactRouter from "./contact";
import hospitalRouter from "./hospital";

const router: IRouter = Router();

router.use(healthRouter);
router.use(contactRouter);
router.use(hospitalRouter);

export default router;
