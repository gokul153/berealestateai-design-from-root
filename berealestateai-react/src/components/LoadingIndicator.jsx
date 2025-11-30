import React from "react";

const LoadingIndicator = () => {
  // Inline styles for the component
  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "4rem 0", // Give it some vertical space
    },
    spinner: {
      border: "5px solid #f3f3f3" /* Light grey */,
      borderTop: "5px solid #004E8F" /* Blue from your app theme */,
      borderRadius: "50%",
      width: "50px",
      height: "50px",
      animation: "spin 1s linear infinite",
    },
  };

  return (
    <div style={styles.container}>
      {/* We inject the keyframes animation into the head for the spinner to work */}
      <style>
        {`
          @keyframes spin { to { transform: rotate(360deg); } }
        `}
      </style>
      <div style={styles.spinner}></div>
    </div>
  );
};

export default LoadingIndicator;