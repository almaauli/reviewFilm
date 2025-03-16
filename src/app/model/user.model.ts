export interface User {
  id_user: number;
  nama: string;
  usia: string;  // Perhatikan! Di DB, usia itu varchar, bukan number
  email: string;
  password: string;
  role: 'user' | 'author' | 'admin';  // Enum sesuai database
  profile: string;
  created_at: string;
  updated_at: string;
  watchlist?: string;  // Bisa `null`, jadi tambahkan `?`
}
