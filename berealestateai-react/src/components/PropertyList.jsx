import React from "react";
import PropertyCard from "./PropertyCard";

const properties = [
  {
    title: "2BHK Apartment in Kochi",
    location: "Kakkanad, Kochi",
    price: 5800000,
    type: "Apartment",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    bedrooms: 2,
    bathrooms: 2,
    area: 1100,
    link: "/property/1",
  },
  {
    title: "Luxury Villa with Pool",
    location: "Trivandrum",
    price: 12000000,
    type: "Villa",
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be",
    bedrooms: 4,
    bathrooms: 3,
    area: 2500,
    link: "/property/2",
  },
  {
    title: "Premium Plot for Sale",
    location: "Calicut",
    price: 3800000,
    type: "Plot",
    image: "https://images.unsplash.com/photo-1599420186946-7b1cf394f2e9",
    bedrooms: 0,
    bathrooms: 0,
    area: 5000,
    link: "/property/3",
  },
];

const PropertyList = () => {
  return (
    <div className="container py-4">
      <h2 className="mb-4 fw-bold">Featured Properties</h2>
      <div className="row g-4">
        {properties.map((property, index) => (
          <PropertyCard key={index} {...property} />
        ))}
      </div>
    </div>
  );
};

export default PropertyList;
