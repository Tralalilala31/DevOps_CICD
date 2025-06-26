export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPassword = (password: string): boolean => {
  // Validation basique : minimum 6 caractères
  return Boolean(password && password.length >= 6);
};

export const isValidName = (name: string): boolean => {
  return Boolean(name && name.trim().length >= 2);
};

export const validateUserData = (
  data: any
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Validation du nom
  if (!isValidName(data.name)) {
    errors.push("Le nom doit contenir au moins 2 caractères");
  }

  // Validation de l'email
  if (!isValidEmail(data.email)) {
    errors.push("Email invalide");
  }

  // Validation du mot de passe
  if (!isValidPassword(data.password)) {
    errors.push("Le mot de passe doit contenir au moins 6 caractères");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateUpdateUserData = (
  data: any
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Validation conditionnelle (seulement si les champs sont fournis)
  if (data.name && !isValidName(data.name)) {
    errors.push("Le nom doit contenir au moins 2 caractères");
  }

  if (data.email && !isValidEmail(data.email)) {
    errors.push("Email invalide");
  }

  if (data.password && !isValidPassword(data.password)) {
    errors.push("Le mot de passe doit contenir au moins 6 caractères");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
