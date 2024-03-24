import express, { Application, Request, Response, NextFunction } from "express";

import { router } from "./routes/todo.routes";

const app: Application = express();

app.use("", router);

app.use("/", (req: Request, res: Response, next: NextFunction): void => {
    res.json({ message: "Allo! Catch-all route." });
});

export default app;