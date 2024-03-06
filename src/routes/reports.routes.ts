import { Router } from "express";
import { auth } from "../middleware/auth";
import { getCategoryWiseReportDaywise, getCategoryWiseReportMonth, getCategoryWiseReportRangedate, getCategoryWiseReportYear } from "../controllers/reports.controller";

const ReportRouter= Router();

// passing auth middleware to protect the route
ReportRouter.use(auth);

ReportRouter.post("/day/",getCategoryWiseReportDaywise);

ReportRouter.post("/month/",getCategoryWiseReportMonth);

ReportRouter.post("/year/",getCategoryWiseReportYear);

ReportRouter.post("/rangedate/",getCategoryWiseReportRangedate);


export { ReportRouter};