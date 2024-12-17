import { Router, Request, Response, NextFunction } from "express";
import {
    handleGetAllEntretiens,
    handlePostEntretien,
    handleDeleteEntretien,
    handlePutEntretien,
    handlegetEntretienById,
    handleGetEntretienWithFilters
} from "../managers/EntretienManager";

const router = Router();

// GET /entretiens/filters : Récupérer des entretiens avec un filtre
router.get("/filters", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const entretiens = await handleGetEntretienWithFilters(req, next);
        res.json(entretiens);
    } catch (error) {
        next(error);
    }
});

// GET /entretiens : Récupérer tous les entretiens
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const entretiens = await handleGetAllEntretiens(req, next);
        
        res.status(200).json(entretiens);
    } catch (error) {
        next(error);
    }
});

// POST /entretiens : Ajouter un nouvel entretien
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const entretiens = await handlePostEntretien(req, next);
        res.status(201).json(entretiens);
    } catch (error) {
        next(error);
    }
});

// GET /entretiens/:id : Récupérer un entretien avec son id
router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id
        const entretiens = await handlegetEntretienById(id, next);
        if (!entretiens || entretiens.length === 0) {
            return res.status(404).json({ message: "Entretien non trouvé" });
        }
        res.json(entretiens);
    } catch (error) {
        next(error);
    }
});

// DELETE /entretiens/:id : Supprimer un entretien
router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const entretiens = await handleDeleteEntretien(req, next);
        res.status(200).json(entretiens);
    } catch (error) {
        next(error);
    }
});

// PUT /entretiens/:id : Mettre à jour un entretien
router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const entretiens = await handlePutEntretien(req, next);
        if (entretiens) {
            return res.status(200).json({message : "Entretien modifié.",entretiens}); 
        }
    } catch (error) {
        return next(error);
    }
});


export default router;
