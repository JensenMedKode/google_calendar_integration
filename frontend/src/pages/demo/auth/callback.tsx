import { NextPage } from "next";
import { useEffect } from "react";

const IndexPage: NextPage = () => {
  useEffect(() => {
    if (window.opener) {
      // get the URL parameters which will include the auth token
      const params = window.location.search;
      window.opener.postMessage(params, window.origin);
      window.close();
    } else {
      throw Error("This page shouldn't be accessed from a non-popup window");
    }
  });
  // some text to show the user
  return <p>Please wait...</p>;
};

export default IndexPage;
