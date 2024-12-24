export const COLORS = {
  white: "#FFFFFF",
  black: "#000000",
  purple: "#00ff89",
  cyan: "#1DCFFF",
  darkPurple: "#5541ff",
  bluePurple: "#1A52FD",
  lightPurple: "#E6E6FA",
};

interface MockupType {
  value: string;
  label: string;
  icon: string;
}

export const mockupTypes: MockupType[] = [
  { value: 'logo', label: 'Logo Design', icon: '🎨' },
  { value: 'website', label: 'Website Mockup', icon: '🖥️' },
  { value: 'mobile-app', label: 'Mobile App Mockup', icon: '📱' },
  { value: 'business-card', label: 'Business Card Mockup', icon: '💼' },
  { value: 'social-media', label: 'Social Media Post', icon: '📷' },
];

// Interface para definir o formato de cada item de análise de consistência
interface ConsistencyCheck {
  criteria: string;
  status: 'Needs Adjustment' | 'Consistent';
  recommendation: string;
}

// Tipo para as chaves dos diferentes tipos de mockup
type MockupTypeKey = 'logo' | 'website' | 'mobile-app' | 'business-card' | 'social-media';

// Definição dos critérios de consistência para cada tipo de mockup
const consistencyChecks: Record<MockupTypeKey, string[]> = {
  logo: ['Color usage', 'Proportions', 'Clear space', 'Minimum size'],
  website: ['Color scheme', 'Typography', 'Layout consistency', 'Responsive design'],
  'mobile-app': ['Icon design', 'UI elements', 'Navigation style', 'Color scheme'],
  'business-card': ['Logo placement', 'Typography', 'Color usage', 'Information hierarchy'],
  'social-media': ['Image style', 'Font usage', 'Color palette', 'Logo placement'],
};

// Função para gerar o relatório de consistência da marca
export const generateBrandConsistencyReport = (type: MockupTypeKey): ConsistencyCheck[] => {
  return consistencyChecks[type].map((check) => ({
    criteria: check,
    status: Math.random() > 0.8 ? 'Needs Adjustment' : 'Consistent',
    recommendation:
      Math.random() > 0.8
        ? 'Adjust to align with brand guidelines. Consider reviewing the specific color palette and typography rules in the brand guidebook.'
        : 'Maintains brand consistency. Keep up the good work and ensure this element remains consistent across all designs.',
  }));
};
