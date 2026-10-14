const peso = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 2 });
const pesoWhole = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 0 });

export const money = (value) => peso.format(Number(value) || 0);
export const moneyWhole = (value) => pesoWhole.format(Number(value) || 0);
