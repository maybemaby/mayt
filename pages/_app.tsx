import type { AppProps } from "next/app";
import Head from "next/head";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import { withTRPC } from "@trpc/next";
import { lightTheme } from "../theme";
import { WithSidebar } from "@components/layouts/WithSidebar";
import { AppRouter } from "./api/trpc/[trpc]";
import { Modal } from "@components/common/Modal";
import { useModalStore } from "@stores/ModalStore";
import "../base.css";

const GlobalStyle = createGlobalStyle`
html,
body {
  padding: 0;
  margin: 0;
  font-family: 'Poppins', Fira Sans ,-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Droid Sans, Helvetica Neue, sans-serif;
  max-width: 100vw;
}

body {
  overflow-y: auto;
}

h1 {
  font-weight: 600;
  font-size: 1.5rem;
}

h2 {
  font-weight: 600;
  font-size: 1.3rem;
  color: ${(props) => props.theme.color.primary[300]}
}

a {
  text-decoration: none;
  color: inherit;
}

* {
  box-sizing: border-box;
}
div#__next {
  min-height: 100vh;
  overflow-y: auto;
}
`;

function MyApp({ Component, pageProps }: AppProps) {
  const modal = useModalStore();
  return (
    <>
      <Head>
        <title>Mayt</title>
      </Head>
      <ThemeProvider theme={lightTheme}>
        <GlobalStyle />
        <WithSidebar>
          {modal.active && (
            <Modal open={modal.isShowing} onClose={() => modal.close()}>
              <Modal.Body>
                <modal.active.Component {...modal.active?.props} />
              </Modal.Body>
            </Modal>
          )}
          <Component {...pageProps} />
        </WithSidebar>
      </ThemeProvider>
    </>
  );
}

export default withTRPC<AppRouter>({
  config({ ctx }) {
    if (typeof window !== "undefined") {
      return {
        url: "/api/trpc",
      };
    }

    const url = process.env.PUBLIC_DOMAIN
      ? `${process.env.PUBLIC_DOMAIN}/api/trpc`
      : process.env.NEXT_PUBLIC_VERCEL_URL
      ? `${process.env.NEXT_PUBLIC_VERCEL_URL}/api/trpc`
      : "http://localhost:3000/api/trpc";

    return { url };
  },
  ssr: true,
})(MyApp);
