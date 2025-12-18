import React, { useState, useEffect } from "react";
import PropertyCard from "./PropertyCard";
import LoadingIndicator from "./LoadingIndicator";

const PropertyListAll = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const apiUrl = `${import.meta.env.VITE_BACKEND_API_URL}/api/properties`;
        console.log(`Fetching recent properties from: ${apiUrl}`);
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProperties(data);
      } catch (e) {
        console.error("Fetch failed:", e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <div className="container py-4 text-danger">Error: {error}</div>;
  }

  return (
    <div className="container py-4">
      <h2 className="mb-4 fw-bold">Recent Listing</h2>
      <div className="row g-4">
        {properties.map((property) => (
          <PropertyCard
            key={property._id}
            title={property.title}
            location={`${property.location.district}, ${property.location.city}`}
            price={property.price}
            type={property.category}
            image={property.location.imageUrl}
            bedrooms={property.bedrooms}
            bathrooms={property.bathrooms}
            area={property.buildUpArea}
            areaUnit={property.buildUpUnit}
            link={`/property/${property._id}`}
          />
        ))}
      </div>
    </div>
  );
};

export default PropertyListAll;
