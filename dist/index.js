"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const errorHandler_1 = __importDefault(require("./middleware/errorHandler"));
const express_graphql_1 = require("express-graphql");
const database_js_1 = __importDefault(require("./config/database.js"));
const post_schema_js_1 = __importDefault(require("./schema/post.schema.js"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = 5000;
//*********** database connection ***********//
const connect = database_js_1.default;
//console.log("Database", connect); // logout the connection
//********************** middleware **********************//
app.use(express_1.default.json());
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use((0, cookie_parser_1.default)());
app.use(body_parser_1.default.json({ type: 'application/json' })); // for parsing application/json
app.use(express_1.default.urlencoded({ extended: false }));
//*********** Create corsOptions object with your desired configuration ***********//
const corsOptions = {
    origin: [
        "https://daily-invoice.vercel.app", "http://localhost:3000", "http://localhost:5173",
        "https://daily-invoice.netlify.app", "https://dailyinvoice.com.ng", "https://api-daily-invoice.vercel.app",
        "https://api.dailyinvoice.com.ng", "https://app.dailyinvoice.com.ng", "https://waitlist.dailyinvoice.com.ng",
        "https://main.d7ivew8f5nc7s.amplifyapp.com", "https://dailyinvoice.xyz", "https://api.dailyinvoice.xyz",
        "https://app.dailyinvoice.xyz", "https://waitlist.dailyinvoice.xyz",
    ],
    methods: "GET,POST,DELETE,PUT", // Set the allowed HTTP methods
    optionsSuccessStatus: 200, // Set the status code for successful preflight requests
};
//*********** Pass corsOptions to the CORS middleware ***********//
app.use((0, cors_1.default)(Object.assign(Object.assign({}, corsOptions), { credentials: true })));
app.use(errorHandler_1.default); // for handling error
// GraphQL endpoint
app.use("/post", (0, express_graphql_1.graphqlHTTP)({ schema: post_schema_js_1.default, graphiql: true }));
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
