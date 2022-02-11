import React from "react";
import { Redirect, Route } from "react-router-dom";
import { authToken } from "../../util";
import Navbar from "../Navbar/Navbar";
import { isExpired } from "react-jwt";

export default function PrivateRoute({ children, ...rest }: any) {
  const token: any = authToken();
  const expired = isExpired(token);

  return (
    <Route
      {...rest}
      render={({ location }) =>
        token && !expired ? (
          <>
            <Navbar />
            <br />
            <br />
            <br />
            <br />
            <div className="container">{children}</div>
          </>
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}
