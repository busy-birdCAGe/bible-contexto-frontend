import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "../../src/App";
import gameService from "../../src/services/GameService";
import { backendGetMock, submitUserInput, testTextFrequency } from "../utils";
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

    testTextFrequency(screen, {
      4: 1,
      "Congrats!": 1,
      Fruit: 2,
      1: 2,
      Tree: 1,
      Branch: 1,
      Eat: 1,
      328: 1
    })
    expect(screen.queryAllByText(/4/)).toHaveLength(2);
    expect(screen.queryByText(/🟩🟩🟩/)).toBeInTheDocument();

    await submitUserInput(screen, "yield")
    testTextFrequency(screen, {
      4: 1,
      "Congrats!": 1,
      Fruit: 1,
      1: 1,
      Yield: 2,
      3: 2,
      Tree: 1,
      Branch: 1,
      Eat: 1,
      328: 1,
    });
    expect(screen.queryAllByText(/4/)).toHaveLength(2);
    expect(screen.queryByText(/🟩🟩🟩/)).toBeInTheDocument();
  });
});
