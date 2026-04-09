import { Component, NgZone, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AiService } from './ai.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
<div style="padding:20px; max-width:600px; margin:auto;">
  <h2>Angular 21 AI Chat by Matthew Lind</h2>
  <h3>Uses WebLLM for the AI engine</h3>
  <textarea
    [(ngModel)]="input"
    (focus)="clearOnFocus()"
    (keydown)="handleKey($event)"
    rows="4"
    style="width:100%; margin-bottom:10px;">
  </textarea>

  <button type="button" (click)="send()" [disabled]="loading">
    {{ loading ? 'Thinking…' : 'Ask' }}
  </button>

  <div style="margin-top:20px; padding:10px; background:#eee; min-height:60px;">
    <strong>AI Response:</strong>
    <div #responseBox style="white-space: pre-wrap;"></div>
  </div>

  <!-- TECHNICAL DOCUMENTATION SECTION -->
  <div style="margin-top:30px; padding:20px; background:#fafafa; border:1px solid #ddd; border-radius:6px; max-height:500px; overflow-y:auto;">

    <h2 style="margin-top:0;">📘 ChatComponent Technical Documentation</h2>
    <p><strong>Angular 21 • WebLLM • Streaming LLM UI</strong></p>

    <h3>Overview</h3>
    <p>
      <code>ChatComponent</code> is a standalone Angular 21 UI module that provides a lightweight,
      browser‑only AI chat interface powered by <strong>WebLLM</strong>. It streams tokens in real time,
      auto‑updates the UI, and requires no backend, no API keys, and no server‑side compute.
    </p>

    <h3>✨ Key Features</h3>
    <ul>
      <li><strong>Fully Local AI (WebLLM)</strong> — all inference runs in the browser using WebGPU.</li>
      <li><strong>Real‑Time Token Streaming</strong> — smooth UI updates using async generators.</li>
      <li><strong>Minimal UI</strong> — simple textarea input and streaming output window.</li>
      <li><strong>Drop‑In Model Switching</strong> — change models by editing one line of code.</li>
    </ul>

    <h3>🧩 Architecture</h3>
    <ul>
      <li><strong>ChatComponent</strong> — UI, streaming, rendering, auto‑scroll.</li>
      <li><strong>AiService</strong> — loads WebLLM worker and streams tokens.</li>
      <li><strong>worker.js</strong> — runs the model in a separate thread.</li>
      <li><strong>Model Assets</strong> — stored in <code>/public/models/</code>.</li>
    </ul>

    <h3>🛠 Technologies Used</h3>
    <ul>
      <li><strong>Angular 21</strong> — standalone components, NgZone optimization.</li>
      <li><strong>WebLLM</strong> — browser‑only LLM inference with WebGPU.</li>
      <li><strong>TypeScript</strong> — typed async streaming.</li>
      <li><strong>Web Worker</strong> — prevents UI blocking.</li>
      <li><strong>MutationObserver</strong> — detects when streaming stops.</li>
    </ul>

    <h3>🔄 Model Options (Swap by Changing One Line)</h3>
    <p>Change the model by editing:</p>
    <pre style="background:#333; color:#fff; padding:10px; border-radius:4px;">
