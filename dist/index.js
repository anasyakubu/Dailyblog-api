"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_graphql_1 = require("express-graphql");
const mongoose_1 = __importDefault(require("mongoose"));
const post_schema_js_1 = __importDefault(require("./schema/post.schema.js"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = 5000;
// MongoDB connection
mongoose_1.default.connect(process.env.MONGO_URI || "your-mongo-uri", {})
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error(err));
// GraphQL endpoint
app.use("/graphql", (0, express_graphql_1.graphqlHTTP)({
    schema: post_schema_js_1.default, // Use 'schema' property
    graphiql: true
}));
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/graphql`);
});
