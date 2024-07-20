import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "../../src/App";
import gameService from "../../src/services/GameService";
import { backendGetMock, submitUserInput, testTextFrequency } from "../utils";

describe("Game Flow (Shared Game)", () => {
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
      "Prophet": 2,
      4: 2
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
});
