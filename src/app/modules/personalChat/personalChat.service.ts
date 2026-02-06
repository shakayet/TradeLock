import { Types } from 'mongoose';
import { Conversation } from './conversation.model';
import { Message } from './personalChat.model';
import { IMessage } from './personalChat.interface';

const createConversation = async (participants: string[]) => {
  // Check if conversation already exists
  let conversation = await Conversation.findOne({
    participants: { $all: participants },
  });

  if (!conversation) {
    conversation = await Conversation.create({ participants });
  }

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
  const result = await Message.create(payload);
  
  // Update last message in conversation
  await Conversation.findByIdAndUpdate(payload.conversationId, {
    lastMessage: result._id,
  });

  return result.populate('sender', 'name image');
};

const getMessagesFromDB = async (
  conversationId: string,
  page: number = 1,
  limit: number = 10
) => {
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
  const result = await Message.updateMany(
    { conversationId, sender: { $ne: new Types.ObjectId(userId) }, isRead: false },
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
