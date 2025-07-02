import {
  CreateCardDto,
  UpdateCardDto,
  CardResponse,
  CardsListResponse,
} from "../types/card";
// Import du fichier generate-json qui gère les données
import * as jsonUtils from "../utils/generate-json";

// Initialiser le fichier JSON au démarrage
jsonUtils.initializeJsonFile();

/**
 * Convertir un Item (generate-json) vers CardResponse
 */
const convertItemToCard = (item: any): CardResponse => ({
  id: item.id.toString(),
  description: item.description,
  categorie: item.categorie,
});

/**
 * Récupérer toutes les cards
 */
export const getAllCards = async (
  limit: number
): Promise<CardsListResponse> => {
  try {
    const items = jsonUtils.listItems();
    const cards = items.map(convertItemToCard);
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
    // Générer un nouvel ID
    const existingItems = jsonUtils.listItems();
    const newId =
      existingItems.length > 0
        ? Math.max(...existingItems.map((item) => item.id)) + 1
        : 1;

    const newItem = {
      id: newId,
      description: cardDto.description,
      categorie: cardDto.categorie,
    };

    const result = jsonUtils.addItem(newItem);
    if (!result) {
      throw new Error("Erreur lors de l'ajout de la card");
    }

    return convertItemToCard(result);
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
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      throw new Error("ID invalide");
    }

    const success = jsonUtils.updateItem(numericId, updateData);
    if (!success) {
      return null;
    }

    // Récupérer l'item mis à jour
    const items = jsonUtils.listItems();
    const updatedItem = items.find((item) => item.id === numericId);

    return updatedItem ? convertItemToCard(updatedItem) : null;
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
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      throw new Error("ID invalide");
    }

    const success = jsonUtils.deleteItem(numericId);
    return success;
  } catch (error) {
    throw new Error(
      `Erreur lors de la suppression de la card: ${
        error instanceof Error ? error.message : "Erreur inconnue"
      }`
    );
  }
};
