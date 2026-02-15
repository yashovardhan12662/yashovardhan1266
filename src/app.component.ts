import { Component, signal } from '@angular/core';
import { LearningAssistantComponent } from './components/learning-assistant.component';
import { DevToolsComponent } from './components/dev-tools.component';
import { KnowledgeOrganizerComponent } from './components/knowledge-organizer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LearningAssistantComponent, DevToolsComponent, KnowledgeOrganizerComponent],
  template: `
    <div class="flex h-screen w-screen bg-slate-50 overflow-hidden font-sans">
      
      <!-- Sidebar -->
      <aside class="w-20 md:w-64 bg-slate-900 text-white flex flex-col shadow-xl z-10 shrink-0 transition-all duration-300">
        <div class="p-6 flex items-center justify-center md:justify-start gap-3 border-b border-slate-800">
          <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-lg font-bold">
            AI
          </div>
          <span class="hidden md:block font-bold text-lg tracking-tight">Study & Build</span>
        </div>

        <nav class="flex-1 py-6 px-3 space-y-2">
          <button (click)="activeTab.set('learning')"
            class="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors group"
            [class]="activeTab() === 'learning' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' : 'text-slate-400 hover:bg-slate-800 hover:text-white'">
            <span class="text-xl">📚</span>
            <span class="hidden md:block font-medium">Learning</span>
          </button>

          <button (click)="activeTab.set('dev')"
            class="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors group"
            [class]="activeTab() === 'dev' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/50' : 'text-slate-400 hover:bg-slate-800 hover:text-white'">
            <span class="text-xl">💻</span>
            <span class="hidden md:block font-medium">Dev Tools</span>
          </button>

          <button (click)="activeTab.set('knowledge')"
            class="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors group"
            [class]="activeTab() === 'knowledge' ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/50' : 'text-slate-400 hover:bg-slate-800 hover:text-white'">
            <span class="text-xl">🧠</span>
            <span class="hidden md:block font-medium">Knowledge</span>
          </button>
        </nav>

        <div class="p-4 border-t border-slate-800 text-xs text-slate-500 text-center md:text-left">
          <p class="hidden md:block">Powered by Gemini 2.5</p>
          <p class="md:hidden">Gemini</p>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 relative overflow-hidden flex flex-col">
        <!-- Header for mobile mostly, but good for title context -->
        <header class="h-16 bg-white border-b border-slate-200 flex items-center px-6 justify-between shrink-0">
          <h1 class="text-xl font-bold text-slate-800">
            @switch (activeTab()) {
              @case ('learning') { Learning Assistant }
              @case ('dev') { Developer Tools }
              @case ('knowledge') { Knowledge Organizer }
            }
          </h1>
          <div class="flex items-center gap-2">
            <span class="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded uppercase tracking-wider">Online</span>
          </div>
        </header>

        <!-- Content Area -->
        <div class="flex-1 overflow-auto bg-slate-50">
          @switch (activeTab()) {
            @case ('learning') {
              <app-learning-assistant></app-learning-assistant>
            }
            @case ('dev') {
              <app-dev-tools></app-dev-tools>
            }
            @case ('knowledge') {
              <app-knowledge-organizer></app-knowledge-organizer>
            }
          }
        </div>
      </main>
    </div>
  `
})
export class AppComponent {
  activeTab = signal<'learning' | 'dev' | 'knowledge'>('learning');
}