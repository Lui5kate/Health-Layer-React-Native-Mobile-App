// Menús del plan nutricional de Laura Angelica Coyote Cadena
// Nutriólogo: César Méndez - Cédula: 11859972
// Datos extraídos del PDF proporcionado

export type MealType = 'breakfast' | 'lunch' | 'dinner';

export interface Ingredient {
  name: string;
  quantity: string;
  category: 'protein' | 'vegetable' | 'carb' | 'fruit' | 'fat' | 'sauce' | 'other';
}

export interface Meal {
  id: string;
  name: string;
  type: MealType;
  week: number;
  ingredients: Ingredient[];
  notes?: string;
}

export const meals: Meal[] = [
  // ─── SEMANA 1 ── DESAYUNOS ────────────────────────────────────────────────
  {
    id: 'w1-b1',
    name: 'Omelette mexicano con frijoles',
    type: 'breakfast',
    week: 1,
    ingredients: [
      { name: 'Huevo entero', quantity: '2 pzas', category: 'protein' },
      { name: 'Jitomate picado', quantity: '¼ taza', category: 'vegetable' },
      { name: 'Cebolla cocida', quantity: '2 cdas', category: 'vegetable' },
      { name: 'Espinaca picada', quantity: '¼ taza', category: 'vegetable' },
      { name: 'Aceite de oliva', quantity: '1 cdita', category: 'fat' },
      { name: 'Frijoles de olla', quantity: '½ taza', category: 'carb' },
      { name: 'Tortillas de maíz', quantity: '2 pzas', category: 'carb' },
      { name: 'Papaya', quantity: '1 taza', category: 'fruit' },
    ],
    notes: 'Todo cocido, sin exceso de aceite',
  },
  {
    id: 'w1-b2',
    name: 'Molletes ligeros con pico de gallo',
    type: 'breakfast',
    week: 1,
    ingredients: [
      { name: 'Queso panela', quantity: '60 g', category: 'protein' },
      { name: 'Bolillo integral chico (sin migajón)', quantity: '1 pza', category: 'carb' },
      { name: 'Frijoles machacados', quantity: '⅓ taza', category: 'carb' },
      { name: 'Jitomate', quantity: '¼ taza', category: 'vegetable' },
      { name: 'Cebolla', quantity: '2 cdas', category: 'vegetable' },
      { name: 'Cilantro', quantity: '1 cda', category: 'vegetable' },
      { name: 'Melón', quantity: '1 taza', category: 'fruit' },
    ],
  },
  {
    id: 'w1-b3',
    name: 'Tacos de huevo con nopales',
    type: 'breakfast',
    week: 1,
    ingredients: [
      { name: 'Huevo entero', quantity: '2 pzas', category: 'protein' },
      { name: 'Nopales cocidos', quantity: '½ taza', category: 'vegetable' },
      { name: 'Cebolla cocida', quantity: '2 cdas', category: 'vegetable' },
      { name: 'Pimiento', quantity: '¼ taza', category: 'vegetable' },
      { name: 'Aceite', quantity: '1 cdita', category: 'fat' },
      { name: 'Tortillas', quantity: '2 pzas', category: 'carb' },
      { name: 'Frijoles', quantity: '½ taza', category: 'carb' },
      { name: 'Manzana mediana', quantity: '1 pza', category: 'fruit' },
    ],
  },

  // ─── SEMANA 1 ── COMIDAS ──────────────────────────────────────────────────
  {
    id: 'w1-l1',
    name: 'Pechuga asada con arroz y ensalada',
    type: 'lunch',
    week: 1,
    ingredients: [
      { name: 'Pechuga de pollo', quantity: '150 g', category: 'protein' },
      { name: 'Arroz cocido', quantity: '½ taza', category: 'carb' },
      { name: 'Lechuga', quantity: '1 taza', category: 'vegetable' },
      { name: 'Pepino', quantity: '½ taza', category: 'vegetable' },
      { name: 'Zanahoria rallada', quantity: '¼ taza', category: 'vegetable' },
      { name: 'Aceite de oliva', quantity: '1 cdita', category: 'fat' },
      { name: 'Frijoles', quantity: '½ taza', category: 'carb' },
    ],
    notes: 'Aderezo: aceite + limón',
  },
  {
    id: 'w1-l2',
    name: 'Carne de res magra en salsa verde',
    type: 'lunch',
    week: 1,
    ingredients: [
      { name: 'Res magra', quantity: '140 g', category: 'protein' },
      { name: 'Tortillas', quantity: '2 pzas', category: 'carb' },
      { name: 'Tomate verde', quantity: '½ taza', category: 'sauce' },
      { name: 'Calabacita', quantity: '¼ taza', category: 'vegetable' },
      { name: 'Cebolla', quantity: '2 cdas', category: 'vegetable' },
      { name: 'Arroz', quantity: '½ taza', category: 'carb' },
    ],
  },
  {
    id: 'w1-l3',
    name: 'Fajitas de pollo con verduras',
    type: 'lunch',
    week: 1,
    ingredients: [
      { name: 'Pollo', quantity: '150 g', category: 'protein' },
      { name: 'Pimiento', quantity: '½ taza', category: 'vegetable' },
      { name: 'Calabacita', quantity: '½ taza', category: 'vegetable' },
      { name: 'Champiñones', quantity: '¼ taza', category: 'vegetable' },
      { name: 'Aceite', quantity: '1 cdita', category: 'fat' },
      { name: 'Tortillas', quantity: '3 pzas', category: 'carb' },
    ],
  },

  // ─── SEMANA 1 ── CENAS ────────────────────────────────────────────────────
  {
    id: 'w1-d1',
    name: 'Ensalada de pollo',
    type: 'dinner',
    week: 1,
    ingredients: [
      { name: 'Pollo', quantity: '120 g', category: 'protein' },
      { name: 'Mezcla de hojas verdes', quantity: '1½ taza', category: 'vegetable' },
      { name: 'Pepino', quantity: '½ taza', category: 'vegetable' },
      { name: 'Zanahoria', quantity: '¼ taza', category: 'vegetable' },
      { name: 'Aceite', quantity: '1 cdita', category: 'fat' },
      { name: 'Tostadas horneadas', quantity: '2 pzas', category: 'carb' },
    ],
  },
  {
    id: 'w1-d2',
    name: 'Quesadillas con ensalada',
    type: 'dinner',
    week: 1,
    ingredients: [
      { name: 'Queso panela', quantity: '80 g', category: 'protein' },
      { name: 'Tortillas', quantity: '2 pzas', category: 'carb' },
      { name: 'Ensalada mixta', quantity: '1 taza', category: 'vegetable' },
      { name: 'Frijoles', quantity: '½ taza', category: 'carb' },
    ],
  },
  {
    id: 'w1-d3',
    name: 'Tostadas de tinga ligera',
    type: 'dinner',
    week: 1,
    ingredients: [
      { name: 'Pollo', quantity: '120 g', category: 'protein' },
      { name: 'Tostadas horneadas', quantity: '2 pzas', category: 'carb' },
      { name: 'Jitomate cocido', quantity: '¼ taza', category: 'sauce' },
      { name: 'Cebolla', quantity: '2 cdas', category: 'vegetable' },
      { name: 'Lechuga', quantity: '1 taza', category: 'vegetable' },
    ],
  },

  // ─── SEMANA 2 ── DESAYUNOS ────────────────────────────────────────────────
  {
    id: 'w2-b1',
    name: 'Huevos divorciados saludables',
    type: 'breakfast',
    week: 2,
    ingredients: [
      { name: 'Huevo entero', quantity: '2 pzas', category: 'protein' },
      { name: 'Jitomate cocido (salsa roja)', quantity: '½ taza', category: 'sauce' },
      { name: 'Tomate verde cocido (salsa verde)', quantity: '½ taza', category: 'sauce' },
      { name: 'Cebolla cocida', quantity: '2 cdas', category: 'vegetable' },
      { name: 'Cilantro', quantity: '¼ taza', category: 'vegetable' },
      { name: 'Tortillas de maíz', quantity: '2 pzas', category: 'carb' },
      { name: 'Frijoles de olla', quantity: '½ taza', category: 'carb' },
      { name: 'Nopales cocidos', quantity: '½ taza', category: 'vegetable' },
      { name: 'Sandía en cubos', quantity: '1 taza', category: 'fruit' },
      { name: 'Aceite de oliva', quantity: '1 cdita', category: 'fat' },
    ],
  },
  {
    id: 'w2-b2',
    name: 'Tostadas horneadas de frijol con huevo y nopales',
    type: 'breakfast',
    week: 2,
    ingredients: [
      { name: 'Tostadas horneadas', quantity: '2 pzas', category: 'carb' },
      { name: 'Frijoles machacados', quantity: '½ taza', category: 'carb' },
      { name: 'Huevo', quantity: '2 pzas', category: 'protein' },
      { name: 'Nopales cocidos', quantity: '¾ taza', category: 'vegetable' },
      { name: 'Jitomate picado', quantity: '¼ taza', category: 'vegetable' },
      { name: 'Cebolla cocida', quantity: '1 cda', category: 'vegetable' },
      { name: 'Cilantro', quantity: '1 cda', category: 'vegetable' },
      { name: 'Pera mediana', quantity: '1 pza', category: 'fruit' },
      { name: 'Aceite', quantity: '1 cdita', category: 'fat' },
    ],
  },
  {
    id: 'w2-b3',
    name: 'Burrito integral de huevo con verduras',
    type: 'breakfast',
    week: 2,
    ingredients: [
      { name: 'Tortilla integral grande', quantity: '1 pza', category: 'carb' },
      { name: 'Huevo entero', quantity: '2 pzas', category: 'protein' },
      { name: 'Pimiento en tiras', quantity: '½ taza', category: 'vegetable' },
      { name: 'Espinaca', quantity: '1 taza', category: 'vegetable' },
      { name: 'Cebolla cocida', quantity: '1 cda', category: 'vegetable' },
      { name: 'Champiñón', quantity: '½ taza', category: 'vegetable' },
      { name: 'Frijoles enteros', quantity: '⅓ taza', category: 'carb' },
      { name: 'Aceite de oliva', quantity: '1 cdita', category: 'fat' },
      { name: 'Piña en cubos', quantity: '1 taza', category: 'fruit' },
    ],
    notes: 'El champiñón es opcional',
  },

  // ─── SEMANA 2 ── COMIDAS ──────────────────────────────────────────────────
  {
    id: 'w2-l1',
    name: 'Albóndigas de res en chipotle con arroz',
    type: 'lunch',
    week: 2,
    ingredients: [
      { name: 'Carne molida de res magra 90-95%', quantity: '150 g', category: 'protein' },
      { name: 'Cebolla cocida finamente picada', quantity: '2 cdas', category: 'vegetable' },
      { name: 'Cilantro', quantity: '1 cda', category: 'vegetable' },
      { name: 'Ajo', quantity: '1 diente', category: 'vegetable' },
      { name: 'Jitomate (salsa chipotle)', quantity: '1 taza', category: 'sauce' },
      { name: 'Chile chipotle adobado', quantity: '1-2 cditas', category: 'sauce' },
      { name: 'Arroz cocido', quantity: '½ taza', category: 'carb' },
      { name: 'Lechuga', quantity: '1 taza', category: 'vegetable' },
      { name: 'Pepino', quantity: '½ taza', category: 'vegetable' },
      { name: 'Zanahoria rallada', quantity: '¼ taza', category: 'vegetable' },
      { name: 'Aceite de oliva', quantity: '1 cdita', category: 'fat' },
    ],
    notes: 'Aderezo ensalada: aceite + limón',
  },
  {
    id: 'w2-l2',
    name: 'Lomo de cerdo asado con puré de papa',
    type: 'lunch',
    week: 2,
    ingredients: [
      { name: 'Lomo de cerdo', quantity: '160 g', category: 'protein' },
      { name: 'Papa cocida', quantity: '¾ taza', category: 'carb' },
      { name: 'Calabacita', quantity: '½ taza', category: 'vegetable' },
      { name: 'Zanahoria', quantity: '½ taza', category: 'vegetable' },
      { name: 'Brócoli', quantity: '½ taza', category: 'vegetable' },
      { name: 'Aceite', quantity: '1 cdita', category: 'fat' },
    ],
    notes: 'Puré: usar agua de cocción en lugar de leche, aceite en lugar de mantequilla',
  },
  {
    id: 'w2-l3',
    name: 'Pechuga rellena de espinaca y panela',
    type: 'lunch',
    week: 2,
    ingredients: [
      { name: 'Pechuga de pollo', quantity: '160 g', category: 'protein' },
      { name: 'Espinaca cruda (relleno)', quantity: '1 taza', category: 'vegetable' },
      { name: 'Queso panela (relleno)', quantity: '50 g', category: 'protein' },
      { name: 'Arroz cocido', quantity: '½ taza', category: 'carb' },
      { name: 'Jitomate', quantity: '½ taza', category: 'vegetable' },
      { name: 'Pepino', quantity: '½ taza', category: 'vegetable' },
      { name: 'Lechuga', quantity: '1 taza', category: 'vegetable' },
      { name: 'Aceite de oliva', quantity: '1 cdita', category: 'fat' },
    ],
  },

  // ─── SEMANA 2 ── CENAS ────────────────────────────────────────────────────
  {
    id: 'w2-d1',
    name: 'Ensalada grande de pollo con tostadas',
    type: 'dinner',
    week: 2,
    ingredients: [
      { name: 'Pollo cocido/deshebrado', quantity: '120 g', category: 'protein' },
      { name: 'Mezcla de hojas verdes', quantity: '1½ taza', category: 'vegetable' },
      { name: 'Pepino', quantity: '½ taza', category: 'vegetable' },
      { name: 'Jitomate', quantity: '¼ taza', category: 'vegetable' },
      { name: 'Zanahoria', quantity: '¼ taza', category: 'vegetable' },
      { name: 'Aceite de oliva', quantity: '1 cdita', category: 'fat' },
      { name: 'Tostadas horneadas', quantity: '2 pzas', category: 'carb' },
    ],
  },
  {
    id: 'w2-d2',
    name: 'Sincronizadas ligeras con ensalada',
    type: 'dinner',
    week: 2,
    ingredients: [
      { name: 'Jamón de pavo', quantity: '2 rebanadas', category: 'protein' },
      { name: 'Queso panela', quantity: '60 g', category: 'protein' },
      { name: 'Tortillas de maíz', quantity: '2 pzas', category: 'carb' },
      { name: 'Lechuga', quantity: '1 taza', category: 'vegetable' },
      { name: 'Pepino', quantity: '½ taza', category: 'vegetable' },
    ],
    notes: 'Aderezo: limón + 1 cdita aceite',
  },
  {
    id: 'w2-d3',
    name: 'Caldo de pollo con verduras',
    type: 'dinner',
    week: 2,
    ingredients: [
      { name: 'Pollo (pierna sin piel o pechuga)', quantity: '130 g', category: 'protein' },
      { name: 'Calabacita', quantity: '1 taza', category: 'vegetable' },
      { name: 'Zanahoria', quantity: '½ taza', category: 'vegetable' },
      { name: 'Chayote o ejotes', quantity: '½ taza', category: 'vegetable' },
      { name: 'Tortillas de maíz', quantity: '2 pzas', category: 'carb' },
    ],
    notes: 'Caldo desgrasado, sin aceite añadido',
  },

  // ─── SEMANA 3 ── DESAYUNOS ────────────────────────────────────────────────
  {
    id: 'w3-b1',
    name: 'Huevos con rajas poblanas',
    type: 'breakfast',
    week: 3,
    ingredients: [
      { name: 'Huevo entero', quantity: '2 pzas', category: 'protein' },
      { name: 'Chile poblano en tiras', quantity: '½ taza', category: 'vegetable' },
      { name: 'Cebolla cocida', quantity: '2 cdas', category: 'vegetable' },
      { name: 'Calabacita en cubos', quantity: '½ taza', category: 'vegetable' },
      { name: 'Aceite de oliva', quantity: '1 cdita', category: 'fat' },
      { name: 'Frijoles de olla', quantity: '½ taza', category: 'carb' },
      { name: 'Tortillas de maíz', quantity: '2 pzas', category: 'carb' },
      { name: 'Mango en cubos', quantity: '1 taza', category: 'fruit' },
    ],
  },
  {
    id: 'w3-b2',
    name: 'Tacos de huevo con espinaca',
    type: 'breakfast',
    week: 3,
    ingredients: [
      { name: 'Huevo entero', quantity: '2 pzas', category: 'protein' },
      { name: 'Espinaca cruda', quantity: '1 taza', category: 'vegetable' },
      { name: 'Jitomate', quantity: '¼ taza', category: 'vegetable' },
      { name: 'Cebolla cocida', quantity: '1 cda', category: 'vegetable' },
      { name: 'Aceite', quantity: '1 cdita', category: 'fat' },
      { name: 'Tortillas', quantity: '2 pzas', category: 'carb' },
      { name: 'Frijoles enteros', quantity: '½ taza', category: 'carb' },
      { name: 'Melón', quantity: '1 taza', category: 'fruit' },
    ],
  },
  {
    id: 'w3-b3',
    name: 'Mollete integral con panela y pico de gallo',
    type: 'breakfast',
    week: 3,
    ingredients: [
      { name: 'Bolillo integral chico sin migajón', quantity: '1 pza', category: 'carb' },
      { name: 'Frijoles machacados', quantity: '½ taza', category: 'carb' },
      { name: 'Queso panela', quantity: '70 g', category: 'protein' },
      { name: 'Jitomate (pico de gallo)', quantity: '½ taza', category: 'vegetable' },
      { name: 'Cebolla cocida', quantity: '1 cda', category: 'vegetable' },
      { name: 'Cilantro', quantity: '1 cda', category: 'vegetable' },
      { name: 'Nopales cocidos', quantity: '½ taza', category: 'vegetable' },
      { name: 'Papaya', quantity: '1 taza', category: 'fruit' },
    ],
  },

  // ─── SEMANA 3 ── COMIDAS ──────────────────────────────────────────────────
  {
    id: 'w3-l1',
    name: 'Carne en salsa pasilla con arroz',
    type: 'lunch',
    week: 3,
    ingredients: [
      { name: 'Res magra en bistec', quantity: '160 g', category: 'protein' },
      { name: 'Chile pasilla hidratado', quantity: '1 pieza', category: 'sauce' },
      { name: 'Jitomate', quantity: '1 taza', category: 'sauce' },
      { name: 'Cebolla', quantity: '2 cdas', category: 'vegetable' },
      { name: 'Ajo', quantity: '1 diente', category: 'vegetable' },
      { name: 'Arroz cocido', quantity: '½ taza', category: 'carb' },
      { name: 'Lechuga', quantity: '1 taza', category: 'vegetable' },
      { name: 'Pepino', quantity: '½ taza', category: 'vegetable' },
      { name: 'Zanahoria', quantity: '¼ taza', category: 'vegetable' },
      { name: 'Aceite', quantity: '1 cdita', category: 'fat' },
    ],
  },
  {
    id: 'w3-l2',
    name: 'Pollo al limón con papa y verduras',
    type: 'lunch',
    week: 3,
    ingredients: [
      { name: 'Pechuga de pollo', quantity: '160 g', category: 'protein' },
      { name: 'Jugo de limón', quantity: '1 pieza', category: 'other' },
      { name: 'Ajo picado', quantity: 'al gusto', category: 'other' },
      { name: 'Papa cocida en cubos', quantity: '¾ taza', category: 'carb' },
      { name: 'Brócoli', quantity: '½ taza', category: 'vegetable' },
      { name: 'Calabacita', quantity: '½ taza', category: 'vegetable' },
      { name: 'Zanahoria', quantity: '½ taza', category: 'vegetable' },
      { name: 'Aceite', quantity: '2 cditas', category: 'fat' },
    ],
  },
  {
    id: 'w3-l3',
    name: 'Cerdo en salsa roja con tortillas',
    type: 'lunch',
    week: 3,
    ingredients: [
      { name: 'Lomo de cerdo', quantity: '160 g', category: 'protein' },
      { name: 'Jitomate (salsa roja)', quantity: '1 taza', category: 'sauce' },
      { name: 'Cebolla cocida', quantity: '2 cdas', category: 'vegetable' },
      { name: 'Chile guajillo', quantity: '1 pieza', category: 'sauce' },
      { name: 'Tortillas', quantity: '3 pzas', category: 'carb' },
      { name: 'Lechuga', quantity: '1 taza', category: 'vegetable' },
      { name: 'Pepino', quantity: '½ taza', category: 'vegetable' },
      { name: 'Jitomate', quantity: '¼ taza', category: 'vegetable' },
      { name: 'Aceite', quantity: '1 cdita', category: 'fat' },
    ],
  },

  // ─── SEMANA 3 ── CENAS ────────────────────────────────────────────────────
  {
    id: 'w3-d1',
    name: 'Ensalada de pollo con tostadas',
    type: 'dinner',
    week: 3,
    ingredients: [
      { name: 'Pollo deshebrado', quantity: '120 g', category: 'protein' },
      { name: 'Mezcla de hojas verdes', quantity: '1½ taza', category: 'vegetable' },
      { name: 'Pepino', quantity: '½ taza', category: 'vegetable' },
      { name: 'Jitomate', quantity: '¼ taza', category: 'vegetable' },
      { name: 'Aceite', quantity: '1 cdita', category: 'fat' },
      { name: 'Tostadas horneadas', quantity: '2 pzas', category: 'carb' },
    ],
  },
  {
    id: 'w3-d2',
    name: 'Quesadillas con ensalada',
    type: 'dinner',
    week: 3,
    ingredients: [
      { name: 'Queso panela', quantity: '80 g', category: 'protein' },
      { name: 'Tortillas', quantity: '2 pzas', category: 'carb' },
      { name: 'Lechuga', quantity: '1 taza', category: 'vegetable' },
      { name: 'Pepino', quantity: '½ taza', category: 'vegetable' },
    ],
  },
  {
    id: 'w3-d3',
    name: 'Rollos de jamón de pavo con ensalada',
    type: 'dinner',
    week: 3,
    ingredients: [
      { name: 'Jamón de pavo', quantity: '90 g', category: 'protein' },
      { name: 'Queso panela', quantity: '40 g', category: 'protein' },
      { name: 'Espinaca cruda', quantity: '1 taza', category: 'vegetable' },
      { name: 'Pepino', quantity: '½ taza', category: 'vegetable' },
      { name: 'Zanahoria', quantity: '¼ taza', category: 'vegetable' },
      { name: 'Aceite', quantity: '1 cdita', category: 'fat' },
      { name: 'Tortillas', quantity: '2 pzas', category: 'carb' },
    ],
  },

  // ─── SEMANA 4 ── DESAYUNOS ────────────────────────────────────────────────
  {
    id: 'w4-b1',
    name: 'Huevos con champiñones y naranja',
    type: 'breakfast',
    week: 4,
    ingredients: [
      { name: 'Huevo entero', quantity: '2 pzas', category: 'protein' },
      { name: 'Champiñones', quantity: '¾ taza', category: 'vegetable' },
      { name: 'Espinaca', quantity: '½ taza', category: 'vegetable' },
      { name: 'Cebolla cocida', quantity: '1 cda', category: 'vegetable' },
      { name: 'Aceite', quantity: '1 cdita', category: 'fat' },
      { name: 'Frijoles', quantity: '½ taza', category: 'carb' },
      { name: 'Tortillas', quantity: '2 pzas', category: 'carb' },
      { name: 'Naranja mediana', quantity: '1 pza', category: 'fruit' },
    ],
  },
  {
    id: 'w4-b2',
    name: 'Tacos de huevo con nopales y papaya',
    type: 'breakfast',
    week: 4,
    ingredients: [
      { name: 'Huevo entero', quantity: '2 pzas', category: 'protein' },
      { name: 'Claras de huevo', quantity: '100 g', category: 'protein' },
      { name: 'Nopales', quantity: '¾ taza', category: 'vegetable' },
      { name: 'Jitomate', quantity: '¼ taza', category: 'vegetable' },
      { name: 'Cebolla', quantity: '1 cda', category: 'vegetable' },
      { name: 'Aceite', quantity: '1 cdita', category: 'fat' },
      { name: 'Tortillas', quantity: '2 pzas', category: 'carb' },
      { name: 'Papaya', quantity: '1½ taza', category: 'fruit' },
    ],
  },
  {
    id: 'w4-b3',
    name: 'Tostadas de frijol con panela y piña',
    type: 'breakfast',
    week: 4,
    ingredients: [
      { name: 'Tostadas horneadas', quantity: '2 pzas', category: 'carb' },
      { name: 'Frijoles', quantity: '½ taza', category: 'carb' },
      { name: 'Queso panela', quantity: '80 g', category: 'protein' },
      { name: 'Pico de gallo', quantity: '½ taza', category: 'vegetable' },
      { name: 'Pepino en rodajas', quantity: '½ taza', category: 'vegetable' },
      { name: 'Piña', quantity: '1 taza', category: 'fruit' },
    ],
  },

  // ─── SEMANA 4 ── COMIDAS ──────────────────────────────────────────────────
  {
    id: 'w4-l1',
    name: 'Pollo en salsa de tomate con arroz',
    type: 'lunch',
    week: 4,
    ingredients: [
      { name: 'Pechuga de pollo', quantity: '160 g', category: 'protein' },
      { name: 'Jitomate (salsa)', quantity: '1 taza', category: 'sauce' },
      { name: 'Cebolla', quantity: '2 cdas', category: 'vegetable' },
      { name: 'Ajo', quantity: '1 diente', category: 'vegetable' },
      { name: 'Arroz', quantity: '½ taza', category: 'carb' },
      { name: 'Lechuga', quantity: '1 taza', category: 'vegetable' },
      { name: 'Pepino', quantity: '½ taza', category: 'vegetable' },
      { name: 'Zanahoria', quantity: '¼ taza', category: 'vegetable' },
      { name: 'Aceite', quantity: '1 cdita', category: 'fat' },
    ],
  },
  {
    id: 'w4-l2',
    name: 'Res a la mexicana con tortillas',
    type: 'lunch',
    week: 4,
    ingredients: [
      { name: 'Res magra', quantity: '160 g', category: 'protein' },
      { name: 'Jitomate', quantity: '½ taza', category: 'vegetable' },
      { name: 'Cebolla cocida', quantity: '2 cdas', category: 'vegetable' },
      { name: 'Chile serrano', quantity: 'opcional', category: 'vegetable' },
      { name: 'Calabacita', quantity: '½ taza', category: 'vegetable' },
      { name: 'Tortillas', quantity: '3 pzas', category: 'carb' },
      { name: 'Frijoles', quantity: '½ taza', category: 'carb' },
      { name: 'Aceite', quantity: '1 cdita', category: 'fat' },
    ],
  },
  {
    id: 'w4-l3',
    name: 'Lomo en salsa verde con calabacitas',
    type: 'lunch',
    week: 4,
    ingredients: [
      { name: 'Lomo de cerdo', quantity: '160 g', category: 'protein' },
      { name: 'Tomate verde', quantity: '1 taza', category: 'sauce' },
      { name: 'Cebolla', quantity: '2 cdas', category: 'vegetable' },
      { name: 'Cilantro', quantity: '1 cda', category: 'vegetable' },
      { name: 'Calabacita', quantity: '1 taza', category: 'vegetable' },
      { name: 'Arroz', quantity: '½ taza', category: 'carb' },
      { name: 'Aceite', quantity: '1 cdita', category: 'fat' },
    ],
  },

  // ─── SEMANA 4 ── CENAS ────────────────────────────────────────────────────
  {
    id: 'w4-d1',
    name: 'Ensalada templada de pollo',
    type: 'dinner',
    week: 4,
    ingredients: [
      { name: 'Pollo', quantity: '120 g', category: 'protein' },
      { name: 'Espinaca', quantity: '1 taza', category: 'vegetable' },
      { name: 'Champiñón', quantity: '½ taza', category: 'vegetable' },
      { name: 'Pepino', quantity: '½ taza', category: 'vegetable' },
      { name: 'Aceite', quantity: '1 cdita', category: 'fat' },
      { name: 'Tostadas horneadas', quantity: '2 pzas', category: 'carb' },
    ],
  },
  {
    id: 'w4-d2',
    name: 'Quesadillas de panela con ensalada',
    type: 'dinner',
    week: 4,
    ingredients: [
      { name: 'Queso panela', quantity: '80 g', category: 'protein' },
      { name: 'Tortillas', quantity: '2 pzas', category: 'carb' },
      { name: 'Lechuga', quantity: '1 taza', category: 'vegetable' },
      { name: 'Pepino', quantity: '½ taza', category: 'vegetable' },
      { name: 'Jitomate', quantity: '¼ taza', category: 'vegetable' },
      { name: 'Frijoles (si ese día fue bajo en carbohidrato)', quantity: '⅓ taza', category: 'carb' },
    ],
    notes: 'Los frijoles son opcionales según el consumo de carbohidratos del día',
  },
  {
    id: 'w4-d3',
    name: 'Caldo de res con verduras',
    type: 'dinner',
    week: 4,
    ingredients: [
      { name: 'Res magra', quantity: '130 g', category: 'protein' },
      { name: 'Calabacita', quantity: '1 taza', category: 'vegetable' },
      { name: 'Zanahoria', quantity: '½ taza', category: 'vegetable' },
      { name: 'Chayote o ejotes', quantity: '½ taza', category: 'vegetable' },
      { name: 'Tortillas', quantity: '2 pzas', category: 'carb' },
    ],
  },
];

// Helper: obtener comidas por semana y tipo
export function getMealsByWeekAndType(week: number, type: MealType): Meal[] {
  return meals.filter((m) => m.week === week && m.type === type);
}

// Helper: generar lista de compras para un conjunto de comidas
export function generateShoppingList(selectedMealIds: string[]): Record<string, Ingredient[]> {
  const selectedMeals = meals.filter((m) => selectedMealIds.includes(m.id));
  const allIngredients = selectedMeals.flatMap((m) => m.ingredients);

  const grouped: Record<string, Ingredient[]> = {};
  allIngredients.forEach((ing) => {
    if (!grouped[ing.category]) grouped[ing.category] = [];
    // Evitar duplicados exactos
    const exists = grouped[ing.category].some((i) => i.name === ing.name);
    if (!exists) grouped[ing.category].push(ing);
  });

  return grouped;
}

export const categoryLabels: Record<string, string> = {
  protein: '🥩 Proteínas',
  vegetable: '🥦 Verduras',
  carb: '🌽 Carbohidratos',
  fruit: '🍎 Frutas',
  fat: '🫒 Grasas',
  sauce: '🍅 Salsas y condimentos',
  other: '🧂 Otros',
};
