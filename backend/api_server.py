"""
Generative Thread Model - FastAPI Inference Server
Author: Antigravity AI & Maryam Firuzi Collaboration Project
Description: Exposes REST API endpoint to upload photos and generate style-transferred artwork with embroidery threads.
"""

from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import Response, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import io
import cv2
import numpy as np
from PIL import Image

app = FastAPI(title="Generative Thread Model API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {
        "status": "online",
        "model": "Generative Thread Model (Maryam Firuzi Style)",
        "version": "1.0.0",
    }


@app.post("/api/generate-thread-art")
async def generate_thread_art(
    file: UploadFile = File(...),
    warmth: float = Form(0.85),
    stitch_density: int = Form(65),
    palette: str = Form("baluchi"),
):
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        img_np = np.array(image)

        # 1. Warmth & Tone Filter
        img_bgr = cv2.cvtColor(img_np, cv2.COLOR_RGB2BGR)
        img_bgr[:, :, 2] = np.clip(img_bgr[:, :, 2] * (1 + warmth * 0.25), 0, 255)  # R
        img_bgr[:, :, 0] = np.clip(img_bgr[:, :, 0] * (1 - warmth * 0.2), 0, 255)  # B

        # 2. Contour & Thread Detection
        gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
        edges = cv2.Canny(gray, 50, 150)

        # 3. Draw Synthetic Baluchi Embroidery Thread Overlays
        contours, _ = cv2.findContours(edges, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
        
        # Color palettes in BGR
        palette_colors = {
            "baluchi": [(53, 38, 184), (53, 173, 229), (117, 107, 29), (130, 91, 214)],
            "gold_silk": [(55, 175, 212), (171, 229, 243), (21, 101, 153)],
        }
        colors = palette_colors.get(palette, palette_colors["baluchi"])

        for i, cnt in enumerate(contours):
            if i % max(1, (100 - stitch_density) // 10) == 0 and len(cnt) > 5:
                color = colors[i % len(colors)]
                cv2.drawContours(img_bgr, [cnt], -1, color, 2, cv2.LINE_AA)

        # Output encoded PNG
        _, encoded_img = cv2.imencode(".png", img_bgr)
        return Response(content=encoded_img.tobytes(), media_type="image/png")

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
