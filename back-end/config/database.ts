import { Sequelize } from "sequelize";
import { config } from "dotenv";

// Configuration des variables d'environnement depuis le dossier parent
config();

// Configuration Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME!,
  process.env.DB_USER!,
  process.env.DB_PASSWORD!,
  {
    host: process.env.DB_HOST!,
    port: parseInt(process.env.DB_PORT!),
    dialect: "mysql",
    logging: process.env.NODE_ENV === "development" ? console.log : false,
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
  }
);

// Test de connexion
export const connectDB = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connexion à la base de données établie avec succès");

    // Synchronisation des modèles en développement
    if (process.env.NODE_ENV === "development") {
      await sequelize.sync({ alter: true });
      console.log("📊 Modèles synchronisés avec la base de données");
    }
    // En production, on ne devrait pas synchroniser les modèles mais on le fait le projet
    else if (process.env.NODE_ENV === "production") {
      await sequelize.sync({ alter: false });
      console.log("📊 Modèles synchronisés avec la base de données");
    }
  } catch (error) {
    console.error("❌ Erreur de connexion à la base de données:", error);
    throw error;
  }
};

export default sequelize;
