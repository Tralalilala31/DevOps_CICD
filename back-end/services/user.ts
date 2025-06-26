import {
  CreateUserDto,
  UpdateUserDto,
  UserResponse,
  UsersListResponse,
} from "../types/user";
import { User } from "../models";

/**
 * Service pour la gestion des utilisateurs
 */

/**
 * Récupérer tous les utilisateurs avec limite
 * @param limit Nombre d'utilisateurs maximum à retourner
 * @returns Liste des utilisateurs
 */
export const getAllUsers = async (
  limit: number = 10
): Promise<UsersListResponse> => {
  try {
    const users = await User.findAll({
      limit: limit,
      order: [["id", "ASC"]], // Tri par ID
    });

    const total = await User.count();

    return {
      users: users.map((user) => user.toResponse()),
      total,
      limit,
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error);
    throw new Error("Erreur lors de la récupération des utilisateurs");
  }
};

/**
 * Récupérer un utilisateur par ID
 * @param id ID de l'utilisateur
 * @returns Utilisateur trouvé
 */
export const getUserById = async (id: string): Promise<UserResponse | null> => {
  try {
    const user = await User.findByPk(id);

    if (!user) {
      return null;
    }

    return user.toResponse();
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur:", error);
    throw new Error("Erreur lors de la récupération de l'utilisateur");
  }
};

/**
 * Créer un nouvel utilisateur
 * @param userData Données de l'utilisateur à créer
 * @returns Utilisateur créé
 */
export const createUser = async (
  userData: CreateUserDto
): Promise<UserResponse> => {
  try {
    // Vérifier si l'email existe déjà
    const existingUser = await User.findOne({
      where: { email: userData.email.toLowerCase() },
    });

    if (existingUser) {
      throw new Error("Un utilisateur avec cet email existe déjà");
    }

    // Créer l'utilisateur
    const newUser = await User.create({
      nom: userData.nom,
      prenom: userData.prenom,
      email: userData.email.toLowerCase(),
    });

    return newUser.toResponse();
  } catch (error) {
    console.error("Erreur lors de la création de l'utilisateur:", error);

    // Gestion spécifique des erreurs Sequelize
    if (error instanceof Error) {
      if (error.message.includes("email existe déjà")) {
        throw error; // Relancer l'erreur métier
      }
      if (error.message.includes("Validation error")) {
        throw new Error("Données invalides pour la création de l'utilisateur");
      }
    }

    throw new Error("Erreur lors de la création de l'utilisateur");
  }
};

/**
 * Mettre à jour un utilisateur
 * @param id ID de l'utilisateur
 * @param updateData Données à mettre à jour
 * @returns Utilisateur mis à jour
 */
export const updateUser = async (
  id: string,
  updateData: UpdateUserDto
): Promise<UserResponse | null> => {
  try {
    // Vérifier si l'utilisateur existe
    const existingUser = await User.findByPk(id);

    if (!existingUser) {
      return null;
    }

    // Préparer les données de mise à jour
    const updateFields: any = {};

    // Vérifier l'unicité de l'email si mis à jour
    if (updateData.email && updateData.email !== existingUser.email) {
      const emailExists = await User.findOne({
        where: { email: updateData.email.toLowerCase() },
        attributes: ["id"],
      });

      if (emailExists) {
        throw new Error("Un utilisateur avec cet email existe déjà");
      }

      updateFields.email = updateData.email.toLowerCase();
    }

    // Ajouter les autres champs
    if (updateData.nom) {
      updateFields.nom = updateData.nom;
    }

    if (updateData.prenom) {
      updateFields.prenom = updateData.prenom;
    }

    // Mettre à jour l'utilisateur
    await existingUser.update(updateFields);

    // Recharger l'utilisateur mis à jour
    await existingUser.reload();

    return existingUser.toResponse();
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'utilisateur:", error);

    // Gestion spécifique des erreurs
    if (error instanceof Error) {
      if (error.message.includes("email existe déjà")) {
        throw error; // Relancer l'erreur métier
      }
      if (error.message.includes("Validation error")) {
        throw new Error(
          "Données invalides pour la mise à jour de l'utilisateur"
        );
      }
    }

    throw new Error("Erreur lors de la mise à jour de l'utilisateur");
  }
};

/**
 * Supprimer un utilisateur
 * @param id ID de l'utilisateur à supprimer
 * @returns Succès de la suppression
 */
export const deleteUser = async (id: string): Promise<boolean> => {
  try {
    const user = await User.findByPk(id);

    if (!user) {
      return false;
    }

    await user.destroy();
    return true;
  } catch (error) {
    console.error("Erreur lors de la suppression de l'utilisateur:", error);
    throw new Error("Erreur lors de la suppression de l'utilisateur");
  }
};

/**
 * Vérifier si un email existe déjà
 * @param email Email à vérifier
 * @returns True si l'email existe
 */
export const emailExists = async (email: string): Promise<boolean> => {
  try {
    const user = await User.findOne({
      where: { email: email.toLowerCase() },
      attributes: ["id"], // Récupérer seulement l'ID pour optimiser
    });

    return !!user;
  } catch (error) {
    console.error("Erreur lors de la vérification de l'email:", error);
    throw new Error("Erreur lors de la vérification de l'email");
  }
};

/**
 * Récupérer un utilisateur par email
 * @param email Email de l'utilisateur
 * @returns Utilisateur trouvé
 */
export const getUserByEmail = async (
  email: string
): Promise<UserResponse | null> => {
  try {
    const user = await User.findOne({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return null;
    }

    return user.toResponse();
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de l'utilisateur par email:",
      error
    );
    throw new Error(
      "Erreur lors de la récupération de l'utilisateur par email"
    );
  }
};
