import mongoose from 'mongoose';

export const validateMongoID = (id: string): boolean => {
  return mongoose.Types.ObjectId.isValid(id);
};
