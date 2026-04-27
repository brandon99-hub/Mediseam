import { Router, type IRouter } from "express";
import healthRouter from "./health";
import contactRouter from "./contact";
import hospitalRouter from "./hospital";
import paystackRouter from "./paystack";
import userRouter from "./user";

const router: IRouter = Router();

router.use(healthRouter);
router.use(contactRouter);
router.use(hospitalRouter);
router.use(paystackRouter);
router.use(userRouter);

export default router;
