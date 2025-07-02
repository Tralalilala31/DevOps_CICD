export interface Member {
  data(data: any): unknown;
  id: number;
  nom: string;
  prenom: string;
  email: string;
}
