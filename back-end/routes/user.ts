import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/user";

const router = Router();

/**
 * @route   GET /api/users
 * @desc    Récupérer tous les utilisateurs
 * @access  Public (TODO: Ajouter authentification)
 * @query   ?page=1&limit=10
 */
router.get("/", getAllUsers);

/**
 * @route   GET /api/users/:id
 * @desc    Récupérer un utilisateur par ID
 * @access  Public (TODO: Ajouter authentification)
 */
router.get("/:id", getUserById);

/**
 * @route   POST /api/users
 * @desc    Créer un nouvel utilisateur
 * @access  Public (TODO: Ajouter authentification pour admin)
 * @body    { name, email, password, role? }
 */
router.post("/", createUser);

/**
 * @route   PUT /api/users/:id
 * @desc    Mettre à jour un utilisateur
 * @access  Private (TODO: Ajouter authentification - utilisateur ou admin)
 * @body    { name?, email?, password?, role? }
 */
router.put("/:id", updateUser);

/**
 * @route   DELETE /api/users/:id
 * @desc    Supprimer un utilisateur
 * @access  Private (TODO: Ajouter authentification - admin seulement)
 */
router.delete("/:id", deleteUser);

export default router;
