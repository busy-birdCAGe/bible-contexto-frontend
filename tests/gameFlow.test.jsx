import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "../src/App";
import gameService from "../src/services/GameService";
import { backendGetMock } from "./utils";

describe("Game Flow", () => {
  beforeEach(() => {
    vi.mock("../src/env", () => {
      return {
        BACKEND_BUCKET: "test-bucket",
      };
    });
    vi.spyOn(gameService, "backendGet").mockImplementation(backendGetMock);
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
