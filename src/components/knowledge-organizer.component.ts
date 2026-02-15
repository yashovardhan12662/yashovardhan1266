import { Component, inject, signal } from '@angular/core';
import { GeminiService } from '../services/gemini.service';
import { MarkdownViewComponent } from './markdown-view.component';

@Component({
  selector: 'app-knowledge-organizer',
  standalone: true,
  imports: [MarkdownViewComponent],
  template: `
    <div class="h-full flex flex-col p-6 max-w-4xl mx-auto space-y-6">
      
      <div class="space-y-2">
        <h2 class="text-2xl font-bold text-amber-700 flex items-center gap-2">
          <span>🧠</span> Knowledge Organizer
        </h2>
        <p class="text-slate-500">Transform notes into flashcards, podcasts, or structured insights.</p>
      </div>

      <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-200 space-y-4">
        <div class="flex flex-col gap-2">
          <label class="font-medium text-slate-700">Paste your notes or text:</label>
          <textarea 
            class="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition" 
            rows="6"
            placeholder="Paste article text, meeting notes, or random thoughts..."
            [value]="notesInput()"
            (input)="onInputChange($event)"
          ></textarea>
        </div>

        <div class="flex flex-wrap gap-2">
          <button (click)="setMode('flashcards')" 
            class="px-4 py-2 rounded-full text-sm font-medium transition border"
            [class]="mode() === 'flashcards' ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'">
            📇 Flashcards
          </button>
          <button (click)="setMode('podcast')" 
            class="px-4 py-2 rounded-full text-sm font-medium transition border"
            [class]="mode() === 'podcast' ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'">
            🎙️ Podcast Script
          </button>
          <button (click)="setMode('insights')" 
            class="px-4 py-2 rounded-full text-sm font-medium transition border"
            [class]="mode() === 'insights' ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'">
            💡 Key Insights
          </button>
        </div>

        <div class="flex justify-end">
           <button 
            (click)="processNotes()"
            [disabled]="isLoading() || !notesInput()"
            class="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
            @if (isLoading()) {
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            } @else {
              <span>Organize</span>
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
export class KnowledgeOrganizerComponent {
  private geminiService = inject(GeminiService);
  
  notesInput = signal('');
  mode = signal<'flashcards' | 'podcast' | 'insights'>('flashcards');
  response = signal('');
  isLoading = signal(false);

  onInputChange(event: Event) {
    this.notesInput.set((event.target as HTMLTextAreaElement).value);
  }

  setMode(m: 'flashcards' | 'podcast' | 'insights') {
    this.mode.set(m);
  }

  async processNotes() {
    if (!this.notesInput()) return;
    
    this.isLoading.set(true);
    const mode = this.mode();
    const notes = this.notesInput();
    
    let prompt = '';
    let context = 'You are a Knowledge Management Expert. Output strictly in Markdown.';

    switch (mode) {
      case 'flashcards':
        prompt = `Create a set of study flashcards from the following text. Format as "Q: [Question] \n A: [Answer]". \n\nText: ${notes}`;
        break;
      case 'podcast':
        prompt = `Convert the following notes into an engaging script for a 2-host podcast (Host A and Host B). Make it conversational and easy to listen to. \n\nNotes: ${notes}`;
        break;
      case 'insights':
        prompt = `Extract the core insights, unique ideas, and actionable takeaways from the text. Format as a bulleted list. \n\nText: ${notes}`;
        break;
    }

    const result = await this.geminiService.generateContent(prompt, context);
    this.response.set(result);
    this.isLoading.set(false);
  }
}