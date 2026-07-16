"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX,
  ChevronUp, ChevronDown, X, ListMusic, Heart,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const playlist = [
  { id: 1, title: "Sunset Serenade", artist: "Ray Entertainment and Promotion", album: "Golden Nights", duration: "4:23", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { id: 2, title: "Addis Nights", artist: "Ray Entertainment and Promotion", album: "Addis After Dark", duration: "5:12", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { id: 3, title: "Golden Hour", artist: "Ray Entertainment and Promotion", album: "Golden Nights", duration: "3:45", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
  { id: 4, title: "Ethiopian Rhapsody", artist: "Ray Entertainment and Promotion", album: "Unplugged Vol. 1", duration: "6:01", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
  { id: 5, title: "Moonlight Groove", artist: "Ray Entertainment and Promotion", album: "Acoustic Sessions", duration: "4:56", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3" },
  { id: 6, title: "Love Again", artist: "Ray Entertainment and Promotion", album: "Love Songs", duration: "3:32", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3" },
  { id: 7, title: "Midnight Jazz", artist: "Ray Entertainment and Promotion", album: "Golden Nights", duration: "5:45", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3" },
  { id: 8, title: "Morning Light", artist: "Ray Entertainment and Promotion", album: "Acoustic Sessions", duration: "4:10", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" },
];

export function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(75);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);
  const isSeekingRef = useRef(false);

  const track = playlist[currentTrack];

  // Create and manage audio element
  useEffect(() => {
    const audio = new Audio();
    audio.preload = "metadata";
    audioRef.current = audio;

    const onTimeUpdate = () => {
      if (!isSeekingRef.current && audio.duration) {
        setCurrentTime(audio.currentTime);
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const onLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };

    const onEnded = () => {
      nextTrack();
    };

    const onWaiting = () => setIsLoading(true);
    const onCanPlay = () => setIsLoading(false);

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("waiting", onWaiting);
    audio.addEventListener("canplay", onCanPlay);

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("waiting", onWaiting);
      audio.removeEventListener("canplay", onCanPlay);
      audio.src = "";
    };
  }, []);

  // Load track when currentTrack changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const wasPlaying = isPlaying;
    audio.src = track.src;
    audio.load();
    setProgress(0);
    setCurrentTime(0);
    setIsLoading(true);

    if (wasPlaying) {
      audio.play().catch(() => {});
    }
  }, [currentTrack]);

  // Sync volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  // Play / Pause
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  const nextTrack = useCallback(() => {
    setCurrentTrack((prev) => (prev + 1) % playlist.length);
  }, []);

  const prevTrack = () => {
    const audio = audioRef.current;
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
    } else {
      setCurrentTrack((prev) => (prev - 1 + playlist.length) % playlist.length);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const val = Number(e.target.value);
    setProgress(val);
    audio.currentTime = (val / 100) * duration;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
    setIsMuted(val === 0);
  };

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const formatTime = (secs: number) => {
    if (!secs || !isFinite(secs)) return "0:00";
    const mins = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${mins}:${s.toString().padStart(2, "0")}`;
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Playlist Panel */}
      {showPlaylist && (
        <div className="fixed bottom-24 left-0 right-0 z-[59] md:left-auto md:right-4 md:w-96">
          <div className="mx-4 md:mx-0 glass rounded-2xl border border-border overflow-hidden max-h-80">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <ListMusic className="w-4 h-4 text-gold" />
                <span className="text-sm font-semibold">Playlist</span>
                <Badge variant="gold" size="sm">{playlist.length} tracks</Badge>
              </div>
              <button onClick={() => setShowPlaylist(false)} className="text-warm-white/40 hover:text-warm-white">
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
            <div className="overflow-y-auto max-h-64">
              {playlist.map((t, i) => (
                <button
                  key={t.id}
                  onClick={() => { setCurrentTrack(i); setIsPlaying(true); }}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors",
                    i === currentTrack ? "bg-gold/10" : "hover:bg-white/5"
                  )}
                >
                  <span className={cn(
                    "w-6 text-center text-xs",
                    i === currentTrack ? "text-gold font-bold" : "text-warm-white/30"
                  )}>
                    {i === currentTrack && isPlaying ? (
                      <span className="flex items-center justify-center gap-0.5">
                        <span className="w-0.5 h-3 bg-gold animate-pulse" />
                        <span className="w-0.5 h-4 bg-gold animate-pulse [animation-delay:0.15s]" />
                        <span className="w-0.5 h-2 bg-gold animate-pulse [animation-delay:0.3s]" />
                      </span>
                    ) : i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "text-sm truncate",
                      i === currentTrack ? "text-gold" : "text-warm-white"
                    )}>
                      {t.title}
                    </p>
                    <p className="text-xs text-warm-white/40 truncate">{t.album}</p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(t.id); }}
                    className="shrink-0"
                  >
                    <Heart className={cn(
                      "w-3.5 h-3.5",
                      favorites.includes(t.id) ? "text-gold fill-gold" : "text-warm-white/20"
                    )} />
                  </button>
                  <span className="text-xs text-warm-white/30 shrink-0">{t.duration}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Player Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-[60] glass border-t border-border">
        {/* Progress Bar */}
        <div ref={progressRef} className="relative h-1 bg-white/5 group cursor-pointer">
          <div
            className="absolute inset-y-0 left-0 bg-gold transition-none"
            style={{ width: `${progress}%` }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-gold opacity-0 group-hover:opacity-100 transition-opacity shadow-lg shadow-gold/30 pointer-events-none"
            style={{ left: `calc(${progress}% - 6px)` }}
          />
          <input
            type="range"
            min="0"
            max="100"
            step="0.1"
            value={progress}
            onChange={handleSeek}
            onPointerDown={() => (isSeekingRef.current = true)}
            onPointerUp={() => (isSeekingRef.current = false)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>

        <div className="px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            {/* Track Info */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-12 h-12 rounded-lg bg-surface-lighter border border-border flex items-center justify-center shrink-0 overflow-hidden">
                <span className={cn(
                  "text-lg transition-transform",
                  isPlaying && "animate-spin [animation-duration:3s]"
                )}>♫</span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{track.title}</p>
                <p className="text-xs text-warm-white/40 truncate">{track.artist} — {track.album}</p>
              </div>
              <button
                onClick={() => toggleFavorite(track.id)}
                className="shrink-0 hidden sm:block"
              >
                <Heart className={cn(
                  "w-4 h-4 transition-colors",
                  favorites.includes(track.id) ? "text-gold fill-gold" : "text-warm-white/30 hover:text-warm-white"
                )} />
              </button>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={prevTrack}
                className="p-2 text-warm-white/50 hover:text-warm-white transition-colors hidden sm:block"
              >
                <SkipBack className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                disabled={isLoading}
                className="w-10 h-10 rounded-full bg-gold flex items-center justify-center text-charcoal hover:bg-gold-light transition-colors active:scale-95 disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="w-4 h-4 border-2 border-charcoal border-t-transparent rounded-full animate-spin" />
                ) : isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4 ml-0.5" />
                )}
              </button>
              <button
                onClick={nextTrack}
                className="p-2 text-warm-white/50 hover:text-warm-white transition-colors hidden sm:block"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3 flex-1 justify-end">
              <span className="text-xs text-warm-white/30 hidden sm:block tabular-nums">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>

              {/* Volume */}
              <div className="hidden md:flex items-center gap-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-warm-white/50 hover:text-warm-white transition-colors"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
                <div className="w-20 relative h-1 bg-white/10 rounded-full cursor-pointer">
                  <div
                    className="absolute inset-y-0 left-0 bg-gold rounded-full"
                    style={{ width: `${isMuted ? 0 : volume}%` }}
                  />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              <button
                onClick={() => setShowPlaylist(!showPlaylist)}
                className={cn(
                  "p-2 transition-colors rounded-lg",
                  showPlaylist ? "text-gold bg-gold/10" : "text-warm-white/50 hover:text-warm-white"
                )}
              >
                <ListMusic className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2 text-warm-white/50 hover:text-warm-white transition-colors hidden md:block"
              >
                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </button>

              <button
                onClick={() => { setIsVisible(false); setIsPlaying(false); }}
                className="p-2 text-warm-white/30 hover:text-warm-white/60 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
