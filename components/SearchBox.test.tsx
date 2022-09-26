import {
  queryByText,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import user from "@testing-library/user-event";
import renderWithTheme from "@lib/utils/renderWithTheme";
import { SearchBox } from "./SearchBox";

const handleSearch = jest.fn((v: string) => {
  return;
});

const handleSelect = jest.fn((v: string) => {
  return;
});

const mockRes = [
  { label: "result1", value: "result1" },
  { label: "result2", value: "result2" },
  { label: "result3", value: "result3" },
];

describe("SearchBox", () => {
  beforeEach(() => {
    user.setup();
  });

  test("Shows results on typing", async () => {
    renderWithTheme(
      <SearchBox
        onSearch={handleSearch}
        onSelect={handleSelect}
        loading={false}
        delay={0}
      />
    );
    const input = screen.getByRole("searchbox");
    user.type(input, "results");
    const resultBox = await screen.findByText(/Searching/i);
    expect(input).toBeVisible();
    expect(resultBox).toBeVisible();
  });

  test("Shows search results", async () => {
    renderWithTheme(
      <SearchBox
        onSearch={handleSearch}
        onSelect={handleSelect}
        loading={false}
        delay={0}
        results={mockRes}
      />
    );
    const input = screen.getByRole("searchbox");
    const resultNone = screen.queryByText("result", { exact: false });
    user.type(input, "result");
    const results = await screen.findAllByText(/result/i);
    expect(results).toHaveLength(3);
    for (let result of results) {
      expect(result).toBeVisible();
    }
    expect(resultNone).toBeNull();
  });

  test("Shows no results found", async () => {
    renderWithTheme(
      <SearchBox
        onSearch={handleSearch}
        onSelect={handleSelect}
        loading={false}
        delay={0}
        results={[]}
      />
    );
    const input = screen.getByRole("searchbox");
    user.type(input, "result");
    const noResults = await screen.findByText(/No results/i);
    expect(noResults).toBeVisible();
  });

  describe("Keyboard inputs", () => {
    test.each(["{Esc}", "{Escape}", "{Tab}"])(
      "Pressing %s, unfocuses",
      async (key) => {
        renderWithTheme(
          <SearchBox
            onSearch={handleSearch}
            onSelect={handleSelect}
            loading={false}
            delay={0}
          />
        );
        const input = screen.getByRole("searchbox");
        user.type(input, "result");
        const noResults = await screen.findByText(/Searching/i);
        expect(noResults).toBeVisible();
        user.keyboard(key);
        await waitForElementToBeRemoved(() => screen.queryByText(/Searching/i));
      }
    );

    test("Arrows change focus", async () => {
      renderWithTheme(
        <SearchBox
          onSearch={handleSearch}
          onSelect={handleSelect}
          loading={false}
          delay={0}
          results={mockRes}
        />
      );
      const input = screen.getByRole("searchbox");
      user.type(input, "result");
      await waitFor(() => {
        expect(screen.getAllByText(/result/i)).toHaveLength(3);
      });
      user.keyboard("{Down}");
      const results = screen.getAllByText(/result/i);
      await waitFor(() => expect(results[0]).toHaveFocus());
      user.keyboard("{ArrowDown}{ArrowDown}{ArrowDown}");
      await waitFor(() => expect(results[results.length - 1]).toHaveFocus());
      user.keyboard("{Up}");
      await waitFor(() => expect(results[results.length - 2]).toHaveFocus());
      user.keyboard("{ArrowUp}{ArrowUp}");
      await waitFor(() => expect(input).toHaveFocus());
    });
  });
});
