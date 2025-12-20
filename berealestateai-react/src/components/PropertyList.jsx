
import React, { useState, useEffect } from "react";
import PropertyCard from "./PropertyCard";
import LoadingIndicator from "./LoadingIndicator";

const PropertyListPremium = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const apiUrl = `${import.meta.env.VITE_BACKEND_API_URL}/api/properties/premium?page=1&page_size=10`;
        console.log(`Fetching properties from: ${apiUrl}`);
        const response = await fetch(apiUrl);

        console.log("Response status:", response.status);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Properties fetched successfully:", data);
        setProperties(data);
      } catch (e) {
        console.error("Fetch failed:", e);
        setError(e.message);
      } finally {
        setLoading(false);
        console.log("Finished fetching attempt.");
      }
    };

    fetchProperties();
  }, []); // Empty dependency array ensures this runs only once on mount

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <div className="container py-4 text-danger">Error: {error}</div>;
  }

  return (
    <div className="container py-4">
      <h2 className="mb-4 fw-bold">Featured Properties</h2>
      <div className="row g-4">
        {properties.map((property) => (
          <PropertyCard
            key={property._id} // Use a unique ID from the data for the key
            title={property.title}
            location={`${property.location.district}, ${property.location.city}`}
            price={property.price}
            type={property.category}
            image={property.location.imageUrl}
            bedrooms={property.bedrooms}
            bathrooms={property.bathrooms}
            area={property.buildUpArea}
            areaUnit={property.buildUpUnit}
            link={`/property/${property.propertyId}`}
          />
        ))}
      </div>
    </div>
  );
};

export default PropertyListPremium;
