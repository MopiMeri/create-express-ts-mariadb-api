import { Request, Response, NextFunction } from "express";
import { TechnicienModel } from "../models/TechnicienModel";
import { Technicien } from "../utils/types/types";

// GET /techniciens : Récupérer tous les techniciens
export const handleGetAllTechniciens = async (request: Request, next: NextFunction) => {
    return (await TechnicienModel.getAll()) satisfies Technicien[];
};

export const handlegetTechnicienById = async (id: string, next: NextFunction) => {
    return (await TechnicienModel.getById(id)) satisfies Technicien[];
};

// POST /techniciens : Ajouter un nouveau technicien
export const handlePostTechnicien = async (request: Request, next: NextFunction) => {
    try {
        const technicien: Technicien = {
            id: request.body.id,
            nom: request.body.nom.toString(),
            prenom: request.body.prenom.toString(),
            specialisation: request.body.specialisation.toString(),
        };

        const results = await TechnicienModel.addOne(technicien);
        if (results.affectedRows === 0) {
            throw new Error("Erreur lors de l'ajout du technicien.");
        } else {
            const technicienAjoute = await TechnicienModel.getById(results.insertId);
            return technicienAjoute;
        }
    } catch (e) {
        next(e);
    }
};

export const handleDeleteTechnicien = async (request: Request, next: NextFunction) => {
    try {
        const id = request.params.id;
        const results = await TechnicienModel.delete(id);
        if (results.affectedRows === 0) {
            throw new Error("Erreur lors de la suppression duTechnicien.");
        }
        return { message: "Technicien supprimé avec succès." };
    } catch (e) {
        next(e);
    }
};

export const handlePutTechnicien = async (request: Request, next: NextFunction) => {
    try {
        const id = Number(request.params.id); 
        const updatedData: Partial<Technicien> = {
            nom: request.body.nom?.toString(),
            prenom: request.body.prenom?.toString(),
            specialisation: request.body.specialisation?.toString(),
        };

        const technicienExist = await TechnicienModel.getById(id.toString());
        if (!technicienExist) {
            const error = new Error(`Technicien avec l'ID ${id} non trouvé.`);
            error.name = "NotFoundError";  
            throw error;
        }

        const updatedTechnicien = await TechnicienModel.getById(request.params.id);
        return updatedTechnicien;
    } catch (e) {
        next(e);  
    }
};



export const handleGetTechnicienWithFilters = async (request: Request, next: NextFunction) => {
    try {
        const filters: Record<string, string | number | undefined> = {};

        if (request.query.id) {
            filters.id = Number(request.query.id); 
        }
        if (request.query.nom) {
            filters.nom = request.query.nom.toString();
        }
        if (request.query.prenom) {
            filters.prenom = request.query.prenom.toString();
        }
        if (request.query.specialisation) {
            filters.specialisation = request.query.specialisation.toString();
        }

        const techniciens = await TechnicienModel.getWithFilters(filters);

        return techniciens;
    } catch (error) {
        next(error);
    }
};
