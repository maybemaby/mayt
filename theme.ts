import { DefaultTheme } from "styled-components";

const light = {
  color: {
    primary: {
      50: "#C5DCFF",
      100: "#A7CAFE",
      200: "#8AB7FC",
      300: "#70A7F9",
      400: "#679BE8",
      500: "#5F8ED4",
      600: "#4F75AE",
      700: "#375582",
    },
    grey: {
      50: "#f6f5f5",
      200: "#F7F7F8",
      300: "#E9E9E9",
      400: "#D0D0D1",
      500: "#B8B8B9",
      600: "#99999B",
      700: "#5F5F5F",
    },
    secondary: {
      50: "#FCC976",
      100: "#FCC976",
      200: "#F8BB56",
      300: "#EAA83D",
      400: "#DDA448",
      500: "#D29737",
      600: "#AE7D2F",
      700: "#715324",
    },
  },
};

const defaultTheme = {
  fontSize: [
    "12px",
    "14px",
    "16px",
    "20px",
    "22px",
    "28px",
    "32px",
    "36px",
    "48px",
  ],
  fontWeights: {
    body: 400,
    title: 600,
    subtitle: 500,
  },
};

export const lightTheme: DefaultTheme = { ...defaultTheme, ...light };
