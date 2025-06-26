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
 * @access  Public
 * @query   ?page=1&limit=10
 */
router.get("/", getAllUsers);

/**
 * @route   GET /api/users/:id
 * @desc    Récupérer un utilisateur par ID
 * @access  Public
 */
router.get("/:id", getUserById);

/**
 * @route   POST /api/users
 * @desc    Créer un nouvel utilisateur
 * @access  Public
 * @body    { nom, prenom, email }
 */
router.post("/", createUser);

/**
 * @route   PUT /api/users/:id
 * @desc    Mettre à jour un utilisateur
 * @access  Private
 * @body    { nom?, prenom?, email? }
 */
router.put("/:id", updateUser);

/**
 * @route   DELETE /api/users/:id
 * @desc    Supprimer un utilisateur
 * @access  Private
 */
router.delete("/:id", deleteUser);

export default router;
