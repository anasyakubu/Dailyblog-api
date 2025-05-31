import { Request, Response, NextFunction } from 'express';
import ApiKey from '../model/apiKey.model';
import dotenv from 'dotenv';
dotenv.config();

interface AuthenticatedRequest extends Request { apiUser?: string; apiKey?: string; }

const authenticateApiKey = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const apiKey = req.headers['x-api-key'] as string;

    if (!apiKey) {
      res.status(401).json({ message: 'API key missing' });
      return;
    }

    const keyRecord = await ApiKey.findOne({ key: apiKey, active: true, status: "active" });

    if (!keyRecord) {
      res.status(401).json({ message: 'Invalid API key' });
      return;
    }

    if (keyRecord.usageLimit > 0 && keyRecord.usageCount >= keyRecord.usageLimit) {
      res.status(429).json({ message: 'API key usage limit exceeded' });
      return;
    }

    // Fix: convert ObjectId to string
    req.apiUser = keyRecord.userID.toString();
    req.apiKey = apiKey;

    keyRecord.usageCount += 1;
    keyRecord.lastUsedAt = new Date();
    await keyRecord.save();

    next();
  } catch (error) {
    next(error);
  }
};

export default authenticateApiKey;