import type { AppProps } from "next/app";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import { lightTheme } from "../theme";
import { WithSidebar } from "../components/layouts/WithSidebar";

const GlobalStyle = createGlobalStyle`
html,
body {
  padding: 0;
  margin: 0;
  font-family: Fira Sans ,-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  overflow: auto;
}

* {
  box-sizing: border-box;
}
div#__next {
  min-height: 100vh;
  overflow: auto;
}
`;

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <GlobalStyle />
      <ThemeProvider theme={lightTheme}>
        <WithSidebar>
          <Component {...pageProps} />
        </WithSidebar>
      </ThemeProvider>
    </>
  );
}

export default MyApp;
