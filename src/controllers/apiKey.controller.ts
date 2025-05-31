import { Request, Response } from "express";
import ApiKey from "../model/apiKey.model";
import generateApiKey from "../services/generateApiKey";


const listApiKey = async (req: Request, res: Response): Promise<void> => {
  try {
    const userID = req.user?._id;

    const apiKeys = await ApiKey.find({ userID })

    if (!apiKeys || apiKeys.length === 0) {
      res.status(404).json({ status: false, msg: "No api key found", data: apiKeys })
    }

    res.status(200).json({ status: true, msg: "API Keys fetch sucessful", data: apiKeys })

  } catch (error) {
    console.error("ERROR ", error);
    res.status(500).json({ status: false, msg: "Internal Server Error", error });
  }
}

const createApiKey = async (req: Request, res: Response): Promise<void> => {
  try {

    const userID = req.user?._id;

    // console.log("userID", userID); // for debugging

    const { name, description, appID } = req.body;

    // Check for missing fields
    const fieldsToCheck = { name, description, appID };
    const missingField = Object.entries(fieldsToCheck).find(([_, value]) => !value)?.[0];

    if (missingField) {
      res.status(400).json({ status: false, msg: `${missingField} is required` });
    }

    // Check if app already exists
    const exist = await ApiKey.findOne({ name: name, userID });

    if (exist) {
      res.status(400).json({ status: false, msg: "API Key already added" });
    }

    //generate the api key

    const generatedKey = await generateApiKey();

    const apiKeyPayload = { key: generatedKey, name, description, appID, userID };

    const apiKey = await ApiKey.create(apiKeyPayload);

    res.status(201).json({ status: true, msg: "API Key generated", data: apiKey });

  } catch (error) {
    console.error("ERROR ", error);
    res.status(500).json({ status: false, msg: "Internal Server Error", error });
  }
}

const deactiveKey = async (req: Request, res: Response): Promise<void> => {
  try {
    const userID = req.user?.userID;

    const { keyID, appID } = req.query;

    // Check for missing fields
    const fieldsToCheck = { keyID, appID };
    const missingField = Object.entries(fieldsToCheck).find(([_, value]) => !value)?.[0];

    if (missingField) {
      res.status(400).json({ status: false, msg: `${missingField} is required` });
    }

    // check if key is active

    const activeKey = await ApiKey.findById(keyID);

    if (activeKey?.active !== true || activeKey.status !== "active") {
      res.status(404).json({ status: false, msg: "Key is not active" });
    }

    const updateKey = await ApiKey.updateOne(
      { _id: keyID },
      { $set: { active: false, status: "deactivated" } }
    );

    res.status(201).json({ status: true, msg: "Key Deactivated successful", data: updateKey });


  } catch (error) {
    console.error("ERROR ", error);
    res.status(500).json({ status: false, msg: "Internal Server Error", error });
  }
}


export { listApiKey, createApiKey, deactiveKey }