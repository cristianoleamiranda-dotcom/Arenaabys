#!/usr/bin/env python3
"""
Abyss Tattoo Studio v3 — Optical 2.5D Plane Separation & Editorial Color Grading Pipeline
Principle: "El tatuaje permanece real. La fotografía gana profundidad. El espacio cobra vida."

Strictly adheres to photography_policy:
- Tattoo is 100% immutable (zero AI generation, zero line/ink modification, zero deformation).
- Only allowed photo editing: exposure, brightness, contrast, depth, grain, color grading,
  plane separation (alpha masks), parallax plates, environmental blur (on background only),
  and environmental lighting.
"""

import json
from pathlib import Path
import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "assets" / "hero_v3"
OUT_DIR.mkdir(parents=True, exist_ok=True)

# Official Abyss Tattoo Studio v3 Palette (RGB)
PALETTE = {
    "abyss_black": (5, 5, 5),         # #050505
    "charcoal": (22, 22, 22),         # #161616
    "bone": (232, 228, 221),          # #E8E4DD
    "dark_gold": (138, 100, 43),      # #8A642B
    "primary_gold": (196, 154, 80),   # #C49A50
    "studio_green": (89, 96, 71),     # #596047
}


def load_rgb(path: Path) -> np.ndarray:
    im = Image.open(path).convert("RGB")
    return np.array(im, dtype=np.float32) / 255.0


def blur_rgb(arr: np.ndarray, radius: float) -> np.ndarray:
    u8 = np.clip(arr * 255.0, 0, 255).astype(np.uint8)
    im = Image.fromarray(u8, mode="RGB").filter(ImageFilter.GaussianBlur(radius=radius))
    return np.array(im, dtype=np.float32) / 255.0


def blur_gray(arr: np.ndarray, radius: float) -> np.ndarray:
    u8 = np.clip(arr * 255.0, 0, 255).astype(np.uint8)
    im = Image.fromarray(u8, mode="L").filter(ImageFilter.GaussianBlur(radius=radius))
    return np.array(im, dtype=np.float32) / 255.0


def save_webp_rgb(arr: np.ndarray, path: Path, quality: int = 90) -> None:
    clipped = np.clip(arr * 255.0, 0, 255).astype(np.uint8)
    Image.fromarray(clipped, mode="RGB").save(path, format="WEBP", quality=quality, method=2)


def save_webp_rgba(rgb: np.ndarray, alpha: np.ndarray, path: Path, quality: int = 92) -> None:
    r = np.clip(rgb * 255.0, 0, 255).astype(np.uint8)
    a = np.clip(alpha * 255.0, 0, 255).astype(np.uint8)
    rgba = np.dstack([r, a])
    Image.fromarray(rgba, mode="RGBA").save(path, format="WEBP", quality=quality, method=2)


def make_elliptical_mask(
    h: int,
    w: int,
    cx: float,
    cy: float,
    rx: float,
    ry: float,
    angle_deg: float = 0.0,
    feather_sigma: float = 24.0,
) -> np.ndarray:
    """Create a smooth, feathered elliptical mask in normalized coordinates [0..1]."""
    y, x = np.ogrid[:h, :w]
    nx = (x / w) - cx
    ny = (y / h) - cy
    theta = np.deg2rad(angle_deg)
    cos_t, sin_t = np.cos(theta), np.sin(theta)
    xr = (nx * cos_t + ny * sin_t) / rx
    yr = (-nx * sin_t + ny * cos_t) / ry
    dist = np.sqrt(xr * xr + yr * yr)
    mask = np.clip(1.25 - dist, 0.0, 1.0)
    mask = mask * mask * (3.0 - 2.0 * mask)
    if feather_sigma > 0:
        mask = blur_gray(mask, feather_sigma)
    return np.clip(mask, 0.0, 1.0)


def grade_background_abyss(rgb: np.ndarray, blur_sigma: float = 26.0) -> np.ndarray:
    """
    Grade Layer 1 (background): Deep #050505 abyss_black & #161616 charcoal
    with wide optical lens blur for atmospheric depth separation.
    """
    h, w, _ = rgb.shape
    blurred = blur_rgb(rgb, blur_sigma)
    lum = (0.2126 * blurred[:, :, 0] + 0.7152 * blurred[:, :, 1] + 0.0722 * blurred[:, :, 2])[:, :, None]
    abyss = np.array(PALETTE["abyss_black"], dtype=np.float32) / 255.0
    charcoal = np.array(PALETTE["charcoal"], dtype=np.float32) / 255.0
    green = np.array(PALETTE["studio_green"], dtype=np.float32) / 255.0

    graded = abyss + lum * 0.44 * (charcoal * 0.72 + green * 0.28)
    vig = make_elliptical_mask(h, w, 0.5, 0.5, 0.62, 0.62, 0.0, 36.0)[:, :, None]
    return abyss * (1.0 - vig) + graded * vig


