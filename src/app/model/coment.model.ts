export interface Komentar {
    id_komentar: number;
    id_film: number;
    id_user: number;
    rating_user: '1' | '2' | '3' | '4' | '5';
    komentar: string;
    created_at: string;
    updated_at: string;
  }
  