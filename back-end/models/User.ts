import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import { User as UserInterface } from "../types/user";

// Interface pour la création d'un User (id est généré automatiquement)
interface UserCreationAttributes extends Optional<UserInterface, "id"> {}

// Classe du modèle User
class User
  extends Model<UserInterface, UserCreationAttributes>
  implements UserInterface
{
  public id!: string;
  public nom!: string;
  public prenom!: string;
  public email!: string;

  // Méthode pour convertir en UserResponse
  public toResponse() {
    return {
      id: this.id,
      nom: this.nom,
      prenom: this.prenom,
      email: this.email,
    };
  }
}

// Définition du modèle
User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    nom: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 100],
      },
    },
    prenom: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 100],
      },
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        notEmpty: true,
      },
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["email"],
      },
    ],
    hooks: {
      // Hook pour s'assurer que l'email est en minuscules
      beforeCreate: (user: User) => {
        user.email = user.email.toLowerCase();
      },
      beforeUpdate: (user: User) => {
        if (user.email) {
          user.email = user.email.toLowerCase();
        }
      },
    },
  }
);

export default User;
