import { Request, Response } from "express";
import { CreateUserDto, UpdateUserDto, UserRole } from "../types/user";
import { validateUserData, validateUpdateUserData } from "../utils/validation";
import * as userService from "../services/user";

/**
 * Récupérer tous les utilisateurs
 * GET /api/users
 */
export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { limit = "10" } = req.query;

    const result = await userService.getAllUsers(Number(limit));

    res.status(200).json({
      success: true,
      data: result,
      message: "Utilisateurs récupérés avec succès",
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error);
    res.status(500).json({
      success: false,
      error:
        error instanceof Error ? error.message : "Erreur interne du serveur",
    });
  }
};

/**
 * Récupérer un utilisateur par ID
 * GET /api/users/:id
 */
export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        success: false,
        error: "ID utilisateur requis",
      });
      return;
    }

    const user = await userService.getUserById(id);

    if (!user) {
      res.status(404).json({
        success: false,
        error: "Utilisateur non trouvé",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: user,
      message: "Utilisateur trouvé",
    });
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur:", error);
    res.status(500).json({
      success: false,
      error:
        error instanceof Error ? error.message : "Erreur interne du serveur",
    });
  }
};

/**
 * Créer un nouvel utilisateur
 * POST /api/users
 */
export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userData: CreateUserDto = req.body;

    // Validation des données
    const validation = validateUserData(userData);
    if (!validation.isValid) {
      res.status(400).json({
        success: false,
        error: "Données invalides",
        details: validation.errors,
      });
      return;
    }

    // Assignation du rôle par défaut si non fourni
    if (!userData.role) {
      userData.role = UserRole.USER;
    }

    const newUser = await userService.createUser(userData);

    res.status(201).json({
      success: true,
      data: newUser,
      message: "Utilisateur créé avec succès",
    });
  } catch (error) {
    console.error("Erreur lors de la création de l'utilisateur:", error);
    res.status(500).json({
      success: false,
      error:
        error instanceof Error ? error.message : "Erreur interne du serveur",
    });
  }
};

/**
 * Mettre à jour un utilisateur
 * PUT /api/users/:id
 */
export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData: UpdateUserDto = req.body;

    if (!id) {
      res.status(400).json({
        success: false,
        error: "ID utilisateur requis",
      });
      return;
    }

    // Validation des données de mise à jour
    const validation = validateUpdateUserData(updateData);
    if (!validation.isValid) {
      res.status(400).json({
        success: false,
        error: "Données invalides",
        details: validation.errors,
      });
      return;
    }

    const updatedUser = await userService.updateUser(id, updateData);

    if (!updatedUser) {
      res.status(404).json({
        success: false,
        error: "Utilisateur non trouvé",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: updatedUser,
      message: "Utilisateur mis à jour avec succès",
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
    res.status(500).json({
      success: false,
      error:
        error instanceof Error ? error.message : "Erreur interne du serveur",
    });
  }
};

/**
 * Supprimer un utilisateur
 * DELETE /api/users/:id
 */
export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        success: false,
        error: "ID utilisateur requis",
      });
      return;
    }

    const success = await userService.deleteUser(id);

    if (!success) {
      res.status(404).json({
        success: false,
        error: "Utilisateur non trouvé",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Utilisateur supprimé avec succès",
    });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'utilisateur:", error);
    res.status(500).json({
      success: false,
      error:
        error instanceof Error ? error.message : "Erreur interne du serveur",
    });
  }
};
