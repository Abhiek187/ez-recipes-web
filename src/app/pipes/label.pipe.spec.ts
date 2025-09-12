import { RecipeSortField } from '../models/recipe-filter.model';
import { LabelPipe } from './label.pipe';

describe('LabelPipe', () => {
  let pipe: LabelPipe;

  beforeEach(() => {
    pipe = new LabelPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  (
    [
      ['calories', 'Calories'],
      ['health-score', 'Health Score'],
      ['ratings', 'Ratings'],
      ['views', 'Views'],
    ] as [RecipeSortField, string][]
  ).forEach(([sortField, expectedLabel]) => {
    it(`converts ${sortField} to the label ${expectedLabel}`, () => {
      const actualLabel = pipe.transform(sortField);
      expect(actualLabel).toBe(expectedLabel);
    });
  });
});
