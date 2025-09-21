import express, { Application, Request, Response, NextFunction } from "express";
import httpStatus from "http-status";

const app: Application = express();

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", routes);

//Testing
app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.OK).json({
    success: true,
    message: "Welcome to Kickoff Node TS",
  });
});

export default app;