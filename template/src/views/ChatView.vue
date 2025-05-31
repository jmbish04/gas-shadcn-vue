<template>
  <div class="container mx-auto p-4 h-full max-h-screen flex flex-col">
    <h1 class="text-3xl font-bold mb-4">Chat</h1>

    <Card class="flex-1 flex flex-col">
      <CardHeader>
        <CardTitle>Chat Interface</CardTitle>
      </CardHeader>
      <CardContent class="flex-1 flex flex-col">
        <!-- Messages Area -->
        <ScrollArea class="flex-1 h-96 mb-4 p-4 border rounded">
          <div class="space-y-4">
            <div v-for="message in messages" :key="message.id"
                 :class="['p-3 rounded-lg max-w-xs', message.sender === 'user' ? 'bg-primary text-primary-foreground ml-auto' : 'bg-muted']">
              <p class="text-sm font-medium mb-1">{{ message.sender === 'user' ? 'You' : 'Assistant' }}</p>
              <p>{{ message.text }}</p>
              <p class="text-xs opacity-70 mt-1">{{ message.time }}</p>
            </div>
          </div>
        </ScrollArea>

        <!-- Input Area -->
        <div class="flex gap-2">
          <Textarea
            v-model="newMessage"
            placeholder="Type your message..."
            class="flex-1"
            :disabled="isLoading"
            @keydown.enter.prevent="sendMessage"
          />
          <Button @click="sendMessage" :disabled="!newMessage.trim() || isLoading">
            {{ isLoading ? 'Sending...' : 'Send' }}
          </Button>
        </div>

        <!-- Loading indicator -->
        <div v-if="isLoading" class="flex items-center justify-center mt-2">
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span class="text-sm text-muted-foreground">AI is thinking...</span>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { ref } from 'vue';

const newMessage = ref('');
const isLoading = ref(false);

interface Message {
  id: number;
  sender: 'user' | 'assistant';
  text: string;
  time: string;
}

const messages = ref<Message[]>([
  {
    id: 1,
    sender: 'assistant',
    text: 'Hello! I\'m powered by Google Gemini AI. How can I help you today?',
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
]);

// Check if running in Google Apps Script environment
const isGAS = () => {
  return typeof google !== 'undefined' && google.script && google.script.run;
};

const sendMessage = async () => {
  if (!newMessage.value.trim() || isLoading.value) return;

  const userMessage = newMessage.value.trim();
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Add user message
  messages.value.push({
    id: messages.value.length + 1,
    sender: 'user',
    text: userMessage,
    time: currentTime
  });

  newMessage.value = '';
  isLoading.value = true;

  try {
    if (isGAS()) {
      // Use Google Apps Script backend
      await google.script.run
        .withSuccessHandler((response: any) => {
          let messageText = '';
          if (typeof response === 'string') {
            messageText = response;
          } else if (response && response.success && response.message) {
            messageText = response.message;
          } else if (response && response.error) {
            messageText = `Error: ${response.error}`;
          } else {
            messageText = 'Received an unexpected response format.';
          }

          messages.value.push({
            id: messages.value.length + 1,
            sender: 'assistant',
            text: messageText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          });
          isLoading.value = false;
        })
        .withFailureHandler((error: any) => {
          console.error('Error calling GAS function:', error);
          messages.value.push({
            id: messages.value.length + 1,
            sender: 'assistant',
            text: 'Sorry, I encountered an error. Please try again.',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          });
          isLoading.value = false;
        })
        .chatWithGemini(userMessage);
    } else {
      // Development fallback - simulate response
      setTimeout(() => {
        messages.value.push({
          id: messages.value.length + 1,
          sender: 'assistant',
          text: `This is a development mode response to: "${userMessage}". In production, this would be handled by Google Gemini AI.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
        isLoading.value = false;
      }, 1000);
    }
  } catch (error) {
    console.error('Error sending message:', error);
    messages.value.push({
      id: messages.value.length + 1,
      sender: 'assistant',
      text: 'Sorry, I encountered an error. Please try again.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    isLoading.value = false;
  }
};
</script>
