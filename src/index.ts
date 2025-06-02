import cors from 'cors';
import express from "express";
import bodyParser from 'body-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from "cookie-parser";
import errorHandler from "./middleware/errorHandler";
import { graphqlHTTP } from "express-graphql";
import connection from "./config/database.js";
import postSchema from "./schema/post.schema.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 5000;

//*********** database connection ***********//
const connect = connection;

//console.log("Database", connect); // logout the connection

//********************** middleware **********************//
app.use(express.json());
app.use(helmet());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json({ type: 'application/json' })); // for parsing application/json
app.use(express.urlencoded({ extended: false }));


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
app.use(cors({ ...corsOptions, credentials: true }));

app.use(errorHandler); // for handling error

// GraphQL endpoint
app.use("/post", graphqlHTTP({ schema: postSchema, graphiql: true }));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});