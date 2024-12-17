import { Router, Request, Response, NextFunction } from "express";
import { 
    handleGetAllAvions, 
    handlegetAvionById, 
    handleGetAvionsWithFilters, 
    handlePostAvion, 
    handleDeleteAvion, 
    handlePutAvion 
} from "../managers/AvionManager";

const router = Router();

// GET /avions/filters : Récupérer des avions avec un filtre
router.get("/filters", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const avions = await handleGetAvionsWithFilters(req, next);
        res.status(200).json(avions);
    } catch (error) {
        next(error);
    }
});

// GET /avions : Récupérer tous les avions
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const avions = await handleGetAllAvions(req, next);
        res.status(200).json(avions);
    } catch (error) {
        next(error);
    }
});

// GET /avions/:immat : Récupérer un avion avec son immatriculation
router.get("/:immat", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const immat = req.params.immat;
        const avion = await handlegetAvionById(immat, next);
        if (!avion || avion.length === 0) {
            return res.status(404).json({ message: "Avion non trouvé" });
        }
        res.status(200).json(avion);
    } catch (error) {
        next(error);
    }
});

// POST /avions : Ajouter un nouvel avion
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const avion = await handlePostAvion(req, next);
        res.status(201).json({ message: "Avion ajouté avec succès" });
    } catch (error) {
        next(error);
    }
});

// DELETE /avions/:immatriculation : Supprimer un avion
router.delete("/:immatriculation", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await handleDeleteAvion(req, next);
        res.status(200).json({ message: "Avion supprimé avec succès", result });
    } catch (error) {
        next(error);
    }
});

// PUT /avions/:immatriculation : Mettre à jour un avion
router.put("/:immatriculation", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await handlePutAvion(req, next);
        res.status(200).json({ message: "Avion mis à jour avec succès", result });
    } catch (error) {
        next(error);
    }
});

export default router;
