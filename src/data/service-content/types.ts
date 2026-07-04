export type ServiceContent = {
  title: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  intro: string;
  sections: {
    title: string;
    paragraphs: string[];
  }[];
  benefits: string[];
};
