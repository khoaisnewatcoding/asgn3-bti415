import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAtom } from "jotai";
import { favouritesAtom } from "@/store";
import { getFavourites } from "@/lib/userData";
import { isAuthenticated } from "@/lib/authenticate";

const PUBLIC_PATHS = ["/about", "/login", "/register"];

export default function RouteGuard({ children }) {
  const router = useRouter();
  const [, setFavouritesList] = useAtom(favouritesAtom);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const updateAtom = async () => {
      if (!isAuthenticated()) {
        setFavouritesList(undefined);
        return;
      }

      setFavouritesList(await getFavourites());
    };

    const authCheck = async (url) => {
      await updateAtom();

      const path = url.split("?")[0];

      if (!PUBLIC_PATHS.includes(path) && !isAuthenticated()) {
        setAuthorized(false);
        router.push("/login");
      } else {
        setAuthorized(true);
      }
    };

    const hideContent = () => {
      setAuthorized(false);
    };

    authCheck(router.asPath);
    router.events.on("routeChangeStart", hideContent);
    router.events.on("routeChangeComplete", authCheck);

    return () => {
      router.events.off("routeChangeStart", hideContent);
      router.events.off("routeChangeComplete", authCheck);
    };
  }, [router, setFavouritesList]);

  return authorized ? children : null;
}