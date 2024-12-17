//********** Imports **********/
import { Avion } from "../utils/types/types";
import { pool } from "./bdd";

//********** Model **********//
export const AvionModel = {
    getAll: async () => {
        let connection;
        try {
            connection = await pool.getConnection();
            const rows = await pool.query("select * from avion");
            return rows;
        } catch (error) {
            return error;
        } finally {
            if (connection) connection.release();
        }
    },

    getByImmatriculation: async (immatriculation: string) => {
        let connection;
        try {
            connection = await pool.getConnection();
            const rows = await pool.query(
                `select * from avion where immatriculation = "${immatriculation}"`
            );
            return rows;
        } catch (error) {
            return error;
        } finally {
            if (connection) connection.release();
        }
    },

    getWithFilters: async (params: Record<string, string | number | undefined>) => {
        let connection;
        try {
            connection = await pool.getConnection();

            let query = "SELECT * FROM avion";
            const conditions: string[] = [];

            Object.keys(params).forEach((key) => {
                if (params[key] !== undefined) {
                    conditions.push(`${key} = ?`);
                }
            });

            if (conditions.length > 0) {
                query += " WHERE " + conditions.join(" AND ");
            }

            const rows = await pool.query(query, Object.values(params));
            return rows;
        } catch (error) {
            return error;
        } finally {
            if (connection) connection.release();
        }
    },


    addOne: async (avion: Avion) => {
        let connection;
        try {
            connection = await pool.getConnection();
            const rows = await pool.query(
                `insert into avion(immatriculation, nom, modele) 
						values("${avion.immatriculation}", "${avion.nom}", 
						"${avion.modele}");`
            );
            return rows;
        } catch (error) {
            return error;
        } finally {
            if (connection) connection.release();
        }
    },

    delete: async (immatriculation: string) => {
        let connection;
        try {
            connection = await pool.getConnection();
            const rows = await pool.query(
                `delete from avion where immatriculation = "${immatriculation}"`
            );
            return rows;
        } catch (error) {
            return error;
        } finally {
            if (connection) connection.release();
        }
    },

    update: async (params: Record<string, string | number | undefined>) => {
        let connection;
        try {
            const { immatriculation, nom, modele } = params;

            if (immatriculation && (nom || modele)) {
                let query = "UPDATE avion SET ";
                const updates: string[] = [];
                const values: (string | number)[] = [];

                if (nom) {
                    updates.push("nom = ?");
                    values.push(nom);
                }

                if (modele) {
                    updates.push("modele = ?");
                    values.push(modele);
                }

                query += updates.join(", ") + " WHERE immatriculation = ?";
                values.push(immatriculation);

                connection = await pool.getConnection();
                const [rows] = await connection.query(query, values);

                return rows;
            } else {
                throw new Error("Les champs à mettre à jour ou l'immatriculation sont manquants.");
            }
        } catch (error) {
            return error;
        } finally {
            if (connection) connection.release();
        }
    },


};