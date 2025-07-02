export interface Card {
  id: string;
  description: string;
  categorie: string;
}

export interface CreateCardDto {
  description: string;
  categorie: string;
}

export interface UpdateCardDto {
  description?: string;
  categorie?: string;
}

export interface CardResponse {
  id: string;
  description: string;
  categorie: string;
}

export interface CardsListResponse {
  cards: CardResponse[];
  total: number;
  limit?: number | undefined;
}
