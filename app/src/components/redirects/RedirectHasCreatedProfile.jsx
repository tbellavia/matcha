import React, {useMemo} from "react";
import APIUser from "../../services/user";
import {Navigate} from "react-router-dom";

export default function RedirectHasCreatedProfile({ fallback, children }) {
    const api = useMemo(() => new APIUser(), []);

    return (
      <React.Fragment>
          {api.hasCreatedProfile() ?
            <Navigate to={fallback}/> :
            children
          }
      </React.Fragment>
    );
}