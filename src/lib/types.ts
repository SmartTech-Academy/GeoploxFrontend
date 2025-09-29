export interface UserProfile {
  codec: string;
  username: string;
  email_address: string;
  firstname: string;
  lastname: string;
  phone_number: string;
  whatsapp_number: string | null;
  user_role: 'admin' | 'developer' | 'owner' | 'account_officer' | 'content_manager' | 'agent' | 'client';
  onboarding_status: string;
  country: string;
  state: string | null;
  local_gov_area: string | null;
  home_address: string | null;
  facebook: string | null;
  instagram: string | null;
  x: string | null;
  linkedin: string | null;
  display_picture_url: string;
  government_id_doc_url: string;
  bio: string | null;
  business: Business | null;
  email_verified: boolean;
  email_verification_date: string;
  entity_creation_date: string;
}

export interface Business {
  id: string;
  name: string;
  email: string;
  phone: string;
  whatsapp: string | null;
  instagram: string | null;
  website: string | null;
  address: string;
  state: string;
  lga: string;
  logo_url: string;
  cac: string;
  created_at: string;
}
