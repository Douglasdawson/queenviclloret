import { Picture } from "./Picture";
import type { ImageName } from "../lib/image-manifest";

/**
 * Decorative sports montage for the home "Tonight" section. Diagonal
 * broadcast-channel cuts (~10°, via clip-path) over the green surface, with a
 * thin gold seam on each cut. Art-directed per device so the strips never
 * collapse into unreadable threads:
 *   · phone   → 1 full-bleed shot
 *   · tablet  → 2 diagonal strips
 *   · desktop → 4 diagonal strips
 * Detail action shots (car/bike/ball/player large and centred) stay instantly
 * recognisable even when sliced.
 *
 * Each photo covers ONLY its own band (`left`/`width`, in %), not the whole
 * section — otherwise on wide screens object-cover scales the portrait source
 * to the full width and you only ever see a cropped fragment. The band is sized
 * to its strip's horizontal extent so the subject fills the strip on any aspect.
 */

type Panel = { name: ImageName; clip: string; left: number; width: number };

// 4 equal strips, top edge shifted +7% vs bottom → ~10° incline. Each band
// spans its strip's horizontal extent (the slanted parallelogram's bounding x).
const FOUR: Panel[] = [
  { name: "football-detail", clip: "polygon(0% 0%, 32% 0%, 25% 100%, 0% 100%)", left: 0, width: 33 },
  { name: "rugby-detail", clip: "polygon(32% 0%, 57% 0%, 50% 100%, 25% 100%)", left: 24, width: 34 },
  { name: "f1-detail", clip: "polygon(57% 0%, 82% 0%, 75% 100%, 50% 100%)", left: 49, width: 34 },
  { name: "motogp-detail", clip: "polygon(82% 0%, 100% 0%, 100% 100%, 75% 100%)", left: 74, width: 26 },
];
const FOUR_SEAMS = [
  "polygon(31.6% 0%, 32.4% 0%, 25.4% 100%, 24.6% 100%)",
  "polygon(56.6% 0%, 57.4% 0%, 50.4% 100%, 49.6% 100%)",
  "polygon(81.6% 0%, 82.4% 0%, 75.4% 100%, 74.6% 100%)",
];

// 2 equal strips for tablet.
const TWO: Panel[] = [
  { name: "football-detail", clip: "polygon(0% 0%, 57% 0%, 50% 100%, 0% 100%)", left: 0, width: 58 },
  { name: "f1-detail", clip: "polygon(57% 0%, 100% 0%, 100% 100%, 50% 100%)", left: 42, width: 58 },
];
const TWO_SEAMS = ["polygon(56.6% 0%, 57.4% 0%, 50.4% 100%, 49.6% 100%)"];

const imgClass = "h-full w-full object-cover opacity-90 saturate-[1.3]";

function PanelSet({
  panels,
  seams,
  sizes,
}: {
  panels: Panel[];
  seams: string[];
  sizes: string;
}) {
  return (
    <>
      {panels.map(({ name, clip, left, width }) => (
        <div key={name} className="absolute inset-0" style={{ clipPath: clip }}>
          {/* image confined to its own band → portrait source fills the strip */}
          <div className="absolute inset-y-0" style={{ left: `${left}%`, width: `${width}%` }}>
            <Picture
              name={name}
              alt=""
              sizes={sizes}
              className="absolute inset-0 h-full w-full"
              imgClassName={imgClass}
            />
          </div>
        </div>
      ))}
      {seams.map((clip) => (
        <div key={clip} className="absolute inset-0 bg-gold-400/40" style={{ clipPath: clip }} />
      ))}
    </>
  );
}

export function SportsMontage() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {/* phone: single full-bleed shot */}
      <div className="absolute inset-0 sm:hidden">
        <Picture
          name="football-detail"
          alt=""
          sizes="100vw"
          className="absolute inset-0 h-full w-full"
          imgClassName={imgClass}
        />
      </div>
      {/* tablet: 2 diagonal strips */}
      <div className="absolute inset-0 hidden sm:block lg:hidden">
        <PanelSet panels={TWO} seams={TWO_SEAMS} sizes="50vw" />
      </div>
      {/* desktop: 4 diagonal strips */}
      <div className="absolute inset-0 hidden lg:block">
        <PanelSet panels={FOUR} seams={FOUR_SEAMS} sizes="25vw" />
      </div>
    </div>
  );
}
