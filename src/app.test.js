// Use require instead of import for Windows compatibility
const { filterProperties, addToFavourites, encodeHTML } = require('./utils/helpers');

const mockData = [
  { id: 1, type: 'House', price: 300000 },
  { id: 2, type: 'Flat', price: 150000 }
];

describe('Nestora Core Logic Tests', () => {
  test('Filters by type correctly', () => {
    const results = filterProperties(mockData, { type: 'Flat' });
    expect(results).toHaveLength(1);
  });

  test('Filters by price range correctly', () => {
    const results = filterProperties(mockData, { type: 'any', minPrice: 200000, maxPrice: 400000 });
    expect(results).toHaveLength(1);
  });

  test('Adds to favourites correctly', () => {
    const list = addToFavourites([], { id: 1 });
    expect(list).toHaveLength(1);
  });

  test('Prevents duplicate favourites', () => {
    const list = [{ id: 1 }];
    const updated = addToFavourites(list, { id: 1 });
    expect(updated).toHaveLength(1);
  });

  test('Encodes HTML to prevent XSS', () => {
    expect(encodeHTML("<script>")).toBe("&lt;script&gt;");
  });
});