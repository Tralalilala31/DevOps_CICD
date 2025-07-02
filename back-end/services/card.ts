import {
  CreateCardDto,
  UpdateCardDto,
  CardResponse,
  CardsListResponse,
} from "../types/card";
// Import du fichier utils qui sera créé prochainement
import * as cardData from "../utils/cardData";

/**
 * Récupérer toutes les cards
 */
export const getAllCards = async (
  limit: number
): Promise<CardsListResponse> => {
  try {
    const cards = await cardData.getAllCards();
    const limitedCards = limit > 0 ? cards.slice(0, limit) : cards;

    return {
      cards: limitedCards,
      total: cards.length,
      limit: limit > 0 ? limit : undefined,
    };
  } catch (error) {
    throw new Error(
      `Erreur lors de la récupération des cards: ${
        error instanceof Error ? error.message : "Erreur inconnue"
      }`
    );
  }
};

/**
 * Créer une nouvelle card
 */
export const createCard = async (
  cardDto: CreateCardDto
): Promise<CardResponse> => {
  try {
    const newCard = await cardData.createCard(cardDto);
    return newCard;
  } catch (error) {
    throw new Error(
      `Erreur lors de la création de la card: ${
        error instanceof Error ? error.message : "Erreur inconnue"
      }`
    );
  }
};

/**
 * Mettre à jour une card
 */
export const updateCard = async (
  id: string,
  updateData: UpdateCardDto
): Promise<CardResponse | null> => {
  try {
    const updatedCard = await cardData.updateCard(id, updateData);
    return updatedCard;
  } catch (error) {
    throw new Error(
      `Erreur lors de la mise à jour de la card: ${
        error instanceof Error ? error.message : "Erreur inconnue"
      }`
    );
  }
};

/**
 * Supprimer une card
 */
export const deleteCard = async (id: string): Promise<boolean> => {
  try {
    const success = await cardData.deleteCard(id);
    return success;
  } catch (error) {
    throw new Error(
      `Erreur lors de la suppression de la card: ${
        error instanceof Error ? error.message : "Erreur inconnue"
      }`
    );
  }
};
