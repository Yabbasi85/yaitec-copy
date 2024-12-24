export type MockupType = 'logo' | 'website' | 'mobile-app' | 'business-card' | 'social-media';

export const generateBrandConsistencyReport = (type: MockupType) => {
  const consistencyChecks: Record<MockupType, string[]> = {
    logo: ['Color usage', 'Proportions', 'Clear space', 'Minimum size'],
    website: ['Color scheme', 'Typography', 'Layout consistency', 'Responsive design'],
    'mobile-app': ['Icon design', 'UI elements', 'Navigation style', 'Color scheme'],
    'business-card': ['Logo placement', 'Typography', 'Color usage', 'Information hierarchy'],
    'social-media': ['Image style', 'Font usage', 'Color palette', 'Logo placement'],
  };

  return consistencyChecks[type].map((check) => ({
    criteria: check,
    status: Math.random() > 0.8 ? 'Needs Adjustment' : 'Consistent',
    recommendation: Math.random() > 0.8 
      ? 'Adjust to align with brand guidelines. Consider reviewing the specific color palette and typography rules in the brand guidebook.'
      : 'Maintains brand consistency. Keep up the good work and ensure this element remains consistent across all designs.',
  }));
};

export const generateMockup = async (type: MockupType) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 2000));

  return {
    id: Date.now(),
    type,
    imageUrl: `https://via.placeholder.com/800x600.png?text=${type.replace('-', ' ')} Mockup`,
    consistencyReport: generateBrandConsistencyReport(type),
  };
};
