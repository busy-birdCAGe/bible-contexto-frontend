import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "../../src/App";
import gameService from "../../src/services/GameService";
import { backendGetMock, submitUserInput, testTextFrequency } from "../utils";
import { alreadyWon } from "../data/localStorage/alreadyWon";
import { midGame } from "../data/localStorage/midGame";
import { gameStateKey } from "../../src/constants";

describe("Game Flow", () => {
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
    vi.unstubAllGlobals();
    localStorage.setItem(gameStateKey, "");
  });

  it("Fresh Game Flow", async () => {
    render(<App />);

    expect(await screen.findByText("0")).toBeInTheDocument();
    expect(screen.queryByText("#8")).toBeInTheDocument();
    expect(screen.queryByText("Congrats!")).not.toBeInTheDocument();

    await submitUserInput(screen, "tree");
    testTextFrequency(screen, {
      Tree: 2,
      6: 2,
      1: 1,
      0: 0,
      "Congrats!": 0,
    });

    await submitUserInput(screen, "yield");
    testTextFrequency(screen, {
      Tree: 1,
      Yield: 2,
      6: 1,
      1: 0,
      3: 2,
      2: 1,
      "Congrats!": 0,
    });

    await submitUserInput(screen, "fruit");
    testTextFrequency(screen, {
      Fruit: 2,
      Tree: 1,
      Yield: 1,
      6: 1,
      1: 2,
      3: 2,
      2: 0,
      "Congrats!": 1,
    });
    expect(screen.queryAllByText(/3/)).toHaveLength(4);
    expect(screen.queryByText(/🟩🟩🟩/)).toBeInTheDocument();
  });

  it("Shared Game Flow", async () => {
    vi.stubGlobal("location", {
      pathname:
        "/c2FxbnJwY2JzeCwxYzkwNDBmYS1lODY5LTQ2NmYtYTZjYi02MTQ4ZTQ5OGU5Yjc=",
    });

    render(<App />);

    expect(await screen.findByText("0")).toBeInTheDocument();
    testTextFrequency(screen, {
      "#8": 0,
      "-": 1,
      "Congrats!": 0,
    });

    await submitUserInput(screen, "prophet");
    testTextFrequency(screen, {
      "-": 1,
      1: 1,
      Prophet: 2,
      4: 2,
    });

    await submitUserInput(screen, "isaiah");
    testTextFrequency(screen, {
      "Congrats!": 1,
      "-": 1,
      2: 1,
      Isaiah: 2,
      1: 2,
      Prophet: 1,
      4: 1,
    });
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
      328: 1,
    });
    expect(screen.queryAllByText(/4/)).toHaveLength(2);
    expect(screen.queryByText(/🟩🟩🟩/)).toBeInTheDocument();

    await submitUserInput(screen, "yield");
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
      133: 1,
    });

    await submitUserInput(screen, "yield");
    testTextFrequency(screen, {
      Yield: 2,
      3: 2,
      Eat: 1,
      328: 1,
    });

    await submitUserInput(screen, "fruit");
    testTextFrequency(screen, {
      Fruit: 2,
      1: 2,
      Yield: 1,
      3: 1,
      "Congrats!": 1,
    });
    expect(screen.queryByText(/🟩🟩🟩🟩/)).toBeInTheDocument();
    expect(screen.queryByText(/4/)).toBeInTheDocument();
    expect(screen.queryByText(/🟨/)).toBeInTheDocument();
    expect(screen.queryAllByText(/1/)).toHaveLength(5);
  });

});
