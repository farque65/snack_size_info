import { TemplateBackground } from '../types/bingo';

export const defaultTemplates: TemplateBackground[] = [
  {
    id: 'christmas',
    name: 'Christmas',
    url: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?q=80&w=1000&auto=format&fit=crop',
    category: 'holiday'
  },
  {
    id: 'easter',
    name: 'Easter',
url:'https://zejhnsohrpaxwbnuuche.supabase.co/storage/v1/object/public/images/uoth4s6n5gk.png',
    category: 'holiday'
  },
  {
    id: 'baby-shower',
    name: 'Baby Shower',
    url: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=1000&auto=format&fit=crop',
    category: 'celebration'
  },
  {
    id: 'wedding',
    name: 'Wedding',
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000&auto=format&fit=crop',
    category: 'celebration'
  },
  {
    id: 'none',
    name: 'None',
    url: 'https://zejhnsohrpaxwbnuuche.supabase.co/storage/v1/object/public/images/qpjpfpcan5n.png',
    category: 'basic'
  }
];

export const getTemplateById = (id: string): TemplateBackground | undefined => {
  return defaultTemplates.find(template => template.id === id);
};

export const getTemplateCategories = (): string[] => {
  const categories = new Set(defaultTemplates.map(template => template.category));
  return Array.from(categories);
};

export const getTemplatesByCategory = (category: string): TemplateBackground[] => {
  return defaultTemplates.filter(template => template.category === category);
};