/**
 * Filter properties based on search criteria
 */
export function filterProperties(properties, criteria) {
  if (!Array.isArray(properties)) return [];
  
  return properties.filter((property) => {
    const matchesType =
      !criteria.propertyType ||
      criteria.propertyType === "Any" ||
      property.type.toLowerCase() === criteria.propertyType.toLowerCase();

    const matchesMinPrice =
      !criteria.minPrice || 
      property.price >= parseInt(criteria.minPrice, 10);
    const matchesMaxPrice =
      !criteria.maxPrice || 
      property.price <= parseInt(criteria.maxPrice, 10);

    const matchesMinBedrooms =
      !criteria.minBedrooms || 
      property.bedrooms >= parseInt(criteria.minBedrooms, 10);
    const matchesMaxBedrooms =
      !criteria.maxBedrooms || 
      property.bedrooms <= parseInt(criteria.maxBedrooms, 10);

    const matchesAddedMonth =
      !criteria.addedMonth || 
      property.added.month.toLowerCase() === criteria.addedMonth.toLowerCase();
    const matchesAddedYear =
      !criteria.addedYear || 
      property.added.year.toString() === criteria.addedYear.toString();

    const matchesPostcode =
      !criteria.postcode ||
      property.location.toLowerCase().includes(criteria.postcode.toLowerCase());

    return (
      matchesType &&
      matchesMinPrice &&
      matchesMaxPrice &&
      matchesMinBedrooms &&
      matchesMaxBedrooms &&
      matchesAddedMonth &&
      matchesAddedYear &&
      matchesPostcode
    );
  });
}