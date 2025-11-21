import React from "react";

const PropertyCard = ({
  title,
  location,
  price,
  type,
  image,
  bedrooms,
  bathrooms,
  area,
  areaUnit,
  link,
}) => {
  return (
    <div className="col-md-4">
      <div className="card h-100 shadow-sm">
        <img
          src={image}
          className="card-img-top"
          alt={title}
          style={{ height: "200px", objectFit: "cover" }}
        />
        <div className="card-body">
          <h5 className="card-title">{title}</h5>
          <p className="card-text text-muted">{location}</p>
          <p className="mb-1">
            <strong>Price:</strong> ₹{price.toLocaleString()}
          </p>
          <p className="mb-1">
            <strong>Type:</strong> {type}
          </p>
          {bedrooms > 0 && (
            <p className="mb-1">
              {bedrooms} BHK | {bathrooms} Bath | {area} {areaUnit}
            </p>
          )}
          <a href={link} className="btn btn-outline-primary mt-2">
            View Details
          </a>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
