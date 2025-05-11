export interface User {
  id?: number;
  nom: string;
  prenom: string;
  email: string;
  dateNaissance: string;
  telephone: string;
  adresse: string;
  genre: 'homme' | 'femme' | 'autre';
  photo: string;
  statut: string;
  situation_familliale: string;
  role: 'admin' | 'coach' | 'coache';
  email_verified_at?: string;
}

export interface Resource {
  id: number;
  titre: string;
  type: 'pdf' | 'video' | 'audio' | 'image';
  url: string;
  estPremium: boolean;
  is_individual: boolean;
  prix: number | null;
  photo: string | null;
  created_at: string;
  updated_at: string;
}

export interface Plan {
  id: number;
  titre: string;
  description: string;
  prix: number;
  duree: number;
  categorie_id: number;
  ressources?: Resource[];
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface ResourceState {
  resources: Resource[];
  selectedResource: Resource | null;
  isLoading: boolean;
  error: string | null;
}

export interface PlanState {
  plans: Plan[];
  selectedPlan: Plan | null;
  isLoading: boolean;
  error: string | null;
}