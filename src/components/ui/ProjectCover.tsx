import type { Project } from "@/content/profile";

const PALETTES: Record<Project["motif"], [string, string, string]> = {
  // deep grounds with a single glowing accent each
  rag: ["#0d1b2e", "#151335", "#5ab4ff"],
  voice: ["#22101f", "#1a1230", "#ff6fb5"],
  agents: ["#18122e", "#0f1a2c", "#a78bfa"],
  stream: ["#0b2126", "#101a2e", "#3ee6d8"],
  services: ["#24170b", "#1a1424", "#f2b230"],
};

/** Abstract, code-drawn cover art for projects without screenshots. */
export function ProjectCover({ motif, title }: { motif: Project["motif"]; title: string }) {
  const [a, b, accent] = PALETTES[motif];
  const id = `g-${motif}`;
  return (
    <svg viewBox="0 0 400 250" role="img" aria-label={`Abstract illustration for ${title}`} className="size-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={a} />
          <stop offset="1" stopColor={b} />
        </linearGradient>
        <radialGradient id={`${id}-glow`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fff" stopOpacity="0.95" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="250" fill={`url(#${id}-bg)`} />
      <circle cx="300" cy="60" r="140" fill={`url(#${id}-glow)`} opacity="0.12" />
      <g fill="none" stroke="rgba(255,255,255,0.7)" strokeLinecap="round" strokeLinejoin="round">
        {motif === "rag" && <Rag accent={accent} />}
        {motif === "voice" && <Voice accent={accent} />}
        {motif === "agents" && <Agents accent={accent} />}
        {motif === "stream" && <Stream accent={accent} />}
        {motif === "services" && <Services accent={accent} />}
      </g>
    </svg>
  );
}

function Rag({ accent }: { accent: string }) {
  return (
    <>
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${70 + i * 16} ${62 + i * 14})`}>
          <rect width="96" height="120" rx="12" fill="rgba(255,255,255,0.08)" strokeWidth="1.5" />
          {[24, 40, 56, 72].map((y) => (
            <path key={y} d={`M16 ${y}h${y === 72 ? 38 : 64}`} strokeWidth="3" stroke={i === 2 ? accent : "#fff"} strokeOpacity={i === 2 ? 0.55 : 0.9} />
          ))}
        </g>
      ))}
      <path d="M216 120 C 250 120, 250 110, 280 110" strokeWidth="2" strokeDasharray="4 6" stroke={accent} strokeOpacity="0.7" />
      <circle cx="292" cy="110" r="10" fill={accent} fillOpacity="0.85" stroke="none" />
      <rect x="250" y="140" width="96" height="44" rx="16" fill="rgba(255,255,255,0.12)" strokeWidth="1.5" />
      <path d="M266 156h54M266 168h34" stroke={accent} strokeOpacity="0.6" strokeWidth="3" />
    </>
  );
}

function Voice({ accent }: { accent: string }) {
  const bars = [10, 22, 38, 56, 30, 70, 92, 64, 40, 84, 58, 34, 50, 26, 14];
  return (
    <>
      {bars.map((h, i) => (
        <rect
          key={i}
          x={88 + i * 16}
          y={125 - h / 2}
          width="8"
          height={h}
          rx="4"
          fill={i > 4 && i < 11 ? accent : "#ffffff"}
          fillOpacity={i > 4 && i < 11 ? 0.9 : 0.25}
          stroke="none"
        />
      ))}
      <path d="M40 125h36M332 125h28" strokeWidth="2" strokeOpacity="0.8" />
    </>
  );
}

function Agents({ accent }: { accent: string }) {
  const nodes = [
    [110, 70],
    [300, 72],
    [92, 180],
    [310, 182],
    [200, 46],
    [200, 210],
  ];
  return (
    <>
      {nodes.map(([x, y], i) => (
        <path key={`l${i}`} d={`M200 128 L${x} ${y}`} strokeWidth="1.5" strokeOpacity="0.85" strokeDasharray={i % 2 ? "3 5" : undefined} />
      ))}
      <path d="M110 70 L200 46 L300 72 M92 180 L200 210 L310 182" strokeWidth="1" strokeOpacity="0.5" />
      {nodes.map(([x, y], i) => (
        <circle key={`n${i}`} cx={x} cy={y} r="13" fill="rgba(255,255,255,0.1)" strokeWidth="1.5" />
      ))}
      <circle cx="200" cy="128" r="30" fill={accent} fillOpacity="0.8" stroke="none" />
      <circle cx="200" cy="128" r="44" strokeWidth="1.5" strokeOpacity="0.8" />
    </>
  );
}

function Stream({ accent }: { accent: string }) {
  const ys = [70, 100, 130, 160, 190];
  return (
    <>
      {ys.map((y, i) => (
        <path key={y} d={`M-10 ${y} C 120 ${y - 30 + i * 4}, 260 ${y + 30 - i * 4}, 410 ${y}`} strokeWidth={i === 2 ? 3 : 1.6} stroke={i === 2 ? accent : "#fff"} strokeOpacity={i === 2 ? 0.7 : 0.85} />
      ))}
      {[60, 150, 240, 330].map((x, i) => (
        <circle key={x} cx={x} cy={ys[(i + 1) % ys.length] + (i % 2 ? 8 : -6)} r="6" fill="#ffffff" fillOpacity="0.6" stroke="none" />
      ))}
      <circle cx="200" cy="130" r="9" fill={accent} stroke="none" />
    </>
  );
}

function Services({ accent }: { accent: string }) {
  const hex = (cx: number, cy: number, r = 30) =>
    Array.from({ length: 6 }, (_, k) => {
      const ang = (Math.PI / 3) * k + Math.PI / 6;
      return `${(cx + r * Math.cos(ang)).toFixed(1)},${(cy + r * Math.sin(ang)).toFixed(1)}`;
    }).join(" ");
  const cells = [
    [150, 90],
    [202, 90],
    [254, 90],
    [124, 135],
    [176, 135],
    [228, 135],
    [280, 135],
    [150, 180],
    [202, 180],
    [254, 180],
  ];
  return (
    <>
      {cells.map(([x, y], i) => (
        <polygon
          key={i}
          points={hex(x, y)}
          fill={i === 5 || i === 1 ? accent : "rgba(255,255,255,0.07)"}
          fillOpacity={i === 5 || i === 1 ? 0.7 : 1}
          strokeWidth="1.5"
        />
      ))}
    </>
  );
}
