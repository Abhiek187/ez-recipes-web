export type Recipe = {
  id: number;
  name: string;
  url: string;
  image: string;
  credit: string | null;
  sourceUrl: string;
  healthScore: number;
  time: number;
  servings: number;
  summary: string;
  nutrients: {
    name: string;
    amount: number;
    unit: string;
  }[];
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
