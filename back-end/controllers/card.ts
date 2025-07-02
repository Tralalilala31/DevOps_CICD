import { Request, Response } from "express";
import { CreateCardDto, UpdateCardDto } from "../types/card";
import * as cardService from "../services/card";

/**
 * Récupérer toutes les cards
 * GET /api/cards
 */
export const getAllCards = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { limit = "10" } = req.query;

    const result = await cardService.getAllCards(Number(limit));

    res.status(200).json({
      success: true,
      data: result,
      message: "Cards récupérées avec succès",
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des cards:", error);
    res.status(500).json({
      success: false,
      error:
        error instanceof Error ? error.message : "Erreur interne du serveur",
    });
  }
};

/**
 * Créer une nouvelle card
 * POST /api/cards
 */
export const createCard = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const cardData: CreateCardDto = req.body;

    const newCard = await cardService.createCard(cardData);

    res.status(201).json({
      success: true,
      data: newCard,
      message: "Card créée avec succès",
    });
  } catch (error) {
    console.error("Erreur lors de la création de la card:", error);
    res.status(500).json({
      success: false,
      error:
        error instanceof Error ? error.message : "Erreur interne du serveur",
    });
  }
};

/**
 * Mettre à jour une card
 * PUT /api/cards/:id
 */
export const updateCard = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData: UpdateCardDto = req.body;

    if (!id) {
      res.status(400).json({
        success: false,
        error: "ID de la card requis",
      });
      return;
    }

    const updatedCard = await cardService.updateCard(id, updateData);

    if (!updatedCard) {
      res.status(404).json({
        success: false,
        error: "Card non trouvée",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: updatedCard,
      message: "Card mise à jour avec succès",
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la card:", error);
    res.status(500).json({
      success: false,
      error:
        error instanceof Error ? error.message : "Erreur interne du serveur",
    });
  }
};

/**
 * Supprimer une card
 * DELETE /api/cards/:id
 */
export const deleteCard = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        success: false,
        error: "ID de la card requis",
      });
      return;
    }

    const success = await cardService.deleteCard(id);

    if (!success) {
      res.status(404).json({
        success: false,
        error: "Card non trouvée",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Card supprimée avec succès",
    });
  } catch (error) {
    console.error("Erreur lors de la suppression de la card:", error);
    res.status(500).json({
      success: false,
      error:
        error instanceof Error ? error.message : "Erreur interne du serveur",
    });
  }
};
