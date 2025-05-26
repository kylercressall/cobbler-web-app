import express, { Request, Response } from "express";

const app = express();

app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.send("API is running!");
});

app.listen(3001, () => {
  console.log("Backend listening on port 3001");
});
