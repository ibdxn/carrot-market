import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SWRConfig } from "swr";
import { useRouter } from "next/router";
import useUser from "@libs/client/useUser";


function MyApp({ Component, pageProps }: AppProps) {
  const {pathname} = useRouter();
  useUser(pathname);

  return (
    <SWRConfig value={{
      fetcher: (url: string) => fetch(url).then((response) => response.json())}}>
    <div className="w-full max-w-lg mx-auto">
      <Component {...pageProps} />
    </div>
    </SWRConfig>
  );
}


export default MyApp;
