import express from "express";
import cors from "cors";


const app = express();


app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
);

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));


app.get("/", (req, res) => {
    res.send("Hello World!");
});




// app.use("/api/v1/users", userRouter);

// Routes will be like:
// http://localhost:3000/api/v1/users/register




export default app;