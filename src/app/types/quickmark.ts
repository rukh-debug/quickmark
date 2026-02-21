export interface QuickMark {
  id: string;
  title: string;
  url: string;
  shadowColor: string;
  pinned?: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface QuickMarkFormData {
  title: string;
  url: string;
  shadowColor: string;
}
