import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import { UserRole } from "../types/user";

// Interface pour les attributs du modèle User
interface UserAttributes {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface pour la création d'un User (id est généré automatiquement)
interface UserCreationAttributes
  extends Optional<UserAttributes, "id" | "role" | "createdAt" | "updatedAt"> {}

// Classe du modèle User
class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: string;
  public name!: string;
  public email!: string;
  public password!: string;
  public role!: UserRole;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Méthode pour convertir en UserResponse (sans password)
  public toResponse() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      role: this.role,
      createdAt: this.createdAt,
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
    name: {
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
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [6, 255],
      },
    },
    role: {
      type: DataTypes.ENUM(...Object.values(UserRole)),
      allowNull: false,
      defaultValue: UserRole.USER,
      validate: {
        isIn: [Object.values(UserRole)],
      },
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: true,
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
