
export interface MigrationStep {
  id: string;
  title: string;
  description: string;
  category: 'Backend' | 'Frontend' | 'DevOps' | 'Auth';
  content: string;
  codeSnippets?: Array<{
    language: string;
    label: string;
    code: string;
  }>;
}

export interface AiPromptResponse {
  conversion: string;
  explanation: string;
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: string;
  views: number;
  status: 'online' | 'offline';
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  category: string;
  date: string;
  imageUrl?: string;
}

export interface PropertyItem {
  id: string;
  thumbnail?: string;
  houseNumber: string;
  street: string;
  district: string;
  ward: string;
  price: number;
  area: number;
  width: number;
  length: number;
  info: string;
  status: 'new' | 'in_transaction' | 'stopped' | 'transacted' | 'deposited' | 'rental_contract' | 'auction';
  fengShui: 'dong_tu_trach' | 'tay_tu_trach';
  isApproved: boolean;
  updatedAt: string;
  lotNumber: string;
  sheetNumber: string;
}

export type ViewType = 'dashboard' | 'news' | 'property_data' | 'favorites' | 'planning_map' | 'sales_directory' | 'loan_check' | 'migration' | 'email_marketing' | 'website_marketing' | 'zalo_marketing';
