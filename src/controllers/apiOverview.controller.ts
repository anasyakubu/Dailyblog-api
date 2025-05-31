import { Request, Response } from "express";

export const apiOverview = (req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    message: "Welcome to the Daily Pay API 🚀",
    documentation: "https://dailyinvoice.xyz/docs", // Change this to your docs URL
    available_routes: {
      authentication: "/api/auth",
      users: "/api/users",
      posts: "/api/posts",
      // Add more routes here
    },
    timestamp: new Date().toISOString(),
  });
};
