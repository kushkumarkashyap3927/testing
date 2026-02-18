import express from "express";
import cors from "cors";
import apiError from "./utils/apiError.js";
import userRouter from "./routes/user.route.js";


const app = express();



app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
);

// Handle invalid JSON error
app.use(express.json({
    verify: (req, res, buf, encoding) => {
        try {
            JSON.parse(buf);
        } catch (e) {
            throw new SyntaxError('Invalid JSON');
        }
    }
}));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));



app.get("/", (req, res) => {
    res.send("Hello World!");
});





app.use("/api/v1/user", userRouter);

// 404 handler
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: "Not Found",
    });
});

// Global error handler (must be last)
app.use((err, req, res, next) => {
    console.error(err);
    if (err instanceof apiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err.errors,
        });
    }
    if (err instanceof SyntaxError && err.message.includes('Invalid JSON')) {
        return res.status(400).json({
            success: false,
            message: "Invalid JSON payload",
        });
    }
    res.status(500).json({
        success: false,
        message: "Internal Server Error",
    });
});

// Routes will be like:
// POST /api/v1/user/signup
// POST /api/v1/user/login
// GET /api/v1/user/profile
// POST /api/v1/user/logout
// DELETE /api/v1/user/delete



export default app;