"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
//*********** database connection ***********//
const connection = mongoose_1.default.connect(process.env.MONGODB_URL || "", { dbName: "daily-blog-db", })
    .then(() => console.log("Database Connected ✅✅"))
    .catch((err) => console.log("Database not connected ❌❌", err));
exports.default = connection; // export it to use in other files
