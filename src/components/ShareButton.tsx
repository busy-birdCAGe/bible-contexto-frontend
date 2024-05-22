interface ShareButtonProps {
  textToShare: string;
}

const ShareButton = ({ textToShare }: ShareButtonProps) => {
    const handleShare = async () => {
        // Check if Web Share API is supported
        if (navigator.share) {
          try {
            await navigator.share({
              title: 'Share Title',
              text: 'Share Text',
              url: 'https://example.com',
            });
            console.log('Successfully shared');
          } catch (error) {
            console.error('Error sharing:', error.message);
          }
        } else {
          console.log('Web Share API not supported on this browser');
        }
      };
    

  return (
    <button onClick={handleShare}>Share</button>
  );
};

export default ShareButton;
