import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { setAuthToken } from "services/auth/useAuthContextValue";

const IndexPage: NextPage = () => {
  const { query, replace } = useRouter();

  useEffect(() => {
    if (!query.token) return;

    setAuthToken(query.token as string);

    if (query.redirect) {
      window.location.href = query.redirect as string;
    } else {
      replace("/");
    }
  });
  // some text to show the user
  return <p>Please wait...</p>;
};

export default IndexPage;

// README
// The point of this page is to showcase how an SSO can happen. With an SSO token the token is first set then validated.
