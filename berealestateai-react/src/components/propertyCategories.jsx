
import React from "react";

const PropertyCategories = () => {
  const categories = [
    {
      title: "Residential Land",
      properties: "1,300+ Properties",
      imgSrc: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae",
      altText: "Residential Land",
    },
    {
      title: "Independent House / Villa",
      properties: "1,000+ Properties",
      imgSrc: "https://images.unsplash.com/photo-1572120360610-d971b9c79809",
      altText: "Independent House / Villa",
    },
    {
      title: "Residential Apartment",
      properties: "410+ Properties",
      imgSrc: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
      altText: "Residential Apartment",
    },
    {
      title: "Commercial Building",
      properties: "250+ Properties",
      imgSrc: "https://images.unsplash.com/photo-1570129477492-45c003edd2be",
      altText: "Commercial Building",
    },
  ];

  return (
    <div className="container py-4">
      <h2 className="mb-4 fw-bold">Property Categories</h2>
      <div className="row g-4">
        {categories.map((category, index) => (
          <div className="col-md-3" key={index}>
            <div className="card h-100 shadow-sm">
              <img
                src={category.imgSrc}
                className="card-img-top"
                alt={category.altText}
                style={{ height: "180px", objectFit: "cover" }}
              />
              <div className="card-body text-center">
                <h5 className="card-title">{category.title}</h5>
                <p className="card-text text-muted">{category.properties}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyCategories;
