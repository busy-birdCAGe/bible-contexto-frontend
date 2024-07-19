import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "../../src/App";
import gameService from "../../src/services/GameService";
import { backendGetMock } from "../utils";
import { midGame } from "../data/localStorage/midGame";
import { gameStateKey } from "../../src/constants";

describe("Game Flow (Mid Game Refresh)", () => {
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

  it("Load Stored Mid Game State", async () => {
    localStorage.setItem(gameStateKey, midGame);
    render(<App />);

    expect(await screen.findByText("#8")).toBeInTheDocument();
    expect(screen.queryAllByText("3")).toHaveLength(1);
    expect(screen.queryByText("Congrats!")).not.toBeInTheDocument();
    expect(screen.queryAllByText("Tree")).toHaveLength(1);
    expect(screen.queryAllByText("Branch")).toHaveLength(1);
    expect(screen.queryAllByText("Eat")).toHaveLength(2);
    expect(screen.queryAllByText("328")).toHaveLength(2);
    expect(screen.queryAllByText("6")).toHaveLength(1);
    expect(screen.queryAllByText("133")).toHaveLength(1);

    const inputElement = screen.getByPlaceholderText("Enter a word");

    await userEvent.type(inputElement, "yield{enter}");
    expect(screen.queryAllByText("Yield")).toHaveLength(2);
    expect(screen.queryAllByText("3")).toHaveLength(2);
    expect(screen.queryAllByText("Eat")).toHaveLength(1);
    expect(screen.queryAllByText("328")).toHaveLength(1);

    await userEvent.type(inputElement, "fruit{enter}");
    expect(screen.queryAllByText("Fruit")).toHaveLength(2);
    expect(screen.queryAllByText("1")).toHaveLength(2);
    expect(screen.queryAllByText("Yield")).toHaveLength(1);
    expect(screen.queryAllByText("3")).toHaveLength(1);
    expect(screen.queryByText("Congrats!")).toBeInTheDocument();
    expect(screen.queryByText(/🟩🟩🟩🟩/)).toBeInTheDocument();
    expect(screen.queryByText(/4/)).toBeInTheDocument();
    expect(screen.queryByText(/🟨/)).toBeInTheDocument();
    expect(screen.queryAllByText(/1/)).toHaveLength(5);
  });
});
