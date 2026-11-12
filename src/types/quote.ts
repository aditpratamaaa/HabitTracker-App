/**
 * Model Data untuk entitas Kutipan (Quote) dari External Public REST API
 * Endpoint: https://dummyjson.com/quotes/random atau https://dummyjson.com/quotes
 */
export interface Quote {
  id: number;
  quote: string;
  author: string;
}

/**
 * Struktur response daftar kutipan dari endpoint paginasi DummyJSON Quotes API
 */
export interface QuotesResponse {
  quotes: Quote[];
  total: number;
  skip: number;
  limit: number;
}

