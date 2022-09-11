import { screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import renderWithTheme from "@lib/utils/renderWithTheme";
import { Modal } from "@components/common/Modal";

const TestModal = ({ open }: { open?: boolean }) => {
  return (
    <Modal open={open}>
      <Modal.Button>Open</Modal.Button>
      <Modal.Body>
        <div>Test</div>
      </Modal.Body>
    </Modal>
  );
};

describe("Modal", () => {
  test("Loads with button visible and modal invisible", async () => {
    renderWithTheme(<TestModal />);

    expect(screen.queryByText("Test")).toBeFalsy();
    expect(screen.getByText("Open")).toBeTruthy();
  });

  test("Can be rendered without button", async () => {
    renderWithTheme(
      <Modal>
        <Modal.Body>
          <div>Test</div>
        </Modal.Body>
      </Modal>
    );

    expect(screen.queryByText("Test")).toBeFalsy();
  });

  test("Opens modal when button clicked", async () => {
    renderWithTheme(<TestModal />);
    fireEvent.click(screen.getByText("Open"));

    expect(screen.getByText("Test")).toBeTruthy();
  });

  test("Manual open state overrides default", async () => {
    renderWithTheme(<TestModal open={true} />);

    expect(screen.getByText("Test")).toBeTruthy();
  });

  test("Clicking outside modal closes it", async () => {
    renderWithTheme(<TestModal />);
    const user = userEvent.setup();
    await user.click(screen.getByText("Open"));
    const opened = screen.getByText("Test");
    const overlay = opened?.parentElement?.parentElement;
    if (overlay) {
      await user.click(overlay);
      expect(screen.queryByText("Test")).toBeFalsy();
      expect(opened).toBeTruthy();
    } else {
      throw new Error("Overlay should exist");
    }
  });

  test("Clicking escape with modal open closes it", async () => {
    const { container } = renderWithTheme(<TestModal />);
    const user = userEvent.setup();
    await user.click(screen.getByText("Open"));
    const opened = screen.getByText("Test");
    await user.keyboard("{Escape}");
    expect(screen.queryByText("Test")).toBeFalsy();
    expect(opened).toBeTruthy();
  });
});
