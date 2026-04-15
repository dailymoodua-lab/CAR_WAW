'use strict';

const DETAIL_LABELS = {
  fuel: ['Паливо'],
  engine: ['Двигун'],
  drive: ['Привід'],
  color: ['Колір'],
  damage: ['Пошкодження'],
  docs: ['Розмитнення', 'Документи'],
  bodyType: ['Тип кузова', 'Кузов'],
  transmission: ['Коробка передач', 'Коробка', 'Тип КПП'],
  origin: ['Походження'],
  location: ['Знаходиться в місті', 'Місто']
};

const CARD_PATTERNS = {
  detailHref: /(?:href=")?(\/store\/instoreusers\/(\d+))(?:")?/g,
  price: /(\d[\d\s]{1,12})\s*\$/i,
  mileage: /(\d+(?:[\s.,]\d+)?)\s*(тис\.)?\s*км/i,
  engine: /(\d(?:[.,]\d)?)\s*л/i,
  year: /\b(20\d{2}|19\d{2})\b/,
  vin: /\b[A-HJ-NPR-Z0-9]{17}\b/
};

module.exports = {
  DETAIL_LABELS,
  CARD_PATTERNS
};
