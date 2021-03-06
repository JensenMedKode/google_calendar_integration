import { NextPage } from "next";
import { FC } from "react";
import { useAuth } from "services/auth/useAuth";
import { defaultSigninPopup } from "services/auth/utils/openSignInWindow";
import { withAuth } from "services/auth/withAuth";

const LoginButton: FC = () => {
  const { login } = useAuth();

  return (
    <button
      onClick={() =>
        defaultSigninPopup(window.origin + "/demo/auth/callback?token=ABCDEFG", token =>
          login(token)
        )
      }>
      Click to login
    </button>
  );
};

const AuthTestPage: NextPage = () => {
  return <div>Looks like you are logged in!</div>;
};

// ! the entire point of this page is to test the HOC `withAuth` so you can play around with the options
export default withAuth(AuthTestPage, {
  unAuth: <LoginButton />
});
