import mariadb from "mariadb";

// Create a pool
export const pool = mariadb.createPool({
    host: "localhost",
    user: "root",
    password: "",
    port: 3307,
    database: "gestionentretien",
    connectionLimit: 5,
});


