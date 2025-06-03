import express from "express";
import cors from "cors";
import contactsRoutes from "./routes/contacts.routes";
import userRoutes from "./routes/user.routes";
// import usersRoutes from "./routes/users.routes";
// import interactionsRoutes from "./routes/interactions.routes";
// import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

app.get("/", (_req, res) => {
  res.status(200).send("hello from root");
});

app.use("/api/contacts", contactsRoutes);
app.use("/api/user", userRoutes);
// app.use("/api/users", usersRoutes);
// app.use("/api/interactions", interactionsRoutes);

// app.use(errorHandler);

export default app;
