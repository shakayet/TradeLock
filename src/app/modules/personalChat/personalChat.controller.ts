import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { PersonalChatService } from './personalChat.service';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import fs from 'fs';
import { getMultipleFilesPath, getSingleFilePath } from '../../../shared/getFilePath';
import { deleteFromS3 } from '../../../helpers/s3Helper';

const removeFiles = (files: any) => {
  if (files) {
    Object.values(files).flat().forEach((file: any) => {
      if (file.location) {
        deleteFromS3(file.location);
      } else if (file.path && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    });
  }
};

const createOrGetConversation = catchAsync(async (req: Request, res: Response) => {
  const { participantId } = req.body;
  const userId = (req.user as any).id;

  if (!participantId) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Participant ID is required');
  }

  const result = await PersonalChatService.createConversation([userId, participantId]);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Conversation retrieved successfully',
    data: result,
  });
});

const getMyConversations = catchAsync(async (req: Request, res: Response) => {
  const userId = (req.user as any).id;
  const result = await PersonalChatService.getMyConversationsFromDB(userId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Conversations retrieved successfully',
    data: result,
  });
});

const sendMessage = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const { text, conversationId } = req.body;
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  if (!conversationId) {
    removeFiles(files);
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Conversation ID is required');
  }

  const images = files?.['image'] || [];
  const docs = files?.['doc'] || [];

  if (docs.length > 1) {
    removeFiles(files);
    throw new ApiError(StatusCodes.BAD_REQUEST, 'You can only upload 1 PDF file');
  }

  if (images.length > 3) {
    removeFiles(files);
    throw new ApiError(StatusCodes.BAD_REQUEST, 'You can only upload up to 3 images');
  }

  const totalImageSize = images.reduce((sum, img) => sum + img.size, 0);
  const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
  if (totalImageSize > MAX_IMAGE_SIZE) {
    removeFiles(files);
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Total image size must not exceed 10 MB');
  }

  const imagePaths = getMultipleFilesPath(files, 'image') || [];
  const pdfPath = getSingleFilePath(files, 'doc');

  const payload = {
    conversationId,
    sender: (user as any).id,
    text,
    images: imagePaths,
    pdf: pdfPath,
    isRead: false,
  };

  const result = await PersonalChatService.saveMessageToDB(payload);

  // Socket emit
  // @ts-ignore
  if (global.io) {
    // @ts-ignore
    global.io.to(conversationId).emit('new-messages', result);
  }

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Message sent successfully',
    data: result,
  });
});

const getMessages = catchAsync(async (req: Request, res: Response) => {
    const { conversationId } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await PersonalChatService.getMessagesFromDB(conversationId, page, limit);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Messages retrieved successfully',
        data: result,
    });
});

const markAsRead = catchAsync(async (req: Request, res: Response) => {
    const { conversationId } = req.params;
    const userId = (req.user as any).id;

    const result = await PersonalChatService.markAsReadFromDB(conversationId, userId);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Messages marked as read',
        data: result,
    });
});

export const PersonalChatController = {
  createOrGetConversation,
  getMyConversations,
  sendMessage,
  getMessages,
  markAsRead,
};
