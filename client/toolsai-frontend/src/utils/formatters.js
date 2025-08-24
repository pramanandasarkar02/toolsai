export const formatPricing = (model) => {
  if (model.pricingType === 'FREE') return 'Free';
  if (model.pricingType === 'FREEMIUM') return 'Freemium';
  if (model.modelPrice) {
    return `$${model.modelPrice}${model.pricingUnit ? ` ${model.pricingUnit}` : ''}`;
  }
  return model.pricingType;
};

export const formatCategory = (category) => {
  return category?.replace(/_/g, ' ') || 'Unknown';
};

export const formatRating = (rating) => {
  return rating ? Number(rating).toFixed(1) : 'N/A';
};
