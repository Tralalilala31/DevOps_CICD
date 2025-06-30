export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidNom = (nom: string): boolean => {
  return Boolean(nom && nom.trim().length >= 2);
};

export const isValidPrenom = (prenom: string): boolean => {
  return Boolean(prenom && prenom.trim().length >= 2);
};

export const validateUserData = (
  data: any
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Validation du nom
  if (!isValidNom(data.nom)) {
    errors.push("Le nom doit contenir au moins 2 caractères");
  }

  // Validation du prénom
  if (!isValidPrenom(data.prenom)) {
    errors.push("Le prénom doit contenir au moins 2 caractères");
  }

  // Validation de l'email
  if (!isValidEmail(data.email)) {
    errors.push("Email invalide");
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
  if (data.nom && !isValidNom(data.nom)) {
    errors.push("Le nom doit contenir au moins 2 caractères");
  }

  if (data.prenom && !isValidPrenom(data.prenom)) {
    errors.push("Le prénom doit contenir au moins 2 caractères");
  }

  if (data.email && !isValidEmail(data.email)) {
    errors.push("Email invalide");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
