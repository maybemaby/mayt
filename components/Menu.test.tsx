import {
  screen,
  fireEvent,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Menu from "./Menu";
import renderWithTheme from "../lib/utils/renderWithTheme";

describe("Menu", () => {
  test("Loads without popup", async () => {
    renderWithTheme(<Menu />);
    await expect(screen.findByRole("menu")).rejects.toThrow();
  });

  test("Clicking renders popup", async () => {
    renderWithTheme(<Menu />);
    fireEvent.click(screen.getByRole("button"));
    await waitFor(() => {
      screen.getByRole("menu");
    });
    const menu = await screen.findByRole("menu");
    expect(menu).toBeTruthy();
  });

  test("Clicking button closes", async () => {
    renderWithTheme(<Menu />);
    fireEvent.click(screen.getByRole("button"));
    await waitFor(() => {
      screen.getByRole("menu");
    });
    fireEvent.click(screen.getByRole("button"));
    await expect(screen.findByRole("menu")).rejects.toThrow();
  });

  test("Clicking outside closes", async () => {
    const user = userEvent.setup();
    renderWithTheme(
      <div id="container">
        Test
        <div>Outside</div>
        <Menu />
      </div>
    );
    user.click(screen.getByRole("button"));
    await waitFor(() => {
      screen.getByRole("menu");
    });
    user.click(document.body);
    await waitForElementToBeRemoved(() => screen.queryByRole("menu"), {
      timeout: 1000,
    });
    await expect(screen.findByRole("menu")).rejects.toThrow();
  });
});
