import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    fontSize: string[];
    fontWeights: {
      body: number;
      title: number;
      subtitle: number;
    };
    color: {
      primary: {
        [key: number]: string;
      };
      grey: {
        [key: number]: string;
      };
      secondary: {
        [key: number]: string;
      };
    };
  }
}
