import { Injectable } from '@angular/core';
import { GoogleGenAI } from '@google/genai';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env['API_KEY'] });
  }

  async generateContent(prompt: string, systemContext: string): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction: systemContext,
        }
      });
      
      return response.text || 'No response generated.';
    } catch (error) {
      console.error('Gemini API Error:', error);
      return 'Error generating content. Please check your API key or try again later.';
    }
  }
}