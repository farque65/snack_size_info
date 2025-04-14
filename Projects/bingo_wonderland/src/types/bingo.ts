export interface BingoCard {
  id: number;
  cells: string[];
}

export interface BingoSettings {
  customItems: string[];
  numberOfCards: number;
  customMessage: string;
  cardsPerPage: number;
  templateBackground: string;
  customTemplateUrl?: string;
}

export interface TemplateBackground {
  id: string;
  name: string;
  url: string;
  category: string;
}

export interface CustomTemplate {
  id: string;
  name: string;
  url: string;
}