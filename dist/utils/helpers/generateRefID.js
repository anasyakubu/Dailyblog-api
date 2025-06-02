"use strict";
// import User from "../../models/user.model";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const generateRefID = (name) => __awaiter(void 0, void 0, void 0, function* () {
    let unique = false;
    let refID = "";
    while (!unique) {
        const namePart = name.toLowerCase().replace(/\s+/g, '').slice(0, 5);
        const randomDigits = Math.floor(1000 + Math.random() * 9000);
        refID = `${namePart}${randomDigits}`;
        // const existing = await User.findOne({ refID });
        // if (!existing) unique = true;
    }
    return refID;
});
exports.default = generateRefID;
