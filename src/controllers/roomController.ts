import prisma from '../models/roomModel';
import { Context } from 'hono';

export const createRoom = async (c: Context) => {
  const { name } = await c.req.json();
  const room = await prisma.create({
    data: { name, createdBy: c.req.session.userId },
  });
  return c.json(room);
};

export const deleteRoom = async (c: Context) => {
  const id = c.req.param('id');
  await prisma.delete({ where: { id: Number(id) } });
  return c.json({ message: 'Room deleted' });
};
