import { pool } from "./bdd";
import { Technicien } from "../utils/types/types";

//********** Model **********//
export const TechnicienModel = {
    // Récupérer tous les techniciens
    getAll: async () => {
        let connection;
        try {
            connection = await pool.getConnection();
            const rows = await pool.query("SELECT * FROM technicien");
            return rows;
        } catch (error) {
            throw error;
        } finally {
            if (connection) connection.release();
        }
    },

    getById: async (id: string) => {
        let connection;
        try {
            connection = await pool.getConnection();
            const rows = await connection.query("SELECT * FROM technicien WHERE id = ?", [id]);
            return rows[0];
        } catch (error) {
            throw error;
        } finally {
            if (connection) connection.release();
        }
    },

    getWithFilters: async (params: Record<string, string | number | undefined>) => {
        let connection;
        try {
            connection = await pool.getConnection();
    
            let query = "SELECT * FROM technicien";
            const conditions: string[] = [];
    
            Object.keys(params).forEach((key) => {
                if (params[key] !== undefined) {
                    conditions.push(`${key} = ?`);
                }
            });
    
            if (conditions.length > 0) {
                query += " WHERE " + conditions.join(" AND ");
            }
    
            const rows = await connection.query(query, Object.values(params));
            return rows;
        } catch (error) {
            return error;
        } finally {
            if (connection) connection.release();
        }
    },

    // Ajouter un nouveau technicien
    addOne: async (technicien: Technicien) => {
        let connection;
        try {
            connection = await pool.getConnection();
            const rows = await pool.query(
                `INSERT INTO technicien (specialisation, nom, prenom) 
        VALUES (?, ?, ?)`,
                [technicien.specialisation, technicien.nom, technicien.prenom]
            );
            return rows;
        } catch (error) {
            throw error;
        } finally {
            if (connection) connection.release();
        }
    },

    // Supprimer un technicien par ID
    delete: async (id: string) => {
        let connection;
        try {
            connection = await pool.getConnection();
            const rows = await pool.query(
                `DELETE FROM technicien WHERE id = ?`,
                [id]
            );
            return rows;
        } catch (error) {
            throw error;
        } finally {
            if (connection) connection.release();
        }
    },

    update: async (id: string, params: Record<string, any>) => {
        let connection;
        try {
            if (id) {
                let query = "UPDATE technicien SET ";
                const updates: string[] = [];
    
                Object.keys(params).forEach((item) => {
                    if (item !== "id") {
                        updates.push(`${item} = ?`);
                    }
                });
    
                if (updates.length === 0) {
                    throw new Error("Aucune donnée à mettre à jour.");
                }
    
                query += updates.join(", ") + " WHERE id = ?";
                const values = [...Object.values(params).filter(value => value !== undefined), id];
    
                connection = await pool.getConnection();
                const result = await connection.query(query, values);
                return result;
            } else {
                throw new Error("ID du technicien requis pour la mise à jour.");
            }
        } catch (error) {
            throw error;
        } finally {
            if (connection) connection.release();
        }
    },
};    
