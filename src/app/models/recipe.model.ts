export type Recipe = {
  id: number;
  name: string;
  url: string;
  image: string;
  credit: string;
  sourceUrl: string;
  healthScore: number;
  time: number;
  servings: number;
  summary: string;
  nutrients: {
    calories: {
      amount?: number;
      unit?: string;
    };
    fats: {
      amount?: number;
      unit?: string;
    };
    saturatedFats: {
      amount?: number;
      unit?: string;
    };
    carbs: {
      amount?: number;
      unit?: string;
    };
    fiber: {
      amount?: number;
      unit?: string;
    };
    sugars: {
      amount?: number;
      unit?: string;
    };
    protein: {
      amount?: number;
      unit?: string;
    };
    cholesterol: {
      amount?: number;
      unit?: string;
    };
    sodium: {
      amount?: number;
      unit?: string;
    };
  };
  ingredients: {
    id: number;
    name: string;
    amount: number;
    unit: string;
  }[];
  instructions: {
    name: string;
    steps: {
      number: number;
      step: string;
      ingredients: {
        id: number;
        name: string;
        image: string;
      }[];
      equipment: {
        id: number;
        name: string;
        image: string;
      }[];
    }[];
  }[];
};
