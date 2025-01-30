import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "../src/App";
import { gameStateKey } from "../src/constants";
import { fetchMock } from "./utils";

describe("Previous Games", () => {
  beforeEach(() => {
    vi.mock("../src/env", () => {
      return {
        BACKEND_BUCKET: "https://test-bible-contexto-backend.s3.amazonaws.com",
      };
    });
    global.fetch = vi.fn().mockImplementation(fetchMock);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    localStorage.setItem(gameStateKey, "");
  });

  it("Select Previous Game", async () => {

    render(<App />);

    expect(await screen.findByText("0")).toBeInTheDocument();
    expect(screen.queryByText("#8")).toBeInTheDocument();

    const dropDownMenu = screen.getByTestId("dropdown-menu-button");
    await userEvent.click(dropDownMenu);

    const previousGamesItem = screen.getByText("Previous Games");
    await userEvent.click(previousGamesItem);

    expect(screen.queryByText("Previous Games:")).toBeInTheDocument();
    expect(screen.queryByText(/#8 /)).toBeInTheDocument();
    expect(screen.queryByText(/#7 /)).toBeInTheDocument();
    expect(screen.queryByText(/#2 /)).toBeInTheDocument();
    expect(screen.queryByText(/#1 /)).toBeInTheDocument();

    const previousGame = screen.getByText(/#7 /);
    await userEvent.click(previousGame);

    expect(screen.queryByText("#7")).toBeInTheDocument();
    expect(screen.queryByText("#8")).not.toBeInTheDocument();

  });

});
