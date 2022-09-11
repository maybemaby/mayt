import {
  screen,
  fireEvent,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Menu from "./Menu";
import renderWithTheme from "../lib/utils/renderWithTheme";

const testOptions = [
  {
    label: "option 1",
    value: "1",
  },
  {
    label: "option 2",
    value: "2",
  },
];

const selectHandler = (value: string) => {
  return value;
};

describe("Menu", () => {
  test("Loads without popup", async () => {
    renderWithTheme(<Menu options={testOptions} onSelect={selectHandler} />);
    await expect(screen.findByRole("menu")).rejects.toThrow();
  });

  test("Clicking renders popup", async () => {
    renderWithTheme(<Menu options={testOptions} onSelect={selectHandler} />);
    fireEvent.click(screen.getByRole("button"));
    await waitFor(() => {
      screen.getByRole("menu");
    });
    const menu = await screen.findByRole("menu");
    expect(menu).toBeTruthy();
  });

  test("Clicking button closes", async () => {
    renderWithTheme(<Menu options={testOptions} onSelect={selectHandler} />);
    fireEvent.click(screen.getByRole("button"));
    await waitFor(() => {
      screen.getByRole("menu");
    });
    fireEvent.click(screen.getAllByRole("button")[0]);
    await expect(screen.findByRole("menu")).rejects.toThrow();
  });

  test("Clicking outside closes", async () => {
    const user = userEvent.setup();
    renderWithTheme(
      <div id="container">
        Test
        <div>Outside</div>
        <Menu options={testOptions} onSelect={selectHandler} />
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

  test("Clicking option closes menu", async () => {
    const user = userEvent.setup();
    renderWithTheme(
      <div id="container">
        Test
        <div>Outside</div>
        <Menu options={testOptions} onSelect={selectHandler} />
      </div>
    );
    user.click(screen.getByRole("button"));
    await waitFor(() => {
      screen.getByRole("menu");
    });
    const option1 = await screen.findByText("option 1");
    user.click(option1);
    await waitForElementToBeRemoved(() => screen.queryByRole("menu"), {
      timeout: 1000,
    });
    await expect(screen.findByRole("menu")).rejects.toThrow();
  });
});
