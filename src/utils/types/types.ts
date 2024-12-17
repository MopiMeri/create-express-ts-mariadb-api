export interface Avion {
    immatriculation: string;
    nom: string;
    modele: string;
}
export interface Technicien {
    id: number;
    nom: string;
    prenom: string;
    specialisation: string;
}

export interface Entretien {
    id: number;
    immatriculation: string;
    idTechnicien: number;
    dateEntretien: Date;
    typeEntretien: string;
    note: string;
}
