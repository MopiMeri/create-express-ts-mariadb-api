//********** Imports externes **********//
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

//********** Imports internes **********//
import * as middlewares from "./middlewares";
import AvionController from "./pages/AvionController";
import TechnicienController from "./pages/TechnicienController";
import EntretienController from "./pages/EntretienController";

//********** Configuration **********//
dotenv.config();

//********** Server **********//
const allowedOrigins = ["http://localhost:3000", "http://127.0.0.1:3000"];

const options: cors.CorsOptions = {
  origin: allowedOrigins,
};

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // 

// Routes
app.use("/avions", AvionController);
app.use("/techniciens", TechnicienController);
app.use("/entretiens", EntretienController);

// Route par défaut pour la racine "/"
app.use("/", (req, res) => {
  res.json({ message: "Bienvenue sur l'API de gestion des aéronefs" });
});

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
