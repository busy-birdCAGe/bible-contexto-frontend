import userEvent from "@testing-library/user-event";
import { bucketKeys } from "../src/constants";
import { dailyGames } from "./data/backend/dailyGames";
import { guessWords } from "./data/backend/guessWords";
import { stopWords } from "./data/backend/stopWords";
import { fruit } from "./data/backend/wordLists/fruit";
import { isaiah } from "./data/backend/wordLists/isaiah";

export async function fetchMock(url) {
  const language = "english";
  const BACKEND_BUCKET = "https://test-bible-contexto-backend.s3.amazonaws.com";
  switch (url) {
    case `${BACKEND_BUCKET}/${language}/${bucketKeys.dailyGames}`:
      return createFetchResponse(dailyGames);
    case `${BACKEND_BUCKET}/${language}/${bucketKeys.guessWords}`:
      return createFetchResponse(guessWords);
    case `${BACKEND_BUCKET}/${language}/${bucketKeys.stopWords}`:
      return createFetchResponse(stopWords);
    case `${BACKEND_BUCKET}/${language}/${"625fc8f4-5d80-4c18-9f42-93573a34fb6c"}`:
      return createFetchResponse(fruit);
    case `${BACKEND_BUCKET}/${language}/${"1c9040fa-e869-466f-a6cb-6148e498e9b7"}`:
      return createFetchResponse(isaiah);
    default:
      throw Error("No mock data available");
  }
}

function createFetchResponse(data) {
  return {
    text: () => new Promise((resolve) => resolve(data)),
    ok: true,
  };
}

export async function submitUserInput(screen, inputText) {
  const inputElement = screen.getByPlaceholderText("Enter a word");
  await userEvent.type(inputElement, `${inputText}{enter}`);
}

export function testTextFrequency(screen, expectedTextFrequencyMapping) {
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