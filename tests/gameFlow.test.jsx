import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "../src/App";
import gameService from "../src/services/GameService";
import { bucketKeys } from "../src/constants";
import { dailyGames } from "./data/dailyGames";
import { guessWords } from "./data/guessWords";
import { stopWords } from "./data/stopWords";
import { wordList } from "./data/wordList";

describe("Game Flow", () => {
  beforeEach(() => {
    vi.mock("../src/env", () => {
      return {
        BACKEND_BUCKET: "test-bucket",
      };
    });
    vi.spyOn(gameService, "backendGet").mockImplementation(async (key) => {
      switch (key) {
        case bucketKeys.dailyGames:
          return dailyGames;
        case bucketKeys.guessWords:
          return guessWords;
        case bucketKeys.stopWords:
          return stopWords;
        case "625fc8f4-5d80-4c18-9f42-93573a34fb6c":
          return wordList;
        default:
          throw Error("No mock data available");
      }
    });
    render(<App />);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("Daily Game Flow", async () => {
    const guessCount = await screen.findByText(/0/i);
    expect(guessCount).toBeInTheDocument();

    const gameName = await screen.findByText(/#8/i);
    expect(gameName).toBeInTheDocument();

    const inputElement = screen.getByPlaceholderText("Enter a word");

    await userEvent.type(inputElement, "tree{enter}");
    expect(await screen.findAllByText(/Tree/i)).toHaveLength(2);
    expect(await screen.findAllByText(/6/i)).toHaveLength(2);
    expect(await screen.findAllByText(/1/i)).toHaveLength(2);
    expect(screen.queryByText(/0/i)).not.toBeInTheDocument();

    await userEvent.type(inputElement, "yield{enter}");
    expect(await screen.findAllByText(/Tree/i)).toHaveLength(1);
    expect(await screen.findAllByText(/Yield/i)).toHaveLength(2);
    expect(await screen.findAllByText(/6/i)).toHaveLength(1);
    expect(await screen.findAllByText(/1/i)).toHaveLength(1);
    expect(await screen.findAllByText(/3/i)).toHaveLength(2);
    expect(await screen.findAllByText(/2/i)).toHaveLength(1);

    await userEvent.type(inputElement, "fruit{enter}");
    expect(await screen.findAllByText(/Fruit/i)).toHaveLength(2);
    expect(await screen.findAllByText(/Tree/i)).toHaveLength(1);
    expect(await screen.findAllByText(/Yield/i)).toHaveLength(1);
    expect(await screen.findAllByText(/6/i)).toHaveLength(1);
    expect(await screen.findAllByText(/1/i)).toHaveLength(3);
    expect(await screen.findAllByText(/3/i)).toHaveLength(4);
    expect(screen.queryByText(/2/i)).not.toBeInTheDocument();
    expect(await screen.findByText(/Congrats!/i)).toBeInTheDocument();
    expect(await screen.findByText(/🟩🟩🟩/i)).toBeInTheDocument();
  });
});
