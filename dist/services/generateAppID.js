"use strict";
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
const generateAppID = () => __awaiter(void 0, void 0, void 0, function* () {
    let unique = false;
    let appID = "";
    while (!unique) {
        const namePart = "App";
        const randomDigits = Math.floor(1000 + Math.random() * 9000);
        appID = `${namePart}-${randomDigits}`;
        // const existing = await App.findOne({ appID });
        // if (!existing) unique = true;
    }
    return appID;
});
exports.default = generateAppID;
