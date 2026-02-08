/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ReminderService } from './reminder.service';

const createReminder = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as any;
  const result = await ReminderService.createReminderToDB(user, req.body);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Reminder created successfully',
    data: result,
  });
});

const getMyReminders = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as any;
  const result = await ReminderService.getMyRemindersFromDB(user);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Reminders retrieved successfully',
    data: result,
  });
});

const updateReminder = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as any;
  const { id } = req.params;
  const result = await ReminderService.updateReminderToDB(user, id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Reminder updated successfully',
    data: result,
  });
});

const deleteReminder = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as any;
  const { id } = req.params;
  await ReminderService.deleteReminderFromDB(user, id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Reminder deleted successfully',
  });
});

export const ReminderController = {
  createReminder,
  getMyReminders,
  updateReminder,
  deleteReminder,
  toggleReminder: catchAsync(async (req: Request, res: Response) => {
    const user = req.user as any;
    const { id } = req.params;
    const { enabled } = req.body;
    const result = await ReminderService.toggleReminderToDB(user, id, enabled);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: `Reminder ${enabled ? 'enabled' : 'disabled'} successfully`,
      data: result,
    });
  }),
};
