# Generative Thread Studio 🧵✨
### Maryam Firuzi Style AI Photography & Baluchi Embroidery Synthesis

An AI art collaboration project designed for fine-art exhibition at international art fairs (Art Basel, Paris Photo, Frieze). 

Inspired by Iranian artist **Maryam Firuzi's** *"Women in Mirrors"* photography series, this project combines **AI image stylization**, **generative embroidery thread models**, and **tactile hand-stitching co-creation**.

---

## 🌟 Key Features

1. **Interactive Studio App (`index.html`):**
   * Real-time HTML5 Canvas edge detection and procedural Baluchi embroidery thread synthesis.
   * Fine-tune Iranian earth tone warmth, cinematic shadow contrast, and brass mirror frame overlays.
   * Color palette picker for traditional Baluchi silk colors (`Baluchi Crimson`, `Royal Gold`, `Persian Turquoise`).

2. **Free PyTorch Training Pipeline (`Firuzi_Generative_Thread_Training.ipynb`):**
   * 1-Click free GPU training notebook on Google Colab (Tesla T4 GPU).
   * Fine-tunes SDXL / FLUX.1 LoRA adapters on Maryam Firuzi's photography aesthetic.

3. **FastAPI & OpenCV Backend (`backend/`):**
   * Python REST API endpoint serving the Generative Thread Model.

---

## 🚀 Quick Start

### 1. Launch Interactive Studio App Locally
```bash
python3 -m http.server 8080
```
Open `http://localhost:8080` in your web browser.

### 2. Free Model Training on Google Colab
Open [`Firuzi_Generative_Thread_Training.ipynb`](Firuzi_Generative_Thread_Training.ipynb) in [Google Colab](https://colab.research.google.com) to train your model for free on an NVIDIA T4 GPU.

### 3. Run FastAPI Inference Server
```bash
pip install -r backend/requirements.txt
python backend/api_server.py
```

---

## 🛠 Tech Stack
* **Frontend:** HTML5 Canvas, Vanilla JS (ES6+), Modern CSS3 (Glassmorphism & Cormorant Garamond Typography).
* **AI Training:** Python 3.10+, PyTorch, Hugging Face `diffusers`, `peft`, `accelerate`.
* **Computer Vision:** OpenCV, Segment Anything Model (SAM), MediaPipe.
