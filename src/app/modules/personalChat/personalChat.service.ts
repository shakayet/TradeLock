import { Types } from 'mongoose';
import { Conversation } from './conversation.model';
import { Message } from './personalChat.model';
import { IMessage } from './personalChat.interface';
import ApiError from '../../../errors/ApiError';
import { StatusCodes } from 'http-status-codes';

const createConversation = async (participants: string[]) => {
  const objectIds = participants.map(id => new Types.ObjectId(id));
  const sorted = objectIds.map(id => id.toString()).sort();
  const participantKey = sorted.join(':');

  const conversation = await Conversation.findOneAndUpdate(
    { participantKey },
    {
      $setOnInsert: {
        participants: objectIds,
        participantKey,
      },
    },
    { new: true, upsert: true }
  );

  return conversation;
};

const getMyConversationsFromDB = async (userId: string) => {
  const result = await Conversation.find({
    participants: { $in: [new Types.ObjectId(userId)] },
  })
    .populate('participants', 'name image')
    .populate({
        path: 'lastMessage',
        populate: {
            path: 'sender',
            select: 'name image'
        }
    })
    .sort({ updatedAt: -1 });

  return result;
};

const saveMessageToDB = async (payload: IMessage) => {
  const userObjectId = new Types.ObjectId(payload.sender as any);
  const convo = await Conversation.findOne({
    _id: payload.conversationId,
    participants: { $in: [userObjectId] },
  });

  if (!convo) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'You are not a participant of this conversation');
  }

  const result = await Message.create(payload);
  
  // Update last message in conversation
  await Conversation.findByIdAndUpdate(payload.conversationId, {
    lastMessage: result._id,
    updatedAt: new Date(),
  });

  return result.populate('sender', 'name image');
};

const getMessagesFromDB = async (
  conversationId: string,
  page: number = 1,
  limit: number = 10,
  userId?: string
) => {
  if (userId) {
    const userObjectId = new Types.ObjectId(userId);
    const convo = await Conversation.findOne({
      _id: new Types.ObjectId(conversationId),
      participants: { $in: [userObjectId] },
    });
    if (!convo) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'You are not a participant of this conversation');
    }
  }
  const skip = (page - 1) * limit;
  const result = await Message.find({ conversationId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('sender', 'name image');

  const total = await Message.countDocuments({ conversationId });

  return {
    messages: result,
    total,
  };
};

const markAsReadFromDB = async (conversationId: string, userId: string) => {
  const userObjectId = new Types.ObjectId(userId);
  const convo = await Conversation.findOne({
    _id: new Types.ObjectId(conversationId),
    participants: { $in: [userObjectId] },
  });
  if (!convo) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'You are not a participant of this conversation');
  }
  const result = await Message.updateMany(
    { conversationId, sender: { $ne: userObjectId }, isRead: false },
    { $set: { isRead: true } }
  );
  return result;
};

export const PersonalChatService = {
  createConversation,
  getMyConversationsFromDB,
  saveMessageToDB,
  getMessagesFromDB,
  markAsReadFromDB,
};
