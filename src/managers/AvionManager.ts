//********** Imports **********//
import { NextFunction, Request } from "express";
import { Avion } from "../utils/types/types";
import { AvionModel } from "../models/AvionModel";

//********** Managers **********//
export const handleGetAllAvions = async (request: Request, next: NextFunction) => {
    return (await AvionModel.getAll()) satisfies Avion[];
};

export const handlegetAvionById = async (immat: string, next: NextFunction) => {
    return (await AvionModel.getByImmatriculation(immat)) satisfies Avion[];
};

export const handleGetAvionsWithFilters = async (request: Request, next: NextFunction) => {
    try {
        const filters: Record<string, string | number | undefined> = {};

        if (request.query.immatriculation) {
            filters.immatriculation = request.query.immatriculation.toString();
        }
        if (request.query.nom) {
            filters.nom = request.query.nom.toString();
        }
        if (request.query.modele) {
            filters.modele = request.query.modele.toString();
        }

        const avions = await AvionModel.getWithFilters(filters);
        return avions;
    } catch (error) {
        next(error);
    }
};


export const handlePostAvion = async (request: Request, next: NextFunction) => {
    try {
        if (!request.body.immatriculation || !request.body.marque || !request.body.modele) {
            throw new Error("Les champs immatriculation, marque et modele sont requis.");
        }

        // Vérifier si l'immatriculation existe déjà
        const avionExistante = await AvionModel.getByImmatriculation(request.body.immatriculation.toString());

        if (avionExistante) {
            throw new Error("L'immatriculation existe déjà.");
        }

        const avion: Avion = {
            immatriculation: request.body.immatriculation.toString(),
            nom: request.body.marque.toString(),
            modele: request.body.modele.toString(),
        };

        const results = await AvionModel.addOne(avion);
        if (results.affectedRows === 0) {
            throw new Error("Erreur lors de l'ajout de l'avion.");
        } else {
            const avionAjoute = await AvionModel.getByImmatriculation(avion.immatriculation);
            return avionAjoute;
        }
    } catch (e) {
        next(e);
    }
};


export const handleDeleteAvion = async (request: Request, next: NextFunction) => {
    try {
        const immatriculation = request.params.immatriculation;

        const avionExist = await AvionModel.getByImmatriculation(immatriculation);

        if (!avionExist) {
            throw new Error("Immatriculation non trouvée, impossible de supprimer l'avion.");
        }

        const results = await AvionModel.delete(immatriculation);
        
        if (results.affectedRows === 0) {
            throw new Error("Erreur lors de la suppression de l'avion");
        }

        const affectedRows = JSON.stringify({
            avionSupprime: results.affectedRows,
        });
        
        return JSON.parse(affectedRows);

    } catch (error) {
        next(error); 
    }
};

export const handlePutAvion = async (request: Request, next: NextFunction) => {
    try {
        const params: Record<string, string | number | undefined> = {};
        
        if (request.params.immatriculation)
            params["immatriculation"] = request.params.immatriculation.toString();
        if (request.query.marque)
            params["marque"] = request.query.marque.toString();
        if (request.query.modele)
            params["modele"] = request.query.modele.toString();
        if (request.query.heuresDeVol)
            params["heuresDeVol"] = Number(request.query.heuresDeVol.toString());

        const avionExist = await AvionModel.getByImmatriculation(request.params.immatriculation.toString());

        if (!avionExist) {
            throw new Error("Immatriculation non trouvée, impossible de mettre à jour l'avion.");
        }

        const results = await AvionModel.update(params);

        if (results.affectedRows === 0) {
            throw new Error("Erreur lors de la mise à jour de l'avion");
        } else if (params["immatriculation"]) {
            const updatedAvion = await AvionModel.getByImmatriculation(params["immatriculation"].toString());
            return updatedAvion;
        }
    } catch (error) {
        next(error);  
    }
};