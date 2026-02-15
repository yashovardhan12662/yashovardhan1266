import { Component, inject, signal } from '@angular/core';
import { GeminiService } from '../services/gemini.service';
import { MarkdownViewComponent } from './markdown-view.component';

@Component({
  selector: 'app-dev-tools',
  standalone: true,
  imports: [MarkdownViewComponent],
  template: `
    <div class="h-full flex flex-col p-6 max-w-4xl mx-auto space-y-6">
      
      <div class="space-y-2">
        <h2 class="text-2xl font-bold text-emerald-700 flex items-center gap-2">
          <span>💻</span> Developer Tools
        </h2>
        <p class="text-slate-500">Debug, document, or analyze code snippets instantly.</p>
      </div>

      <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-200 space-y-4">
        <div class="flex flex-col gap-2">
          <label class="font-medium text-slate-700">Paste your code here:</label>
          <textarea 
            class="w-full p-3 border border-slate-300 rounded-lg font-mono text-sm bg-slate-50 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition" 
            rows="6"
            placeholder="// Paste code snippet here..."
            [value]="codeSnippet()"
            (input)="onInputChange($event)"
          ></textarea>
        </div>

        <div class="flex flex-wrap gap-2">
          <button (click)="setMode('debug')" 
            class="px-4 py-2 rounded-full text-sm font-medium transition border"
            [class]="mode() === 'debug' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'">
            🐞 Debug
          </button>
          <button (click)="setMode('explain')" 
            class="px-4 py-2 rounded-full text-sm font-medium transition border"
            [class]="mode() === 'explain' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'">
            📖 Explain Code
          </button>
          <button (click)="setMode('doc')" 
            class="px-4 py-2 rounded-full text-sm font-medium transition border"
            [class]="mode() === 'doc' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'">
            📄 Generate Docs
          </button>
          <button (click)="setMode('flowchart')" 
            class="px-4 py-2 rounded-full text-sm font-medium transition border"
            [class]="mode() === 'flowchart' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'">
            🔄 Flowchart Logic
          </button>
        </div>

        <div class="flex justify-end">
           <button 
            (click)="analyzeCode()"
            [disabled]="isLoading() || !codeSnippet()"
            class="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
            @if (isLoading()) {
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            } @else {
              <span>Run Tool</span>
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
export class DevToolsComponent {
  private geminiService = inject(GeminiService);
  
  codeSnippet = signal('');
  mode = signal<'debug' | 'explain' | 'doc' | 'flowchart'>('debug');
  response = signal('');
  isLoading = signal(false);

  onInputChange(event: Event) {
    this.codeSnippet.set((event.target as HTMLTextAreaElement).value);
  }

  setMode(m: 'debug' | 'explain' | 'doc' | 'flowchart') {
    this.mode.set(m);
  }

  async analyzeCode() {
    if (!this.codeSnippet()) return;
    
    this.isLoading.set(true);
    const mode = this.mode();
    const code = this.codeSnippet();
    
    let prompt = '';
    let context = 'You are an expert Senior Software Engineer. Output strictly in Markdown. Use code blocks for code.';

    switch (mode) {
      case 'debug':
        prompt = `Analyze the following code for bugs, errors, or potential issues. Explain the problem and provide the fixed code. \n\nCode:\n\`\`\`\n${code}\n\`\`\``;
        break;
      case 'explain':
        prompt = `Explain the logic of this code line-by-line or function-by-function. \n\nCode:\n\`\`\`\n${code}\n\`\`\``;
        break;
      case 'doc':
        prompt = `Generate professional documentation (JSDoc/DocString style) and a high-level summary for this code. \n\nCode:\n\`\`\`\n${code}\n\`\`\``;
        break;
      case 'flowchart':
        prompt = `Describe the control flow of this code as a text-based flowchart or step-by-step logic sequence. \n\nCode:\n\`\`\`\n${code}\n\`\`\``;
        break;
    }

    const result = await this.geminiService.generateContent(prompt, context);
    this.response.set(result);
    this.isLoading.set(false);
  }
}