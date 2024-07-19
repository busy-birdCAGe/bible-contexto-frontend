import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "../../src/App";
import gameService from "../../src/services/GameService";
import { backendGetMock } from "../utils";

describe("Game Flow (Fresh Start)", () => {
  beforeEach(() => {
    vi.mock("../src/env", () => {
      return {
        BACKEND_BUCKET: "test-bucket",
      };
    });
    vi.spyOn(gameService, "backendGet").mockImplementation(backendGetMock);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("Fresh Game Flow", async () => {
    render(<App />);

    expect(await screen.findByText("0")).toBeInTheDocument();
    expect(screen.queryByText("#8")).toBeInTheDocument();
    expect(screen.queryByText("Congrats!")).not.toBeInTheDocument();

    const inputElement = screen.getByPlaceholderText("Enter a word");

    await userEvent.type(inputElement, "tree{enter}");
    expect(screen.queryAllByText("Tree")).toHaveLength(2);
    expect(screen.queryAllByText("6")).toHaveLength(2);
    expect(screen.queryAllByText("1")).toHaveLength(1);
    expect(screen.queryByText("0")).not.toBeInTheDocument();
    expect(screen.queryByText("Congrats!")).not.toBeInTheDocument();

    await userEvent.type(inputElement, "yield{enter}");
    expect(screen.queryAllByText("Tree")).toHaveLength(1);
    expect(screen.queryAllByText("Yield")).toHaveLength(2);
    expect(screen.queryAllByText("6")).toHaveLength(1);
    expect(screen.queryByText("1")).not.toBeInTheDocument();
    expect(screen.queryAllByText("3")).toHaveLength(2);
    expect(screen.queryAllByText("2")).toHaveLength(1);
    expect(screen.queryByText("Congrats!")).not.toBeInTheDocument();

    await userEvent.type(inputElement, "fruit{enter}");
    expect(screen.queryAllByText("Fruit")).toHaveLength(2);
    expect(screen.queryAllByText("Tree")).toHaveLength(1);
    expect(screen.queryAllByText("Yield")).toHaveLength(1);
    expect(screen.queryAllByText("6")).toHaveLength(1);
    expect(screen.queryAllByText("1")).toHaveLength(2);
    expect(screen.queryAllByText("3")).toHaveLength(2);
    expect(screen.queryByText("2")).not.toBeInTheDocument();
    expect(screen.queryAllByText(/3/)).toHaveLength(4);
    expect(screen.queryByText("Congrats!")).toBeInTheDocument();
    expect(screen.queryByText(/🟩🟩🟩/)).toBeInTheDocument();
  });
});
