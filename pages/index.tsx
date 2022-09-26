import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Link from "next/link";
import UserInfo from "../components/UserInfo";
import { stopFetchingUsers, startFetchingUsers } from "../store/actions";
import { HeaderComponent } from "../components/header.component";
import { css, Global } from "@emotion/react";

const AICarumba = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(startFetchingUsers());
    return () => {
      dispatch(stopFetchingUsers());
    };
  }, [dispatch]);

  return (
    <>
      <Global
        styles={css`
          body {
            margin: 0;
          }
        `}
      />
      <HeaderComponent />
      <UserInfo />
      <br />
      <nav>
        <Link href="/other">
          <a>Navigate to "/other"</a>
        </Link>
      </nav>
    </>
  );
};
export default AICarumba;