def grade_studio_environment(rgb: np.ndarray, subject_mask: np.ndarray, blur_sigma: float = 11.0) -> np.ndarray:
    """
    Grade Layer 2 (studio_environment): Mid-back studio plane with optical bokeh,
    preserving real studio geometry while toning shadows toward #161616 & #596047
    and subtle aged gold (#8A642B) rim bounce.
    """
    env_blur = blur_rgb(rgb, blur_sigma)
    deep_blur = blur_rgb(rgb, 28.0)
    m = subject_mask[:, :, None]
    base = env_blur * (1.0 - m * 0.75) + deep_blur * (m * 0.75)

    lum = (0.2126 * base[:, :, 0] + 0.7152 * base[:, :, 1] + 0.0722 * base[:, :, 2])[:, :, None]
    green = np.array(PALETTE["studio_green"], dtype=np.float32) / 255.0
    dark_gold = np.array(PALETTE["dark_gold"], dtype=np.float32) / 255.0
    abyss = np.array(PALETTE["abyss_black"], dtype=np.float32) / 255.0

    desat = base * 0.55 + lum * 0.45
    shadow_tint = green * 0.20 + abyss * 0.80
    highlight_tint = dark_gold * 0.22 + desat * 0.78
    graded = shadow_tint * (1.0 - lum) + highlight_tint * lum
    return np.clip(graded * 0.74, 0.0, 1.0)


def process_plate(
    plate_id: str,
    src_rel: str,
    title: str,
    subtitle: str,
    subject_params: dict,
    fg_regions: list,
    tattoo_focus: tuple,
) -> dict:
    src_path = ROOT / src_rel
    rgb = load_rgb(src_path)
    h, w, _ = rgb.shape

    subj_mask = make_elliptical_mask(
        h,
        w,
        cx=subject_params["cx"],
        cy=subject_params["cy"],
        rx=subject_params["rx"],
        ry=subject_params["ry"],
        angle_deg=subject_params.get("angle", 0.0),
        feather_sigma=subject_params.get("feather", 24.0),
    )

    lum = 0.2126 * rgb[:, :, 0] + 0.7152 * rgb[:, :, 1] + 0.0722 * rgb[:, :, 2]
    edge_detail = blur_gray(lum, 4.0)
    anatomical_alpha = np.clip(subj_mask * (0.84 + 0.30 * edge_detail), 0.0, 1.0)

    tx, ty, trx, try_ = tattoo_focus
    tattoo_core = make_elliptical_mask(h, w, tx, ty, trx, try_, 0.0, 12.0)
    subject_alpha = np.clip(np.maximum(anatomical_alpha, tattoo_core), 0.0, 1.0)

    fg_alpha = np.zeros((h, w), dtype=np.float32)
    for reg in fg_regions:
        m = make_elliptical_mask(
            h,
            w,
            cx=reg["cx"],
            cy=reg["cy"],
            rx=reg["rx"],
            ry=reg["ry"],
            angle_deg=reg.get("angle", 0.0),
            feather_sigma=reg.get("feather", 18.0),
        )
        fg_alpha = np.maximum(fg_alpha, m * reg.get("strength", 0.92))

    fg_alpha = np.clip(fg_alpha * (1.0 - tattoo_core * 0.88), 0.0, 1.0)

    bg_rgb = grade_background_abyss(rgb, blur_sigma=26.0)
    studio_rgb = grade_studio_environment(rgb, subject_alpha, blur_sigma=11.0)

    # CRITICAL RULE: The RGB pixels of subject_rgb are the EXACT unedited source photograph!
    subject_rgb = rgb.copy()
    fg_rgb = rgb.copy()

    depth_map = np.clip(0.15 + 0.55 * subject_alpha + 0.30 * fg_alpha, 0.0, 1.0)
    depth_rgb = np.dstack([depth_map, depth_map, depth_map])

    bg_file = f"{plate_id}_bg.webp"
    studio_file = f"{plate_id}_studio.webp"
    subj_file = f"{plate_id}_subject.webp"
    fg_file = f"{plate_id}_foreground.webp"
    depth_file = f"{plate_id}_depth.webp"

    save_webp_rgb(bg_rgb, OUT_DIR / bg_file, quality=88)
    save_webp_rgb(studio_rgb, OUT_DIR / studio_file, quality=90)
    save_webp_rgba(subject_rgb, subject_alpha, OUT_DIR / subj_file, quality=94)
    save_webp_rgba(fg_rgb, fg_alpha, OUT_DIR / fg_file, quality=90)
    save_webp_rgb(depth_rgb, OUT_DIR / depth_file, quality=85)

    return {
        "id": plate_id,
        "title": title,
        "subtitle": subtitle,
        "source": src_rel,
        "width": w,
        "height": h,
        "layers": {
            "background": f"assets/hero_v3/{bg_file}",
            "studio_environment": f"assets/hero_v3/{studio_file}",
            "photographic_subject": f"assets/hero_v3/{subj_file}",
            "foreground": f"assets/hero_v3/{fg_file}",
            "depth": f"assets/hero_v3/{depth_file}",
        },
    }


