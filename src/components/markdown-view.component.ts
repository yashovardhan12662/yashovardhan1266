import { Component, input, effect, ElementRef, viewChild, ViewEncapsulation } from '@angular/core';

declare var marked: any;

@Component({
  selector: 'app-markdown-view',
  standalone: true,
  template: `
    <div #contentRef class="prose prose-slate max-w-none prose-headings:text-slate-800 prose-p:text-slate-600 prose-code:text-pink-600 prose-pre:bg-slate-900 prose-pre:text-slate-50 p-4"></div>
  `,
  styles: [`
    /* Custom scrollbar for code blocks if needed */
    pre { overflow-x: auto; }
  `],
  encapsulation: ViewEncapsulation.None
})
export class MarkdownViewComponent {
  data = input.required<string>();
  contentRef = viewChild.required<ElementRef>('contentRef');

  constructor() {
    effect(() => {
      const rawMarkdown = this.data();
      const html = marked.parse(rawMarkdown);
      this.contentRef().nativeElement.innerHTML = html;
    });
  }
}