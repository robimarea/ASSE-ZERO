function formatTime(t: number) {
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function VideoSpinner() {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-30">
      <div className="w-12 h-12 border-2 border-[#a90f21]/20 border-t-[#a90f21] rounded-full animate-spin" />
    </div>
  );
}

interface Props {
  isPlaying: boolean;
  isMuted: boolean;
  progress: number;
  currentTime: number;
  duration: number;
  showControls: boolean;
  onTogglePlay: () => void;
  onToggleMute: (e?: React.MouseEvent) => void;
  onTimelineClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMinimize?: () => void;
  title?: string;
  subtitle?: string;
}

export function VideoPlayerControls({
  isPlaying, isMuted, progress, currentTime, duration, showControls,
  onTogglePlay, onToggleMute, onTimelineClick, onMinimize,
  title, subtitle,
}: Props) {
  if (!duration) return null;

  return (
    <div
      className={`absolute bottom-0 left-0 w-full px-5 py-5 md:px-10 md:py-8 bg-gradient-to-t from-black/95 via-black/75 to-transparent flex flex-col gap-3 transition-all duration-500 z-20 ${
        showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'
      }`}
    >
      {(title || subtitle) && (
        <div>
          {subtitle && (
            <span className="text-[10px] font-black uppercase tracking-[0.35em] block mb-0.5" style={{ color: '#a90f21' }}>
              {subtitle}
            </span>
          )}
          {title && (
            <h3
              className="text-white font-black tracking-tighter italic leading-none"
              style={{ fontFamily: "'Nohemi', sans-serif", fontSize: 'clamp(1.1rem, 2vw, 1.7rem)' }}
            >
              {title}
            </h3>
          )}
        </div>
      )}

      {/* Timeline */}
      <div onClick={onTimelineClick} className="group/tl w-full py-1.5 flex items-center cursor-pointer">
        <div className="relative h-1 w-full bg-white/20 rounded-full group-hover/tl:h-1.5 transition-all duration-300">
          <div className="absolute top-0 left-0 h-full rounded-full" style={{ backgroundColor: '#a90f21', width: `${progress}%` }} />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white border border-[#a90f21] shadow-[0_0_8px_rgba(0,0,0,0.5)] scale-0 group-hover/tl:scale-100 transition-transform duration-200"
            style={{ left: `calc(${progress}% - 6px)` }}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-5">
          <button onClick={onTogglePlay} aria-label={isPlaying ? 'Pausa' : 'Avvia'} className="text-white hover:text-[#a90f21] transition-colors">
            {isPlaying
              ? <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
              : <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
            }
          </button>
          <span className="text-white/70 text-xs font-semibold select-none">
            {formatTime(currentTime)} <span className="text-white/30 font-light">/</span> {formatTime(duration)}
          </span>
        </div>
        <div className="flex items-center gap-5">
          <button onClick={onToggleMute} aria-label={isMuted ? 'Riattiva audio' : 'Disattiva audio'} className="text-white hover:text-[#a90f21] transition-colors">
            {isMuted
              ? <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M3.63 3.63L2.36 4.9 7.47 10H4.5v4h3l4.17 4.17V14.3l3.65 3.65c-.71.55-1.51.98-2.38 1.25v2.06c1.4-.38 2.67-1.12 3.69-2.11l2.62 2.62 1.27-1.27L3.63 3.63zM10.17 6.83L12 5v4.3L10.17 7.47zM16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.24l2.48 2.48c.01-.23.02-.45.02-.69zM14 3.23v2.06c2.89.86 5 3.54 5 6.71 0 1.9-.53 3.67-1.44 5.17l1.46 1.46C20.25 16.5 21 14.34 21 12c0-4.28-2.99-7.86-7-8.77z" /></svg>
              : <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" /></svg>
            }
          </button>
          {onMinimize && (
            <button onClick={onMinimize} aria-label="Riduci video" className="text-white hover:text-[#a90f21] transition-colors">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
