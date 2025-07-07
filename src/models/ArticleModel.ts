export interface ArticleModel {
  id: number;
  slug: string;
  title: string;
  sectionTitle: string;
  content: string;
  imageUrl: string;
  createdAt:string;
  updatedAt: string;
  published: boolean;
  category: string
};
