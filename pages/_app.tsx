import type { AppProps } from "next/app";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { lightTheme } from "../theme";
import { WithSidebar } from "../components/layouts/WithSidebar";
import { withTRPC } from "@trpc/next";
import { AppRouter } from "./api/trpc/[trpc]";

const GlobalStyle = createGlobalStyle`
html,
body {
  padding: 0;
  margin: 0;
  font-family: 'Poppins', Fira Sans ,-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Droid Sans, Helvetica Neue, sans-serif;
  overflow-y: auto;
  max-width: 100vw;
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

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <ThemeProvider theme={lightTheme}>
        <GlobalStyle />
        <QueryClientProvider client={queryClient}>
          <WithSidebar>
            <Component {...pageProps} />
          </WithSidebar>
        </QueryClientProvider>
      </ThemeProvider>
    </>
  );
}

export default withTRPC<AppRouter>({
  config({ ctx }) {
    const url = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}/api/trpc`
      : "http://localhost:3000/api/trpc";

    return { url };
  },
  ssr: true,
})(MyApp);
