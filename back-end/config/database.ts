import { Sequelize } from "sequelize";
import { config } from "dotenv";

// Pour ajouter des configurations specifiques a l'environnement (fichiers .env.<NODE_ENV>)
config();

const { NODE_ENV, DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } =
  process.env;

if (!NODE_ENV || !DB_NAME || !DB_USER || !DB_PASSWORD || !DB_HOST || !DB_PORT) {
  throw new Error(
    "Les variables d'environnement pour la base de données ne sont pas correctement définies."
  );
}

// Configuration Sequelize
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST!,
  port: parseInt(DB_PORT!),
  dialect: "mysql",
  logging: NODE_ENV === "development" ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  timezone: "+00:00",
  define: {
    timestamps: true,
    underscored: false,
    freezeTableName: true,
  },
});

// Test de connexion
export const connectDB = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connexion à la base de données établie avec succès");

    // Synchronisation des modèles en développement
    if (NODE_ENV === "development") {
      await sequelize.sync({ alter: true });
      console.log("📊 Modèles synchronisés avec la base de données");
    }
  } catch (error) {
    console.error("❌ Erreur de connexion à la base de données:", error);
    throw error;
  }
};

export default sequelize;
