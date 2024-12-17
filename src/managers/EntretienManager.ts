//********** Imports **********//
import { NextFunction, Request } from "express";
import { Entretien } from "../utils/types/types";
import { EntretienModel } from "../models/EntretienModel";

//********** Managers **********//
export const handleGetAllEntretiens = async (request: Request, next: NextFunction) => {
    try {
        return (await EntretienModel.getAll()) satisfies Entretien[];
    } catch (error) {
        next(error);
    }
};

export const handlegetEntretienById = async (id: string, next: NextFunction) => {
    return (await EntretienModel.getById(id)) satisfies Entretien[];
};

export const handleGetEntretienWithFilters = async (request: Request, next: NextFunction) => {
    try {
        const filters: Record<string, string | number | undefined> = {};

        if (request.query.id) {
            filters.id = Number(request.query.id); 
        }
        if (request.query.immatriculation) {
            filters.immatriculation = request.query.immatriculation.toString();
        }
        if (request.query.idTechnicien) {
            filters.idTechnicien = Number(request.query.idTechnicien); 
        }
        if (request.query.dateEntretien) {
            filters.dateEntretien = new Date(request.query.dateEntretien.toString()).toISOString();; 
        }
        if (request.query.typeEntretien) {
            filters.typeEntretien = request.query.typeEntretien.toString();
        }
        if (request.query.note) {
            filters.note = request.query.note.toString();
        }

        const entretien = await EntretienModel.getWithFilters(filters);

        return entretien;
    } catch (error) {
        next(error);
    }
};


export const handlePostEntretien = async (request: Request, next: NextFunction) => {
    try {
        console.log("Request Body:", request.body); 
        const entretien: Entretien = {
            id: request.body.id,
            immatriculation: request.body.immatriculation.toString(),
            idTechnicien: request.body.idTechnicien,
            typeEntretien: request.body.typeEntretien.toString(),
            dateEntretien: new Date(request.body.dateEntretien),
            note: request.body.note?.toString() || null,
        };

        const results = await EntretienModel.addOne(entretien);
        if (results.affectedRows === 0) {
            throw new Error("Erreur lors de l'ajout de l'entretien.");
        } else {
            const entretienAjoute = await EntretienModel.getById(results.insertId);
            return entretienAjoute;
        }
    } catch (e) {
        next(e);
    }
};

export const handleDeleteEntretien = async (request: Request, next: NextFunction) => {
    try {
        const id = request.params.id;
        const results = await EntretienModel.delete(id);
        if (results.affectedRows === 0) {
            throw new Error("Erreur lors de la suppression de l'entretien.");
        }
        return { message: "Entretien supprimé avec succès." };
    } catch (e) {
        next(e);
    }
};

export const handlePutEntretien = async (request: Request, next: NextFunction) => {
    try {
        const id = request.params.id;
        const updatedData: Partial<Entretien> = {
            id: request.body.avionId?.toString(),
            typeEntretien: request.body.typeEntretien?.toString(),
            dateEntretien: request.body.dateEntretien ? new Date(request.body.dateEntretien) : undefined,
            note: request.body.note?.toString() || null,
        };

        const results = await EntretienModel.update(id, updatedData);
        if (results.affectedRows === 0) {
            const error = new Error("Erreur lors de la mise à jour de l'entretien.");
            error.name = "NotFoundError";
            throw error;
        }
        
        const updatedEntretien = await EntretienModel.getById(id);
        return updatedEntretien;
    } catch (e) {
        return next(e); 
    }
};


