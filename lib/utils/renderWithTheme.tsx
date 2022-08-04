import { render } from "@testing-library/react";
import React from "react";
import { ThemeProvider } from "styled-components";
import { lightTheme } from "../../theme";

function renderWithTheme(children: React.ReactNode) {
  return render(<ThemeProvider theme={lightTheme}>{children}</ThemeProvider>);
}

export default renderWithTheme;
