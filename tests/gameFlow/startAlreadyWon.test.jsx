import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "../../src/App";
import gameService from "../../src/services/GameService";
import { backendGetMock } from "../utils";
import { alreadyWon } from "../data/localStorage/alreadyWon";
import { gameStateKey } from "../../src/constants";

describe("Game Flow (Already Won Refresh)", () => {
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

  it("Load Stored Won Game State", async () => {
    localStorage.setItem(gameStateKey, alreadyWon);
    render(<App />);

    expect(await screen.findByText("#8")).toBeInTheDocument();
    screen.debug();
    expect(screen.queryAllByText("4")).toHaveLength(1);
    expect(screen.queryAllByText(/4/)).toHaveLength(2);
    expect(screen.queryByText("Congrats!")).toBeInTheDocument();
    expect(screen.queryByText(/🟩🟩🟩/)).toBeInTheDocument();
    expect(screen.queryAllByText("Fruit")).toHaveLength(2);
    expect(screen.queryAllByText("1")).toHaveLength(2);
    expect(screen.queryAllByText("Tree")).toHaveLength(1);
    expect(screen.queryAllByText("Branch")).toHaveLength(1);
    expect(screen.queryAllByText("Eat")).toHaveLength(1);
    expect(screen.queryAllByText("328")).toHaveLength(1);

    const inputElement = screen.getByPlaceholderText("Enter a word");

    await userEvent.type(inputElement, "yield{enter}");
    expect(screen.queryAllByText("4")).toHaveLength(1);
    expect(screen.queryAllByText(/4/)).toHaveLength(2);
    expect(screen.queryAllByText("Fruit")).toHaveLength(1);
    expect(screen.queryAllByText("1")).toHaveLength(1);
    expect(screen.queryAllByText("Yield")).toHaveLength(2);
    expect(screen.queryAllByText("3")).toHaveLength(2);
  });
});
