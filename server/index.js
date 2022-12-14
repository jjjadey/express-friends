import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";

import { fileURLToPath } from "url";
import { register } from "./controllers/auth.js";
import authRoutes from "./routes/auth.js"

// configurations
const fileName = fileURLToPath(import.meta.url);
const dirName = path.dirname(fileName);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(dirName, 'public/assets')));

// file storege
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "public/assets");
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});

const upload = multer({ storage });

// routes with files
app.post("/auth/register", upload.single("picture"), register);

// routes
app.use("/auth", authRoutes);

// mongoose setup
const port = process.env.PORT || 6001
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    app.listen(port, () => console.log(`>>>Server port: ${port}`));
}).catch((error) => console.log(`>>>${error} did not connected`));