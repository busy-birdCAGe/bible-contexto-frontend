import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "../../src/App";
import gameService from "../../src/services/GameService";
import { backendGetMock, submitUserInput, testTextFrequency } from "../utils";

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

    await submitUserInput(screen, "tree")
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
});
