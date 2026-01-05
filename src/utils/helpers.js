// Logic for Search, Favourites, and Security
const filterProperties = (properties, criteria) => {
  return properties.filter(prop => {
    const matchesType = criteria.type === 'any' || prop.type === criteria.type;
    const matchesPrice = prop.price >= (criteria.minPrice || 0) && prop.price <= (criteria.maxPrice || Infinity);
    return matchesType && matchesPrice;
  });
};

const addToFavourites = (list, property) => {
  if (list.some(item => item.id === property.id)) return list;
  return [...list, property];
};

const encodeHTML = (str) => {
  if (!str) return "";
  return str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
};

module.exports = { filterProperties, addToFavourites, encodeHTML };