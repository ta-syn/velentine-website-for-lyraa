import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { Howler, Howl } from "howler";
import { SoundType, SoundContextType } from "../types";
import { sfx, getGlobalBgMusic } from "../lib/soundManager";

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    const saved = localStorage.getItem("sound_muted");
    return saved ? JSON.parse(saved) : false;
  });

  // Singleton BG music
  const bgMusicRef = useRef<Howl | null>(getGlobalBgMusic());

  /* ---------------------------------------------------
     APPLY MUTE STATE
  --------------------------------------------------- */
  useEffect(() => {
    localStorage.setItem("sound_muted", JSON.stringify(isMuted));

    if (bgMusicRef.current) bgMusicRef.current.mute(isMuted);
    Object.values(sfx).forEach(sound => sound.mute(isMuted));
  }, [isMuted]);

  const toggleMute = useCallback(() => setIsMuted(prev => !prev), []);
  const setSoundMuted = useCallback((muted: boolean) => setIsMuted(muted), []);

  /* ---------------------------------------------------
     SAFE SFX PLAY
  --------------------------------------------------- */
  const playSfx = useCallback((type: SoundType) => {
    const soundMap = {
      [SoundType.UI_CLICK]: sfx.click,
      [SoundType.UI_HOVER]: sfx.hover,
      [SoundType.ENTRANCE]: sfx.entrance,
      [SoundType.HEARTBEAT]: sfx.heartbeat,
      [SoundType.CHIME]: sfx.chime,
      [SoundType.SUCCESS]: sfx.success,
      [SoundType.ERROR]: sfx.error,
    };

    const sound = soundMap[type];
    if (sound && !sound.playing()) {
      sound.stop();
      sound.play();
    }
  }, []);

  /* ---------------------------------------------------
     START BG MUSIC SAFELY
  --------------------------------------------------- */
  const startBgMusic = useCallback(() => {
    const music = bgMusicRef.current;
    if (!music) {
      console.error("No background music instance found");
      return;
    }

    if (!music.playing()) {
      console.log("Attempting to start background music...");
      
      // Force unmute and volume reset before playing
      music.mute(false);
      music.volume(0.5);
      
      if (Howler.ctx && Howler.ctx.state === "suspended") {
        Howler.ctx.resume().then(() => {
          console.log("AudioContext resumed, playing music");
          music.play();
        });
      } else {
        music.play();
        console.log("Background music play command sent");
      }
    } else {
      console.log("Background music is already playing");
    }
  }, []);

  return (
    <SoundContext.Provider
      value={{ isMuted, toggleMute, setSoundMuted, playSfx, startBgMusic }}
    >
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) throw new Error("useSound must be used within SoundProvider");
  return context;
};