def main() -> None:
    plates_manifest = []

    plates_manifest.append(
        process_plate(
            plate_id="p01_ritual",
            src_rel="assets/trabajos/proceso_hombro.jpg",
            title="01 / EL RITUAL · SESIÓN EN CURSO",
            subtitle="Fotografía documental real · Hombro blackwork en ejecución · Aguja y guante en primer plano",
            subject_params={"cx": 0.52, "cy": 0.52, "rx": 0.38, "ry": 0.46, "angle": -4.0, "feather": 24.0},
            fg_regions=[
                {"cx": 0.16, "cy": 0.40, "rx": 0.19, "ry": 0.26, "angle": 18.0, "feather": 18.0, "strength": 0.95},
                {"cx": 0.78, "cy": 0.72, "rx": 0.22, "ry": 0.26, "angle": -15.0, "feather": 18.0, "strength": 0.96},
            ],
            tattoo_focus=(0.45, 0.50, 0.20, 0.30),
        )
    )

    plates_manifest.append(
        process_plate(
            plate_id="p02_blackwork",
            src_rel="assets/trabajos/craneo.jpg",
            title="02 / BLACKWORK · OBRA EN PIEL",
            subtitle="Fotografía documental real · Pieza completa en hombro y brazo · Estudio San Bernardo",
            subject_params={"cx": 0.48, "cy": 0.52, "rx": 0.35, "ry": 0.47, "angle": -3.0, "feather": 24.0},
            fg_regions=[
                {"cx": 0.62, "cy": 0.88, "rx": 0.24, "ry": 0.16, "angle": -8.0, "feather": 22.0, "strength": 0.88},
            ],
            tattoo_focus=(0.47, 0.48, 0.22, 0.33),
        )
    )

    plates_manifest.append(
        process_plate(
            plate_id="p03_maestro",
            src_rel="assets/estudio/maestro.jpg",
            title="03 / EL MAESTRO · PRECISIÓN EN VIVO",
            subtitle="Fotografía documental real · José Joaquín Pérez 528, San Bernardo · Autorizado Seremi",
            subject_params={"cx": 0.50, "cy": 0.56, "rx": 0.40, "ry": 0.42, "angle": 0.0, "feather": 26.0},
            fg_regions=[
                {"cx": 0.52, "cy": 0.76, "rx": 0.34, "ry": 0.22, "angle": 0.0, "feather": 20.0, "strength": 0.92},
            ],
            tattoo_focus=(0.48, 0.55, 0.28, 0.28),
        )
    )

    plates_manifest.append(
        process_plate(
            plate_id="p04_realismo",
            src_rel="assets/trabajos/trabajo_hombro_real.jpg",
            title="04 / REALISMO · BLACK & GREY",
            subtitle="Fotografía documental real · Textura de piel y sombreado intactos sin alteración IA",
            subject_params={"cx": 0.46, "cy": 0.50, "rx": 0.38, "ry": 0.46, "angle": -5.0, "feather": 24.0},
            fg_regions=[
                {"cx": 0.14, "cy": 0.42, "rx": 0.16, "ry": 0.32, "angle": 0.0, "feather": 22.0, "strength": 0.85},
            ],
            tattoo_focus=(0.46, 0.48, 0.26, 0.36),
        )
    )

    manifest_path = OUT_DIR / "manifest.json"
    manifest_path.write_text(
        json.dumps(
            {
                "project": "Abyss Tattoo Studio v3",
                "phase": "Hero 3D / dirección visual / motion",
                "principle": "El tatuaje permanece real. La fotografía gana profundidad. El espacio cobra vida.",
                "tattoo_immutable": True,
                "plates": plates_manifest,
            },
            indent=2,
            ensure_ascii=False,
        )
    )
    print(f"Generated {len(plates_manifest)} multi-plane 2.5D documentary plates in {OUT_DIR}")


if __name__ == "__main__":
    main()
