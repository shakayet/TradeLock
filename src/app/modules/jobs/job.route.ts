import express, { NextFunction, Request, Response } from 'express';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import validateRequest from '../../middlewares/validateRequest';
import { JobController } from './job.controller';
import { JobValidation } from './job.validation';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';

const router = express.Router();

router.post(
  '/',
  auth(USER_ROLES.USER),
  fileUploadHandler(),
  (req: Request, res: Response, next: NextFunction) => {
    if (req.body.data) {
      try {
        req.body = JSON.parse(req.body.data);
      } catch {
        // leave as-is
      }
    }
    next();
  },
  validateRequest(JobValidation.createJobZodSchema),
  JobController.createJob,
);

router.get(
  '/',
  validateRequest(JobValidation.getJobsQueryZodSchema),
  JobController.getJobs,
);

router.get('/:id', JobController.getSingleJob);

router.patch(
  '/:id',
  fileUploadHandler(),
  (req: Request, res: Response, next: NextFunction) => {
    if (req.body.data) {
      try {
        req.body = JSON.parse(req.body.data);
      } catch {
        // leave as-is
      }
    }
    next();
  },
  validateRequest(JobValidation.jobIdParamsZodSchema),
  validateRequest(JobValidation.updateJobZodSchema),
  JobController.updateJob,
);

router.delete(
  '/:id',
  auth(USER_ROLES.USER, USER_ROLES.ADMIN),
  validateRequest(JobValidation.jobIdParamsZodSchema),
  JobController.deleteJob,
);

export const JobsRoutes = router;
