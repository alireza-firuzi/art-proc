document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const fileInput = document.getElementById('file-input');
    const imageDropzone = document.getElementById('image-dropzone');
    const imgOriginal = document.getElementById('img-original');
    const outputCanvas = document.getElementById('output-canvas');
    const placeholderOriginal = document.getElementById('placeholder-original');
    const placeholderOutput = document.getElementById('placeholder-output');
    
    // Controls
    const sliderWarmth = document.getElementById('slider-warmth');
    const sliderContrast = document.getElementById('slider-contrast');
    const chkMirrorFrame = document.getElementById('chk-mirror-frame');
    const sliderDensity = document.getElementById('slider-stitch-density');
    const sliderThickness = document.getElementById('slider-thread-thickness');
    const btnGenerate = document.getElementById('btn-generate');
    const btnDownload = document.getElementById('btn-download');
    const btnExportPipeline = document.getElementById('btn-export-pipeline');
    
    // Labels
    const valWarmth = document.getElementById('val-warmth');
    const valContrast = document.getElementById('val-contrast');
    const valDensity = document.getElementById('val-density');
    const valThickness = document.getElementById('val-thickness');
    
    // Modal
    const modalExport = document.getElementById('modal-export');
    const btnCloseModal = document.getElementById('btn-close-modal');
    const codeExport = document.getElementById('code-export');
    const btnCopyCode = document.getElementById('btn-copy-code');
    
    // State
    let loadedImage = null;
    let selectedPalette = 'baluchi';
    
    const palettes = {
        baluchi: ['#b82635', '#e5ad35', '#1d6b75', '#d65b82', '#f4e9d5'],
        gold_silk: ['#d4af37', '#f3e5ab', '#996515', '#e6c666'],
        desert_monochrome: ['#ffffff', '#c2a68c', '#8c6b53', '#4a3b32']
    };

    // Palette Switchers
    document.querySelectorAll('.palette-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.palette-btn').forEach(b => b.classList.remove('active'));
            const targetBtn = e.currentTarget;
            targetBtn.classList.add('active');
            selectedPalette = targetBtn.dataset.palette;
            if (loadedImage) renderGenerativeArt();
        });
    });

    // Slider Listeners
    sliderWarmth.addEventListener('input', (e) => {
        valWarmth.textContent = `${e.target.value}%`;
        if (loadedImage) renderGenerativeArt();
    });
    
    sliderContrast.addEventListener('input', (e) => {
        valContrast.textContent = `${e.target.value}%`;
        if (loadedImage) renderGenerativeArt();
    });
    
    sliderDensity.addEventListener('input', (e) => {
        valDensity.textContent = e.target.value;
        if (loadedImage) renderGenerativeArt();
    });
    
    sliderThickness.addEventListener('input', (e) => {
        valThickness.textContent = `${e.target.value}px`;
        if (loadedImage) renderGenerativeArt();
    });

    chkMirrorFrame.addEventListener('change', () => {
        if (loadedImage) renderGenerativeArt();
    });

    // File Upload / Dropzone
    imageDropzone.addEventListener('click', () => fileInput.click());
    
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) handleImageFile(file);
    });

    imageDropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        imageDropzone.style.borderColor = 'var(--accent-gold)';
    });

    imageDropzone.addEventListener('dragleave', () => {
        imageDropzone.style.borderColor = 'var(--border-color)';
    });

    imageDropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        imageDropzone.style.borderColor = 'var(--border-color)';
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleImageFile(e.dataTransfer.files[0]);
        }
    });

    // Sample Image Buttons
    document.querySelectorAll('.sample-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const sampleType = btn.dataset.sample;
            createSampleCanvas(sampleType);
        });
    });

    btnGenerate.addEventListener('click', () => {
        if (loadedImage) renderGenerativeArt();
    });

    btnDownload.addEventListener('click', () => {
        if (!outputCanvas) return;
        const link = document.createElement('a');
        link.download = 'firuzi_generative_thread_artwork.png';
        link.href = outputCanvas.toDataURL('image/png');
        link.click();
    });

    // Modal Export Code
    btnExportPipeline.addEventListener('click', () => {
        codeExport.textContent = generatePythonPipelineScript();
        modalExport.classList.remove('hidden');
    });

    btnCloseModal.addEventListener('click', () => {
        modalExport.classList.add('hidden');
    });

    btnCopyCode.addEventListener('click', () => {
        navigator.clipboard.writeText(codeExport.textContent);
        btnCopyCode.textContent = 'Copied!';
        setTimeout(() => btnCopyCode.textContent = 'Copy Python Script', 2000);
    });

    function handleImageFile(file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                loadedImage = img;
                imgOriginal.src = event.target.result;
                imgOriginal.classList.remove('hidden');
                placeholderOriginal.classList.add('hidden');
                placeholderOutput.classList.add('hidden');
                btnDownload.disabled = false;
                renderGenerativeArt();
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }

    function createSampleCanvas(type) {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = 800;
        tempCanvas.height = 1000;
        const ctx = tempCanvas.getContext('2d');

        // Draw background gradient (warm desert lighting)
        const grad = ctx.createLinearGradient(0, 0, 800, 1000);
        grad.addColorStop(0, '#3a2518');
        grad.addColorStop(0.5, '#7a4e32');
        grad.addColorStop(1, '#1b120c');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 800, 1000);

        if (type === 'sample1') {
            // Mirror Portrait Pose
            ctx.fillStyle = '#b89470';
            ctx.beginPath();
            ctx.ellipse(400, 450, 180, 240, 0, 0, Math.PI * 2);
            ctx.fill();

            // Silhouette
            ctx.fillStyle = '#1c1510';
            ctx.beginPath();
            ctx.arc(400, 420, 90, 0, Math.PI * 2);
            ctx.rect(300, 480, 200, 300);
            ctx.fill();
        } else {
            // Desert Landscape Pose
            ctx.fillStyle = '#c4956e';
            ctx.beginPath();
            ctx.moveTo(0, 700);
            ctx.quadraticCurveTo(400, 500, 800, 750);
            ctx.lineTo(800, 1000);
            ctx.lineTo(0, 1000);
            ctx.fill();
        }

        const img = new Image();
        img.onload = () => {
            loadedImage = img;
            imgOriginal.src = tempCanvas.toDataURL();
            imgOriginal.classList.remove('hidden');
            placeholderOriginal.classList.add('hidden');
            placeholderOutput.classList.add('hidden');
            btnDownload.disabled = false;
            renderGenerativeArt();
        };
        img.src = tempCanvas.toDataURL();
    }

    // MAIN RENDER ENGINE: Photography Stylization + Generative Embroidery Stitching
    function renderGenerativeArt() {
        if (!loadedImage) return;

        const width = loadedImage.naturalWidth || loadedImage.width || 800;
        const height = loadedImage.naturalHeight || loadedImage.height || 1000;

        outputCanvas.width = width;
        outputCanvas.height = height;
        const ctx = outputCanvas.getContext('2d');

        // Step 1: Render Base Image
        ctx.drawImage(loadedImage, 0, 0, width, height);

        // Step 2: Photography Style Filter (Warm Earth Tones & Cinematic Contrast)
        const warmth = parseInt(sliderWarmth.value) / 100;
        const contrast = parseInt(sliderContrast.value) / 100;

        const imgData = ctx.getImageData(0, 0, width, height);
        const data = imgData.data;

        for (let i = 0; i < data.length; i += 4) {
            let r = data[i];
            let g = data[i + 1];
            let b = data[i + 2];

            // Warm tone adjustment (increase red/amber, lower blue)
            r = r * (1 + warmth * 0.25);
            g = g * (1 + warmth * 0.1);
            b = b * (1 - warmth * 0.2);

            // Contrast enhancement
            const factor = (259 * (contrast * 255 + 255)) / (255 * (259 - contrast * 255));
            r = factor * (r - 128) + 128;
            g = factor * (g - 128) + 128;
            b = factor * (b - 128) + 128;

            data[i] = Math.min(255, Math.max(0, r));
            data[i + 1] = Math.min(255, Math.max(0, g));
            data[i + 2] = Math.min(255, Math.max(0, b));
        }
        ctx.putImageData(imgData, 0, 0);

        // Step 3: Brass Mirror Frame Synthesis (if enabled)
        if (chkMirrorFrame.checked) {
            drawMirrorFrame(ctx, width, height);
        }

        // Step 4: Generative Embroidery Thread Overlay Engine
        drawGenerativeThreads(ctx, imgData, width, height);
    }

    function drawMirrorFrame(ctx, w, h) {
        ctx.save();
        const border = Math.min(w, h) * 0.06;
        
        // Outer Brass Frame
        const grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, '#d4af37');
        grad.addColorStop(0.3, '#8c6b23');
        grad.addColorStop(0.7, '#f3e5ab');
        grad.addColorStop(1, '#5c4515');

        ctx.strokeStyle = grad;
        ctx.lineWidth = border;
        ctx.strokeRect(border / 2, border / 2, w - border, h - border);

        // Inner Shadow
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.lineWidth = border * 0.25;
        ctx.strokeRect(border, border, w - border * 2, h - border * 2);
        ctx.restore();
    }

    function drawGenerativeThreads(ctx, imgData, w, h) {
        ctx.save();
        const density = parseInt(sliderDensity.value);
        const thickness = parseFloat(sliderThickness.value);
        const colors = palettes[selectedPalette] || palettes.baluchi;

        // Perform simple edge detection to anchor thread stitches onto subject contours
        const data = imgData.data;
        const edgePoints = [];
        const step = Math.max(4, Math.floor(Math.min(w, h) / 150));

        for (let y = step; y < h - step; y += step) {
            for (let x = step; x < w - step; x += step) {
                const idx = (y * w + x) * 4;
                const rightIdx = (y * w + (x + step)) * 4;
                const downIdx = ((y + step) * w + x) * 4;

                const diffX = Math.abs(data[idx] - data[rightIdx]);
                const diffY = Math.abs(data[idx] - data[downIdx]);

                if (diffX + diffY > 50) {
                    edgePoints.push({ x, y });
                }
            }
        }

        // Render Baluchi-style embroidery stitches along detected contours & flowing across landscape
        ctx.lineWidth = thickness;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        const stitchCount = Math.min(edgePoints.length, density * 12);
        const selectedPoints = edgePoints.sort(() => 0.5 - Math.random()).slice(0, stitchCount);

        selectedPoints.forEach((pt, i) => {
            const color = colors[i % colors.length];
            ctx.strokeStyle = color;
            ctx.shadowColor = 'rgba(0,0,0,0.5)';
            ctx.shadowBlur = 3;

            // Draw cross-stitch or silk thread curve
            if (i % 2 === 0) {
                // Cross Stitch Motif (X pattern)
                const size = thickness * 3;
                ctx.beginPath();
                ctx.moveTo(pt.x - size, pt.y - size);
                ctx.lineTo(pt.x + size, pt.y + size);
                ctx.moveTo(pt.x + size, pt.y - size);
                ctx.lineTo(pt.x - size, pt.y + size);
                ctx.stroke();
            } else {
                // Flowing Silk Thread Path connecting contours
                const nextPt = selectedPoints[(i + 1) % selectedPoints.length];
                ctx.beginPath();
                ctx.moveTo(pt.x, pt.y);
                const cpX = (pt.x + nextPt.x) / 2 + (Math.random() - 0.5) * 40;
                const cpY = (pt.y + nextPt.y) / 2 + (Math.random() - 0.5) * 40;
                ctx.quadraticCurveTo(cpX, cpY, nextPt.x, nextPt.y);
                ctx.stroke();
            }
        });

        ctx.restore();
    }

    function generatePythonPipelineScript() {
        return `# PyTorch & HuggingFace Diffusers Fine-Tuning Pipeline
# Generative Thread Model - Maryam Firuzi Style LoRA Training Script

import os
import torch
from diffusers import StableDiffusionXLPipeline, AutoencoderKL, UNet2DConditionModel
from peft import LoraConfig, get_peft_model

# 1. Dataset & Prompt Configuration
DATASET_DIR = "./dataset/maryam_firuzi_women_in_mirrors"
OUTPUT_DIR = "./models/firuzi_thread_lora"

PROMPT = (
    "firuzi_style, fine art staged photography, Iranian desert landscape, "
    "woman standing in brass mirror frame, hand-embroidered crimson and gold silk "
    "thread stitching across the landscape, dramatic warm side-lighting"
)

def build_lora_training_pipeline():
    print(f"Loading Base SDXL / FLUX.1 Model...")
    pipeline = StableDiffusionXLPipeline.from_pretrained(
        "stabilityai/stable-diffusion-xl-base-1.0",
        torch_dtype=torch.float16,
        use_safetensors=True
    ).to("cuda")

    # Configure LoRA Rank and Target Modules
    peft_config = LoraConfig(
        r=16,
        lora_alpha=32,
        target_modules=["to_k", "to_q", "to_v", "to_out.0"],
        lora_dropout=0.05,
        bias="none",
    )

    print("Configuring LoRA Weights for Maryam Firuzi Embroidery & Photography Style...")
    pipeline.unet = get_peft_model(pipeline.unet, peft_config)
    return pipeline

if __name__ == "__main__":
    model = build_lora_training_pipeline()
    print("Ready for GPU Fine-Tuning. Dataset path:", DATASET_DIR)
`;
    }
});
