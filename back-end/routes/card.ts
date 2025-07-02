import { Router } from "express";
import {
  getAllCards,
  createCard,
  updateCard,
  deleteCard,
} from "../controllers/card";

const router = Router();

/**
 * @route   GET /api/cards
 * @desc    Récupérer toutes les cards
 * @access  Public
 * @query   ?limit=10
 */
router.get("/", getAllCards);

/**
 * @route   POST /api/cards
 * @desc    Créer une nouvelle card
 * @access  Public
 * @body    { description, categorie }
 */
router.post("/", createCard);

/**
 * @route   PUT /api/cards/:id
 * @desc    Mettre à jour une card
 * @access  Private
 * @body    { description?, categorie? }
 */
router.put("/:id", updateCard);

/**
 * @route   DELETE /api/cards/:id
 * @desc    Supprimer une card
 * @access  Private
 */
router.delete("/:id", deleteCard);

export default router;
