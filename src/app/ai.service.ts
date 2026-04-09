import { Injectable, NgZone } from '@angular/core';
import {
  CreateWebWorkerMLCEngine,
  InitProgressReport,
  WebWorkerMLCEngine
} from "@mlc-ai/web-llm";

@Injectable({ providedIn: 'root' })
export class AiService {
  private engine: WebWorkerMLCEngine | null = null;
  private initPromise: Promise<void> | null = null;

  constructor(private zone: NgZone) {
    // start loading immediately
    this.init();
  }

  private async doInit(onProgress?: (p: InitProgressReport) => void) {
    console.log("Initializing AI engine…");

    const worker = new Worker(
      new URL('../worker/webllm.worker.ts', import.meta.url),
      { type: 'module' }
    );

    const modelId = "Qwen2.5-0.5B-Instruct-q4f16_1-MLC";

    try {
      this.engine = await CreateWebWorkerMLCEngine(
        worker,
        modelId,
        { initProgressCallback: onProgress }
      );
      console.log("Engine initialized:", this.engine);
    } catch (err) {
      console.error("ENGINE INIT ERROR (RAW):", err);
      this.engine = null;
    }
  }

  async init(onProgress?: (p: InitProgressReport) => void): Promise<void> {
    if (this.engine) return;

    if (!this.initPromise) {
      this.initPromise = this.doInit(onProgress).finally(() => {
        // allow retry if it truly failed
        if (!this.engine) {
          this.initPromise = null;
        }
      });
    }

    return this.initPromise;
  }

  async *askStream(prompt: string): AsyncGenerator<string> {
    // ensure engine is fully initialized
    if (!this.engine) {
      console.log("Engine missing — awaiting init…");
      await this.init();
    }

    if (!this.engine) {
      console.error("Engine still null after awaited init.");
      yield "⚠️ AI engine failed to initialize.";
      return;
    }

    console.log("Starting stream for prompt:", prompt);

    const stream = await this.engine.chat.completions.create({
      messages: [
		{
		  role: "system",
		  content: "You respond ONLY in English. Do not use any other language under any circumstances. If the user writes in another language, translate it to English and answer in English."
		},
        {
          role: "user",
          content: "Respond ONLY in English. " + prompt
        }
      ],
      stream: true
    });

for await (const chunk of stream) {
  const token = chunk.choices[0]?.delta?.content ?? "";

  console.log("RAW TOKEN:", JSON.stringify(token));

  // do NOT filter yet
  yield token;
}


  }
}
