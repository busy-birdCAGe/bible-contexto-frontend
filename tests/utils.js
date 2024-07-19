import userEvent from "@testing-library/user-event";
import { bucketKeys } from "../src/constants";
import { dailyGames } from "./data/backend/dailyGames";
import { guessWords } from "./data/backend/guessWords";
import { stopWords } from "./data/backend/stopWords";
import { wordList } from "./data/backend/wordList";

export async function backendGetMock(key) {
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
}

export async function submitUserInput(
  screen,
  inputText
) {
  const inputElement = screen.getByPlaceholderText("Enter a word");
  await userEvent.type(inputElement, `${inputText}{enter}`);
}

export function testTextFrequency(
  screen,
  expectedTextFrequencyMapping
) {
  for (const word of Object.keys(expectedTextFrequencyMapping)) {
    const frequency = expectedTextFrequencyMapping[word];
    if (frequency == 1) {
      expect(screen.queryByText(word)).toBeInTheDocument();
    } else if (frequency == 0) {
      expect(screen.queryByText(word)).not.toBeInTheDocument();
    } else {
      expect(screen.queryAllByText(word)).toHaveLength(frequency);
    }
  }
}
