/**
 * Gemini AI Integration for Google Apps Script
 * Handles chat functionality and AI responses
 */

/**
 * Configuration for Gemini API
 * You'll need to set up your Gemini API key in Google Apps Script
 * Go to Extensions -> Apps Script -> Project Settings -> Script Properties
 * Add a property: GEMINI_API_KEY with your actual API key
 */
const GEMINI_CONFIG = {
  API_ENDPOINT: 'https://generativelanguage.googleapis.com/v1beta/models',
  API_KEY: getGeminiApiKey_(),
  MODEL: 'gemini-2.5-pro-preview-05-06',
  MAX_TOKENS: 1000,
  TEMPERATURE: 0.7
};

/**
 * Get Gemini API key from script properties
 */
function getGeminiApiKey_() {
  const properties = PropertiesService.getScriptProperties();
  const apiKey = properties.getProperty('GEMINI_API_KEY');

  if (!apiKey) {
    throw new Error('Gemini API key not found. Please set GEMINI_API_KEY in Script Properties.');
  }

  return apiKey;
}

/**
 * Send a message to Gemini and get a response
 * @param {string} message - The user's message
 * @param {Array} conversationHistory - Previous messages for context (optional)
 * @returns {Object} Response object with message and metadata
 */
function sendToGemini(message, conversationHistory = []) {
  try {
    if (!message || typeof message !== 'string') {
      throw new Error('Invalid message provided');
    }

    const apiKey = getGeminiApiKey();
    const url = `${GEMINI_CONFIG.API_ENDPOINT}/${GEMINI_CONFIG.MODEL}:generateContent?key=${GEMINI_CONFIG.API_KEY}`;

    // Prepare the conversation context
    let contextPrompt = '';
    if (conversationHistory && conversationHistory.length > 0) {
      contextPrompt = 'Previous conversation:\n' +
        conversationHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n') +
        '\n\nCurrent message:\n';
    }

    const payload = {
      contents: [{
        parts: [{
          text: contextPrompt + message
        }]
      }],
      generationConfig: {
        temperature: GEMINI_CONFIG.TEMPERATURE,
        maxOutputTokens: GEMINI_CONFIG.MAX_TOKENS,
        topP: 0.8,
        topK: 40
      },
      // safetySettings: [
      //   {
      //     category: "HARM_CATEGORY_HARASSMENT",
      //     threshold: "BLOCK_MEDIUM_AND_ABOVE"
      //   },
      //   {
      //     category: "HARM_CATEGORY_HATE_SPEECH",
      //     threshold: "BLOCK_MEDIUM_AND_ABOVE"
      //   },
      //   {
      //     category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
      //     threshold: "BLOCK_MEDIUM_AND_ABOVE"
      //   },
      //   {
      //     category: "HARM_CATEGORY_DANGEROUS_CONTENT",
      //     threshold: "BLOCK_MEDIUM_AND_ABOVE"
      //   }
      // ]
    };

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      payload: JSON.stringify(payload)
    };

    const response = UrlFetchApp.fetch(url, options);
    const responseData = JSON.parse(response.getContentText());

    if (response.getResponseCode() !== 200) {
      throw new Error(`Gemini API error: ${responseData.error?.message || 'Unknown error'}`);
    }

    if (!responseData.candidates || responseData.candidates.length === 0) {
      throw new Error('No response generated by Gemini');
    }

    const generatedText = responseData.candidates[0].content.parts[0].text;

    return {
      success: true,
      message: generatedText,
      timestamp: new Date().toISOString(),
      metadata: {
        model: GEMINI_CONFIG.MODEL,
        tokensUsed: responseData.usageMetadata?.totalTokenCount || 0,
        finishReason: responseData.candidates[0].finishReason
      }
    };

  } catch (error) {
    console.error('Error in sendToGemini:', error);
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Chat function that maintains conversation history
 * @param {string} userMessage - The user's message
 * @param {string} conversationId - Unique identifier for the conversation
 * @returns {Object} Chat response
 */
function chatWithGemini(userMessage, conversationId = null) {
  try {
    // Generate conversation ID if not provided
    if (!conversationId) {
      conversationId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // Get conversation history from cache (you could also use PropertiesService for persistence)
    const cache = CacheService.getScriptCache();
    const historyKey = `conversation_${conversationId}`;
    let conversationHistory = [];

    const cachedHistory = cache.get(historyKey);
    if (cachedHistory) {
      conversationHistory = JSON.parse(cachedHistory);
    }

    // Send to Gemini
    const geminiResponse = sendToGemini(userMessage, conversationHistory);

    if (geminiResponse.success) {
      // Update conversation history
      conversationHistory.push({
        role: 'user',
        content: userMessage,
        timestamp: new Date().toISOString()
      });

      conversationHistory.push({
        role: 'assistant',
        content: geminiResponse.message,
        timestamp: geminiResponse.timestamp
      });

      // Keep only last 10 messages to stay within cache limits
      if (conversationHistory.length > 10) {
        conversationHistory = conversationHistory.slice(-10);
      }

      // Save updated history to cache (expires in 6 hours)
      cache.put(historyKey, JSON.stringify(conversationHistory), 21600);

      return {
        success: true,
        message: geminiResponse.message,
        conversationId: conversationId,
        timestamp: geminiResponse.timestamp,
        metadata: geminiResponse.metadata
      };
    } else {
      return geminiResponse;
    }

  } catch (error) {
    console.error('Error in chatWithGemini:', error);
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Clear conversation history
 * @param {string} conversationId - The conversation ID to clear
 */
function clearConversation(conversationId) {
  try {
    const cache = CacheService.getScriptCache();
    const historyKey = `conversation_${conversationId}`;
    cache.remove(historyKey);

    return {
      success: true,
      message: 'Conversation cleared successfully'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get available Gemini models and capabilities
 */
function getGeminiCapabilities() {
  return {
    model: GEMINI_CONFIG.MODEL,
    maxTokens: GEMINI_CONFIG.MAX_TOKENS,
    features: [
      'Text generation',
      'Conversation',
      'Code understanding',
      'Creative writing',
      'Question answering'
    ],
    safetySettings: 'Enabled',
    languages: 'Multi-language support'
  };
}
