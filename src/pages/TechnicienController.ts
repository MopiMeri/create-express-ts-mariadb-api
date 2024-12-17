import { Router, Request, Response, NextFunction } from "express";
import {
    handleDeleteTechnicien,
    handlePostTechnicien,
    handlePutTechnicien,
    handlegetTechnicienById,
    handleGetTechnicienWithFilters,
    handleGetAllTechniciens
} from "../managers/TechnicienManager";

const router = Router();

// GET /techniciens : Récupérer tous les technicien
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const techniciens = await handleGetAllTechniciens(req, next);
        res.status(200).json(techniciens);
    } catch (error) {
        next(error);
    }
});

// GET /techniciens/filters : Récupérer des techniciens avec un filtre
router.get("/filters", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const techniciens = await handleGetTechnicienWithFilters(req, next);
        res.json(techniciens);
    } catch (error) {
        next(error);
    }
});

// POST /techniciens : Ajouter un nouveau technicien
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const techniciens = await handlePostTechnicien(req, next);
        res.status(201).json(techniciens);
    } catch (error) {
        next(error);
    }
});

// GET /techniciens/:id : Récupérer un technicien avec son id
router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id
        const techniciens = await handlegetTechnicienById(id, next);
        if (!techniciens || techniciens.length === 0) {
            return res.status(404).json({ message: "Technicien non trouvé" });
        }
        res.json(techniciens);
    } catch (error) {
        next(error);
    }
});

// DELETE /techniciens/:id : Supprimer un technicien
router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const techniciens = await handleDeleteTechnicien(req, next);
        res.status(200).json(techniciens);
    } catch (error) {
        next(error);
    }
});

// PUT /techniciens/:id : Mettre à jour un technicien
router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const techniciens = await handlePutTechnicien(req, next);
        res.status(200).json(techniciens);
    } catch (error) {
        next(error);
    }
});
export default router;
