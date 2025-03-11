import prisma from '../models/messageModel';
import { Context } from 'hono';

export const sendMessage = async (c: Context) => {
  const { content, roomId } = await c.req.json();
  const message = await prisma.create({
    data: { content, roomId, userId: c.req.session.userId },
  });
  return c.json(message);
};

export const getMessages = async (c: Context) => {
  const roomId = c.req.param('roomId');
  const messages = await prisma.findMany({ where: { roomId: Number(roomId) } });
  return c.json(messages);
};
