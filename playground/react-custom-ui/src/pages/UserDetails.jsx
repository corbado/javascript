import { useCorbadoSession } from "@corbado/react-sdk";
import React, { useState } from "react";

export function UserDetails() {
  const { getUser, getFullUser } = useCorbadoSession();
  const [fullUserDetails, setFullUserDetails] = useState(null);

  const getFullUserDetails = async () => {
    const fullUser = await getFullUser();
    setFullUserDetails(fullUser);
  };

  return (
    <div>
      <h1>User Details</h1>
      <p>User details are available only after login</p>
      <div>
        <h3>User Details</h3>
        <pre>{JSON.stringify(getUser(), null, 2)}</pre>
      </div>
      <div>
        <h3>Full User Details</h3>
        <button onClick={getFullUserDetails}>Get Full User Details</button>
        <pre>{JSON.stringify(fullUserDetails, null, 2)}</pre>
      </div>
    </div>
  );
}
