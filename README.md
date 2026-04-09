# Angular 21 AI Chat (WebLLM • Browser‑Only LLM Inference)

A lightweight, fully client‑side AI chat application built with **Angular 21** and **WebLLM**, running entirely in the browser with **no backend**, **no API keys**, and **no server compute**.  
This project demonstrates real‑time token streaming, WebGPU‑accelerated inference, and a clean chat UI powered by a local LLM.

Live development URL (local):  
`http://localhost:4200/`

---

## 🚀 Features

- **100% Browser‑Only AI**  
  Runs an LLM directly in the browser using WebLLM — no cloud calls, no external APIs.

- **Real‑Time Token Streaming**  
  Smooth, incremental output using async generators and Angular’s optimized rendering.

- **WebGPU Acceleration**  
  Automatically uses GPU when available for faster inference.

- **Drop‑In Model Switching**  
  Swap between supported models by changing a single line in `ai.service.ts`.

- **Clean, Minimal Chat UI**  
  Simple textarea input, streaming output window, and auto‑scrolling.

- **Zero Backend Required**  
  Works offline once the model is cached.

---

## 🧠 Models Supported

This app supports multiple WebLLM‑compiled models.  
Switch models by editing:

```ts
const modelId = "Qwen2.5-0.5B-Instruct-q4f16_1-MLC";

## Models Supported

This app supports multiple WebLLM‑compiled models.  
Switch models by editing the `modelId` constant in `ai.service.ts`.

### Qwen2.5‑0.5B‑Instruct‑q4f16_1‑MLC  
Fastest and smallest model — ideal for demos and mobile devices.

### Qwen2.5‑1.5B‑Instruct‑q4f16_1‑MLC  
Balanced performance and quality.

### Llama‑3.2‑3B‑Instruct‑q4f16_1‑MLC  
Highest quality and strongest reasoning — recommended for desktop GPUs.


---

# AiTest

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.1.4.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
