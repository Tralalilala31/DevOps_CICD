import express from "express";
import cors from "cors";
import { createServer } from "http";
import userRoutes from "./routes/user";
import { connectDB } from "./config/database";

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";

// Configuration CORS
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:4200",
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

app.use(cors(corsOptions));

// Middleware pour le parsing des données
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Middleware de logging pour le développement
if (NODE_ENV === "development") {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// Route de santé
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
    uptime: process.uptime(),
  });
});

// TODO: Instanciation des routes
app.use("/api/users", userRoutes);

// Middleware de gestion des routes non trouvées
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Route non trouvée",
    path: req.originalUrl,
    method: req.method,
  });
});

// Middleware de gestion des erreurs
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Erreur:", err);

    const statusCode = err.statusCode || err.status || 500;
    const message =
      NODE_ENV === "development" ? err.message : "Erreur interne du serveur";

    res.status(statusCode).json({
      error: message,
      ...(NODE_ENV === "development" && { stack: err.stack }),
    });
  }
);

// Création du serveur HTTP
const server = createServer(app);

// Démarrage du serveur avec connexion BDD
const startServer = async () => {
  try {
    // Connexion à la base de données
    await connectDB();

    // Démarrage du serveur
    server.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur le port ${PORT}`);
      console.log(`📍 Environnement: ${NODE_ENV}`);
      console.log(`🌐 URL: http://localhost:${PORT}`);
      console.log(`❤️  Santé: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error("❌ Erreur lors du démarrage du serveur:", error);
    process.exit(1);
  }
};

startServer();

// Gestion gracieuse de l'arrêt du serveur
process.on("SIGTERM", () => {
  console.log("SIGTERM reçu, arrêt gracieux du serveur...");
  server.close(() => {
    console.log("Serveur fermé.");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT reçu, arrêt gracieux du serveur...");
  server.close(() => {
    console.log("Serveur fermé.");
    process.exit(0);
  });
});

export default app;
