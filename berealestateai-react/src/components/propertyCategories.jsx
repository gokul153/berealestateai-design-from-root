import React from "react";

const PropertyCategories = () => {
  const categories = [
    {
      title: "Residential Land",
      properties: "1,300+ Properties",
      imgSrc: "path/to/residential-land.jpg",  // Update with the actual image path
      altText: "Residential Land",
    },
    {
      title: "Independent House / Villa",
      properties: "1,000+ Properties",
      imgSrc: "path/to/independent-house.jpg",  // Update with the actual image path
      altText: "Independent House / Villa",
    },
    {
      title: "Residential Apartment",
      properties: "410+ Properties",
      imgSrc: "path/to/residential-apartment.jpg",  // Update with the actual image path
      altText: "Residential Apartment",
    },
    {
      title: "Commercial Building",
      properties: "250+ Properties",
      imgSrc: "path/to/commercial-building.jpg",  // Update with the actual image path
      altText: "Commercial Building",
    },
  ];

  return (
    <div className="property-categories" style={styles.container}>
      {categories.map((category, index) => (
        <div className="category" key={index} style={styles.category}>
          <img src={category.imgSrc} alt={category.altText} style={styles.image} />
          <h3>{category.title}</h3>
          <p>{category.properties}</p>
        </div>
      ))}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  category: {
    backgroundColor: '#f5f5f5',
    borderRadius: '10px',
    padding: '20px',
    margin: '10px',
    width: '200px',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  image: {
    width: '100%',
    borderRadius: '10px',
  },
};

export default PropertyCategories;
