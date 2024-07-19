import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "../../src/App";
import gameService from "../../src/services/GameService";
import { backendGetMock, submitUserInput, testTextFrequency } from "../utils";
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
    testTextFrequency(screen, {
      3: 1,
      "Congrats!": 0,
      Tree: 1,
      Branch: 1,
      Eat: 2,
      328: 2,
      6: 1,
      133: 1
    });

    await submitUserInput(screen, "yield")
    testTextFrequency(screen, {
      Yield: 2,
      3: 2,
      Eat: 1,
      328: 1
    })

    await submitUserInput(screen, "fruit");
    testTextFrequency(screen, {
      Fruit: 2,
      1: 2,
      Yield: 1,
      3: 1,
      "Congrats!": 1,
    })
    expect(screen.queryByText(/🟩🟩🟩🟩/)).toBeInTheDocument();
    expect(screen.queryByText(/4/)).toBeInTheDocument();
    expect(screen.queryByText(/🟨/)).toBeInTheDocument();
    expect(screen.queryAllByText(/1/)).toHaveLength(5);
  });
});
