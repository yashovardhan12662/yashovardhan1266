import { Component, inject, signal } from '@angular/core';
import { GeminiService } from '../services/gemini.service';
import { MarkdownViewComponent } from './markdown-view.component';

@Component({
  selector: 'app-learning-assistant',
  standalone: true,
  imports: [MarkdownViewComponent],
  template: `
    <div class="h-full flex flex-col p-6 max-w-4xl mx-auto space-y-6">
      
      <div class="space-y-2">
        <h2 class="text-2xl font-bold text-indigo-700 flex items-center gap-2">
          <span>📚</span> Learning Assistant
        </h2>
        <p class="text-slate-500">Simplify concepts, generate quizzes, or get summaries.</p>
      </div>

      <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-200 space-y-4">
        <div class="flex flex-col gap-2">
          <label class="font-medium text-slate-700">What do you want to learn?</label>
          <textarea 
            class="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" 
            rows="4"
            placeholder="e.g., Explain Quantum Computing, or paste a lecture note here..."
            [value]="userInput()"
            (input)="onInputChange($event)"
          ></textarea>
        </div>

        <div class="flex flex-wrap gap-2">
          <button (click)="setMode('eli5')" 
            class="px-4 py-2 rounded-full text-sm font-medium transition border"
            [class]="mode() === 'eli5' ? 'bg-indigo-100 text-indigo-700 border-indigo-200' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'">
            🐣 ELI5 (Simple)
          </button>
          <button (click)="setMode('advanced')" 
            class="px-4 py-2 rounded-full text-sm font-medium transition border"
            [class]="mode() === 'advanced' ? 'bg-indigo-100 text-indigo-700 border-indigo-200' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'">
            🎓 Advanced
          </button>
          <button (click)="setMode('quiz')" 
            class="px-4 py-2 rounded-full text-sm font-medium transition border"
            [class]="mode() === 'quiz' ? 'bg-indigo-100 text-indigo-700 border-indigo-200' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'">
            ❓ Generate Quiz
          </button>
          <button (click)="setMode('summary')" 
            class="px-4 py-2 rounded-full text-sm font-medium transition border"
            [class]="mode() === 'summary' ? 'bg-indigo-100 text-indigo-700 border-indigo-200' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'">
            📝 Summarize
          </button>
        </div>

        <div class="flex justify-end">
           <button 
            (click)="generateResponse()"
            [disabled]="isLoading() || !userInput()"
            class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
            @if (isLoading()) {
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Thinking...
            } @else {
              <span>Generate</span>
            }
          </button>
        </div>
      </div>

      @if (response()) {
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 flex-1 overflow-auto min-h-0">
          <app-markdown-view [data]="response()"></app-markdown-view>
        </div>
      }
    </div>
  `
})
export class LearningAssistantComponent {
  private geminiService = inject(GeminiService);
  
  userInput = signal('');
  mode = signal<'eli5' | 'advanced' | 'quiz' | 'summary'>('eli5');
  response = signal('');
  isLoading = signal(false);

  onInputChange(event: Event) {
    this.userInput.set((event.target as HTMLTextAreaElement).value);
  }

  setMode(m: 'eli5' | 'advanced' | 'quiz' | 'summary') {
    this.mode.set(m);
  }

  async generateResponse() {
    if (!this.userInput()) return;
    
    this.isLoading.set(true);
    const mode = this.mode();
    const input = this.userInput();
    
    let prompt = '';
    let context = 'You are an expert tutor. Output strictly in Markdown.';

    switch (mode) {
      case 'eli5':
        prompt = `Explain the following concept like I am 5 years old. Use analogies. \n\nInput: ${input}`;
        context += ' Use simple language, short sentences, and fun analogies.';
        break;
      case 'advanced':
        prompt = `Provide a comprehensive, technical, and advanced explanation of the following. Include key terminology and deeper insights. \n\nInput: ${input}`;
        context += ' Assume the user is an expert. Be concise but deep.';
        break;
      case 'quiz':
        prompt = `Generate a 5-question multiple choice quiz based on the following text/topic. Include the correct answer at the end. \n\nInput: ${input}`;
        break;
      case 'summary':
        prompt = `Summarize the following text into key bullet points and a "Key Takeaway" section. \n\nInput: ${input}`;
        break;
    }

    const result = await this.geminiService.generateContent(prompt, context);
    this.response.set(result);
    this.isLoading.set(false);
  }
}