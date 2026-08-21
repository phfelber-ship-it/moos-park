import * as THREE from "three";

// Erzeugt die Kartentexturen (Vorder-/Rueckseite) per Canvas 2D - laeuft nur
// im Browser (Image/document), daher ausschliesslich aus Client-Components
// heraus aufrufen (siehe ClubCard3D.tsx).

export type TierKey = "bronze" | "silber" | "gold" | "premium";

export const TIER_ORDER: TierKey[] = ["bronze", "silber", "gold", "premium"];

const TIER_STYLES: Record<
  TierKey,
  { label: string; stops: [string, string, string, string]; dark?: boolean }
> = {
  silber: {
    label: "SILBER",
    stops: ["#9aa1a8", "#e8ebee", "#6b7278", "#cfd3d7"],
  },
  bronze: {
    label: "BRONZE",
    stops: ["#6b3e21", "#c98a52", "#7c4a2d", "#e3a86a"],
  },
  gold: {
    label: "GOLD",
    stops: ["#8a6a12", "#f5d580", "#96731a", "#ffe9a8"],
  },
  premium: {
    label: "PREMIUM",
    stops: ["#050505", "#2b2b2b", "#000000", "#1c1c1c"],
    dark: true,
  },
};

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// Manuelles Buchstaben-Spacing statt ctx.letterSpacing (nicht ueberall
// unterstuetzt).
function drawSpacedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  extraSpace: number
) {
  let cursor = x;
  for (const char of text) {
    ctx.fillText(char, cursor, y);
    cursor += ctx.measureText(char).width + extraSpace;
  }
}

function backgroundGradient(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  stops: [string, string, string, string]
) {
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, stops[0]);
  grad.addColorStop(0.35, stops[1]);
  grad.addColorStop(0.65, stops[2]);
  grad.addColorStop(1, stops[3]);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Feine gebuerstete Metall-Textur.
  ctx.save();
  ctx.globalAlpha = 0.06;
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 1;
  for (let x = -h; x < w; x += 4) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + h, h);
    ctx.stroke();
  }
  ctx.restore();
}

export function buildFrontTexture(
  tier: TierKey,
  logo: HTMLImageElement
): THREE.CanvasTexture {
  const W = 1024;
  const H = 640;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const { stops, label, dark } = TIER_STYLES[tier];
  backgroundGradient(ctx, W, H, stops);

  // Glanz-Diagonale.
  const shine = ctx.createLinearGradient(0, H, W, 0);
  shine.addColorStop(0.32, "rgba(255,255,255,0)");
  shine.addColorStop(0.48, dark ? "rgba(185,206,173,0.3)" : "rgba(255,255,255,0.4)");
  shine.addColorStop(0.62, "rgba(255,255,255,0)");
  ctx.fillStyle = shine;
  ctx.fillRect(0, 0, W, H);

  // EMV-Chip.
  const chipX = 64;
  const chipY = 64;
  const chipW = 118;
  const chipH = 86;
  const chipGrad = ctx.createLinearGradient(chipX, chipY, chipX + chipW, chipY + chipH);
  chipGrad.addColorStop(0, "#f6e3a1");
  chipGrad.addColorStop(0.3, "#d8b45c");
  chipGrad.addColorStop(0.55, "#b8860b");
  chipGrad.addColorStop(0.8, "#f6e3a1");
  chipGrad.addColorStop(1, "#caa04a");
  ctx.fillStyle = chipGrad;
  roundRect(ctx, chipX, chipY, chipW, chipH, 12);
  ctx.fill();
  ctx.strokeStyle = "rgba(0,0,0,0.35)";
  ctx.lineWidth = 2;
  for (let i = 1; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo(chipX + (chipW / 3) * i, chipY + 10);
    ctx.lineTo(chipX + (chipW / 3) * i, chipY + chipH - 10);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.moveTo(chipX + 10, chipY + chipH / 2);
  ctx.lineTo(chipX + chipW - 10, chipY + chipH / 2);
  ctx.stroke();

  // Kontaktlos-Symbol.
  ctx.strokeStyle = dark ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.55)";
  ctx.lineWidth = 7;
  ctx.lineCap = "round";
  const cx = chipX + chipW + 64;
  const cy = chipY + chipH / 2;
  [20, 34, 48].forEach((r) => {
    ctx.beginPath();
    ctx.arc(cx, cy, r, -0.55 * Math.PI, -0.05 * Math.PI);
    ctx.stroke();
  });

  // Logo oben rechts.
  const logoSize = 68;
  ctx.globalAlpha = 0.9;
  if (logo.complete && logo.naturalWidth > 0) {
    ctx.drawImage(logo, W - 60 - logoSize, 58, logoSize, logoSize);
  }
  ctx.globalAlpha = 1;

  // Gepraegte Kartennummer.
  ctx.fillStyle = dark ? "rgba(255,255,255,0.92)" : "rgba(0,0,0,0.82)";
  ctx.font = '600 48px "Courier New", monospace';
  drawSpacedText(ctx, "•••• •••• •••• 2627", 64, 340, 10);

  // Fusszeile.
  ctx.fillStyle = dark ? "rgba(255,255,255,0.65)" : "rgba(0,0,0,0.65)";
  ctx.font = "700 22px system-ui, sans-serif";
  drawSpacedText(ctx, "CLUB CARD", 64, 420, 5);

  ctx.fillStyle = dark ? "#ffffff" : "rgba(0,0,0,0.88)";
  ctx.font = "900 68px system-ui, sans-serif";
  ctx.fillText(label, 60, 486);

  ctx.textAlign = "right";
  ctx.fillStyle = dark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)";
  ctx.font = "700 20px system-ui, sans-serif";
  ctx.fillText("moos.park", W - 64, 460);
  ctx.fillText("26/27", W - 64, 486);
  ctx.textAlign = "left";

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  return texture;
}

export function buildBackTexture(
  tier: TierKey,
  logo: HTMLImageElement
): THREE.CanvasTexture {
  const W = 1024;
  const H = 640;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const { stops, dark } = TIER_STYLES[tier];
  backgroundGradient(ctx, W, H, stops);
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.fillRect(0, 0, W, H);

  // Magnetstreifen.
  ctx.fillStyle = "#111111";
  ctx.fillRect(0, 60, W, 90);

  // Zentrales, dezentes Logo-Wasserzeichen.
  const size = 160;
  ctx.globalAlpha = dark ? 0.12 : 0.16;
  if (logo.complete && logo.naturalWidth > 0) {
    ctx.drawImage(logo, W / 2 - size / 2, H / 2 - size / 2, size, size);
  }
  ctx.globalAlpha = 1;

  ctx.fillStyle = dark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)";
  ctx.font = "700 22px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("moos.park · Club Card 26/27", W / 2, H - 60);
  ctx.textAlign = "left";

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  return texture;
}