const modelId = "Qwen2.5-0.5B-Instruct-q4f16_1-MLC";
    </pre>

    <h4>1. Qwen2.5‑0.5B‑Instruct (Fastest)</h4>
    <pre style="background:#f0f0f0; padding:10px;">Qwen2.5-0.5B-Instruct-q4f16_1-MLC</pre>

    <h4>2. Qwen2.5‑1.5B‑Instruct (Balanced)</h4>
    <pre style="background:#f0f0f0; padding:10px;">Qwen2.5-1.5B-Instruct-q4f16_1-MLC</pre>

    <h4>3. Llama‑3.2‑3B‑Instruct (Highest Quality)</h4>
    <pre style="background:#f0f0f0; padding:10px;">Llama-3.2-3B-Instruct-q4f16_1-MLC</pre>

    <h3>📄 Component Behavior</h3>
    <ul>
      <li><strong>User Input</strong> — Enter to send, Shift+Enter for newline.</li>
      <li><strong>Streaming Loop</strong> — token‑by‑token updates.</li>
      <li><strong>UI State</strong> — loading indicator auto‑resets.</li>
      <li><strong>Auto‑Scroll</strong> — keeps latest token visible.</li>
    </ul>

    <h3>📦 File Integration</h3>
    <ul>
      <li><strong>chat.component.ts</strong> — UI + streaming.</li>
      <li><strong>ai.service.ts</strong> — worker + model loader.</li>
      <li><strong>worker.js</strong> — WebLLM engine.</li>
    </ul>

    <h3>🚀 How to Change Models</h3>
    <ol>
      <li>Open <code>ai.service.ts</code></li>
      <li>Find the <code>modelId</code> constant</li>
      <li>Replace with any supported model ID</li>
      <li>Restart Angular</li>
    </ol>

    <h3>📚 Future Enhancements</h3>
    <ul>
      <li>Chat bubbles</li>
      <li>Dark mode</li>
      <li>Floating chat widget</li>
      <li>RAG‑lite (site‑aware AI)</li>
      <li>LocalStorage chat memory</li>
    </ul>

  </div>
</div>
  `
})
export class ChatComponent {
  @ViewChild('responseBox') responseBox!: ElementRef<HTMLDivElement>;

  input = '';
  loading = false;

  private observer!: MutationObserver;
  private lastMutation = Date.now();
  private HARD_TIMEOUT = 15000; // 15 seconds safety net

  constructor(private ai: AiService, private zone: NgZone) {}

  ngAfterViewInit() {
    // Watch for output changes
    this.observer = new MutationObserver(() => {
      this.lastMutation = Date.now();
    });

    this.observer.observe(this.responseBox.nativeElement, {
      childList: true,
      characterData: true,
      subtree: true
    });
	document.addEventListener('click', () => {
	  if (this.loading) {
		this.zone.run(() => (this.loading = false));
	  }
	});
    // Fallback: if no output for 600ms, assume stream ended
    setInterval(() => {
      if (this.loading && Date.now() - this.lastMutation > 600) {
        this.zone.run(() => (this.loading = false));
      }
    }, 300);

    // Hard timeout: never let UI get stuck
    setInterval(() => {
      if (this.loading && Date.now() - this.lastMutation > this.HARD_TIMEOUT) {
        this.zone.run(() => {
          this.loading = false;
          this.responseBox.nativeElement.append("\n\n[Stream ended due to timeout]");
        });
      }
    }, 1000);
  }

  private scrollToBottom() {
    const el = this.responseBox.nativeElement;
    el.scrollTop = el.scrollHeight;
  }

  async send() {
    if (!this.input.trim() || this.loading) return;

    this.loading = true;
    this.responseBox.nativeElement.textContent = '';
    this.lastMutation = Date.now();

    this.zone.runOutsideAngular(async () => {
      try {
        for await (const token of this.ai.askStream(this.input)) {
          this.zone.run(() => {
            this.responseBox.nativeElement.append(token);
            this.scrollToBottom();
          });
          this.lastMutation = Date.now();
        }
      } catch (err) {
        this.zone.run(() => {
          this.responseBox.nativeElement.textContent =
            'Error: ' + (err as any).message;
        });
      } finally {
        this.zone.run(() => {
          this.loading = false;
        });
      }
    });
  }

  clearOnFocus() {
    if (!this.loading) {
      this.input = '';
    }
  }

  handleKey(event: KeyboardEvent) {
    if (event.key === 'Enter' && event.shiftKey) return;

    if (event.key === 'Enter') {
      event.preventDefault();
      if (!this.loading && this.input.trim()) {
        this.send();
      }
    }
  }
}
