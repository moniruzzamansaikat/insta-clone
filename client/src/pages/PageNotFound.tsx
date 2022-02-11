import React from "react";
import { Link } from "react-router-dom";

function PageNotFound() {
  return (
    <div>
      <h1>
        Page not found. go back to <Link to="/">Home</Link>
      </h1>
    </div>
  );
}

export default PageNotFound;
