// Type definitions for Google Apps Script
declare global {
  namespace google {
    namespace script {
      interface Run {
        withSuccessHandler(callback: (value: any) => void): Run;
        withFailureHandler(callback: (error: any) => void): Run;
        chatWithGemini(message: string): void;
        sendToGemini(prompt: string): void;
        testChat(message: string): void;
        getCurrentUser(): void;
        testServerConnection(): void;
        getAppConfig(): void;
        clearConversation(conversationId: string): void;
        getGeminiCapabilities(): void;
      }

      const run: Run;
    }
  }

  const google: typeof google;
}

export { };
