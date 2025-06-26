import { Request, Response } from "express";
import * as userController from "../controllers/user";
import * as userService from "../services/user";
import { CreateUserDto, UpdateUserDto, UserResponse } from "../types/user";

// Mock du service user
jest.mock("../services/user");
const mockUserService = userService as jest.Mocked<typeof userService>;

// Mock du module de validation
jest.mock("../utils/validation", () => ({
  validateUserData: jest.fn(),
  validateUpdateUserData: jest.fn(),
}));

// Mock des objets Request et Response
const mockRequest = () => {
  const req = {} as Request;
  req.body = {};
  req.params = {};
  req.query = {};
  return req;
};

const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn().mockReturnThis();
  return res;
};

describe("Tests CRUD Utilisateur - Controllers avec Mocks", () => {
  // Données de test
  const testUser: CreateUserDto = {
    nom: "Dupont",
    prenom: "Jean",
    email: "jean.dupont@test.fr",
  };

  const mockUserResponse: UserResponse = {
    id: "123e4567-e89b-12d3-a456-426614174000",
    nom: "Dupont",
    prenom: "Jean",
    email: "jean.dupont@test.fr",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Tests pour getAllUsers
  describe("getAllUsers", () => {
    it("devrait retourner tous les utilisateurs avec succès", async () => {
      const req = mockRequest();
      const res = mockResponse();
      req.query = { limit: "10" };

      const mockResult = {
        users: [mockUserResponse],
        total: 1,
        limit: 10,
      };

      mockUserService.getAllUsers.mockResolvedValue(mockResult);

      await userController.getAllUsers(req, res);

      expect(mockUserService.getAllUsers).toHaveBeenCalledWith(10);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockResult,
        message: "Utilisateurs récupérés avec succès",
      });
    });

    it("devrait gérer les erreurs lors de la récupération", async () => {
      const req = mockRequest();
      const res = mockResponse();

      mockUserService.getAllUsers.mockRejectedValue(new Error("Erreur DB"));

      await userController.getAllUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: "Erreur DB",
      });
    });
  });

  // Tests pour getUserById
  describe("getUserById", () => {
    it("devrait retourner un utilisateur par ID", async () => {
      const req = mockRequest();
      const res = mockResponse();
      req.params = { id: "123" };

      mockUserService.getUserById.mockResolvedValue(mockUserResponse);

      await userController.getUserById(req, res);

      expect(mockUserService.getUserById).toHaveBeenCalledWith("123");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockUserResponse,
        message: "Utilisateur trouvé",
      });
    });

    it("devrait retourner 404 si utilisateur non trouvé", async () => {
      const req = mockRequest();
      const res = mockResponse();
      req.params = { id: "123" };

      mockUserService.getUserById.mockResolvedValue(null);

      await userController.getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: "Utilisateur non trouvé",
      });
    });

    it("devrait retourner 400 si ID manquant", async () => {
      const req = mockRequest();
      const res = mockResponse();
      req.params = {}; // Pas d'ID

      await userController.getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: "ID utilisateur requis",
      });
    });
  });

  // Tests pour createUser
  describe("createUser", () => {
    // Mock du module de validation
    const mockValidation = require("../utils/validation");

    beforeEach(() => {
      jest.doMock("../utils/validation", () => ({
        validateUserData: jest.fn(),
      }));
    });

    it("devrait créer un utilisateur avec des données valides", async () => {
      const req = mockRequest();
      const res = mockResponse();
      req.body = testUser;

      // Mock de la validation réussie
      jest
        .spyOn(require("../utils/validation"), "validateUserData")
        .mockReturnValue({
          isValid: true,
          errors: [],
        });

      mockUserService.createUser.mockResolvedValue(mockUserResponse);

      await userController.createUser(req, res);

      expect(mockUserService.createUser).toHaveBeenCalledWith(testUser);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockUserResponse,
        message: "Utilisateur créé avec succès",
      });
    });

    it("devrait retourner 400 avec des données invalides", async () => {
      const req = mockRequest();
      const res = mockResponse();
      req.body = { nom: "", email: "invalid" };

      // Mock de la validation échouée
      jest
        .spyOn(require("../utils/validation"), "validateUserData")
        .mockReturnValue({
          isValid: false,
          errors: [
            "Le nom doit contenir au moins 2 caractères",
            "Le prénom doit contenir au moins 2 caractères",
            "Email invalide",
          ],
        });

      await userController.createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: "Données invalides",
        details: [
          "Le nom doit contenir au moins 2 caractères",
          "Le prénom doit contenir au moins 2 caractères",
          "Email invalide",
        ],
      });
    });

    it("devrait gérer les erreurs de création", async () => {
      const req = mockRequest();
      const res = mockResponse();
      req.body = testUser;

      jest
        .spyOn(require("../utils/validation"), "validateUserData")
        .mockReturnValue({
          isValid: true,
          errors: [],
        });

      mockUserService.createUser.mockRejectedValue(
        new Error("Email déjà utilisé")
      );

      await userController.createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: "Email déjà utilisé",
      });
    });
  });

  // Tests pour updateUser
  describe("updateUser", () => {
    it("devrait mettre à jour un utilisateur", async () => {
      const req = mockRequest();
      const res = mockResponse();
      req.params = { id: "123" };
      req.body = { nom: "Martin" } as UpdateUserDto;

      jest
        .spyOn(require("../utils/validation"), "validateUpdateUserData")
        .mockReturnValue({
          isValid: true,
          errors: [],
        });

      const updatedUser = { ...mockUserResponse, nom: "Martin" };
      mockUserService.updateUser.mockResolvedValue(updatedUser);

      await userController.updateUser(req, res);

      expect(mockUserService.updateUser).toHaveBeenCalledWith("123", {
        nom: "Martin",
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: updatedUser,
        message: "Utilisateur mis à jour avec succès",
      });
    });

    it("devrait retourner 404 si utilisateur non trouvé pour mise à jour", async () => {
      const req = mockRequest();
      const res = mockResponse();
      req.params = { id: "123" };
      req.body = { nom: "Martin" };

      jest
        .spyOn(require("../utils/validation"), "validateUpdateUserData")
        .mockReturnValue({
          isValid: true,
          errors: [],
        });

      mockUserService.updateUser.mockResolvedValue(null);

      await userController.updateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: "Utilisateur non trouvé",
      });
    });
  });

  // Tests pour deleteUser
  describe("deleteUser", () => {
    it("devrait supprimer un utilisateur", async () => {
      const req = mockRequest();
      const res = mockResponse();
      req.params = { id: "123" };

      mockUserService.deleteUser.mockResolvedValue(true);

      await userController.deleteUser(req, res);

      expect(mockUserService.deleteUser).toHaveBeenCalledWith("123");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Utilisateur supprimé avec succès",
      });
    });

    it("devrait retourner 404 si utilisateur non trouvé pour suppression", async () => {
      const req = mockRequest();
      const res = mockResponse();
      req.params = { id: "123" };

      mockUserService.deleteUser.mockResolvedValue(false);

      await userController.deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: "Utilisateur non trouvé",
      });
    });

    it("devrait retourner 400 si ID manquant pour suppression", async () => {
      const req = mockRequest();
      const res = mockResponse();
      req.params = {}; // Pas d'ID

      await userController.deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: "ID utilisateur requis",
      });
    });
  });
});
