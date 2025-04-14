interface ChatGPTResponse {
  items: string[];
  title: string;
  message: string;
  backgroundPrompt?: string;
}

export const generateBingoItems = async (
  topic: string,
  apiKey: string
): Promise<ChatGPTResponse> => {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a creative assistant that generates engaging bingo card content. 
          Generate exactly 30 themed words and 5 relevant emojis for the given topic.
          Respond only with JSON containing:
          - An array of exactly 35 items (30 words + 5 emojis at the end)
          - A title for the bingo card
          - A fun, engaging custom message that creates excitement for the event
          - A background prompt describing an ideal themed background image
          Keep the message short (max 50 characters) and playful.
          Create an atmospheric ${topic} background showing essential objects
          arranged naturally. Use different colors.
          No people or text, only inanimate objects that capture the essence of this event.`
        },
        {
          role: 'user',
          content: `Generate content for a bingo card themed around: ${topic}. 
          Include in your JSON response:
          - "items": array of exactly 35 items (30 themed words followed by 5 relevant emojis)
          - "title": string for the card title
          - "message": string for a fun, engaging message
          - "backgroundPrompt": string describing an ideal themed background image
          Keep items concise and entertaining.`
        }
      ],
      temperature: 0.8,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate bingo items');
  }

  const data = await response.json();
  try {
    const content = JSON.parse(data.choices[0].message.content);
    return {
      items: content.items,
      title: content.title,
      message: content.message,
      backgroundPrompt: content.backgroundPrompt
    };
  } catch (error) {
    throw new Error('Failed to parse ChatGPT response');
  }
};