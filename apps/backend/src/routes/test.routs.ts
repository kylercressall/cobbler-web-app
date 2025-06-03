import express, { Request, Response, NextFunction } from "express";

const app = express();

async function middleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  res.status(200).json({ message: "works" });
}

app.get("/", middleware);

app.listen(3000, () => {
  console.log("Server running");
});
