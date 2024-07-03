import { Button } from "@mui/material";

interface ShareScoreProps {
  guessStats: string;
  guesses: number;
}

const ShareScore = ({
  guessStats,
  guesses
}: ShareScoreProps) => {


  const handleShare = () => {

    if (navigator.share) {
      navigator.share({
        title: 'Bible Contexto',
        text: `I guessed the word in ${guesses} guesses:\n\n${guessStats}\n\n${window.location.href}`,
      }).then(() => {
        console.log('Score shared successfully');
      }).catch(err => {
        console.error('Error sharing the score: ', err);
      });
    } else {
      // Fallback for browsers that do not support the Web Share API
      navigator.clipboard.writeText(`I guessed the word in ${guesses} guesses:\n${guessStats}\n\n${window.location.href}`).then(() => {
        alert('Score copied to clipboard!');
      }).catch(err => {
        console.error('Failed to copy: ', err);
      });
    }
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleShare}>Share</Button>
    </div>
  );
};

export default ShareScore;
