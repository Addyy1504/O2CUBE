const ChatBubble = ({ sender, text }) => {
  const isUser = sender === 'user';

  // Function to format text into JSX with clickable links
  const formatMessage = (msg) => {
    const waRegex = /(https:\/\/wa\.me\/[0-9?=&]+)/g;
    const parts = msg.split(waRegex);

    return parts.map((part, index) => {
      if (waRegex.test(part)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-blue-600 font-medium underline hover:text-blue-800 ml-1"
          >
            👉 Click here to chat on WhatsApp
          </a>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`px-3 py-2 rounded-xl text-sm max-w-[75%] whitespace-pre-line ${isUser ? 'bg-black text-white' : 'bg-gray-200 text-black'}`}>
        {formatMessage(text)}
      </div>
    </div>
  );
};

export default ChatBubble;


