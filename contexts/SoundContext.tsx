import React,
{
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { Howler } from "howler";
import { sfx, getGlobalBgMusic } from "../lib/soundManager";
import { SoundType } from "../types";

interface SoundContextType {
  isMuted: boolean;
  toggleMute: () => void;
  setMute: (muted: boolean) => void;
  playSfx: (type: SoundType) => void;
  startBgMusic: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const [isMuted, setIsMuted] = useState<boolean>(() => {
    const saved = localStorage.getItem("sound_muted");
    return saved ? JSON.parse(saved) : false;
  });

  const bgRef = useRef(getGlobalBgMusic());

  /* ==============================
     APPLY MUTE STATE
  =============================== */
  useEffect(() => {
    localStorage.setItem("sound_muted", JSON.stringify(isMuted));

    bgRef.current.mute(isMuted);
    Howler.mute(isMuted);
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  const setMute = useCallback((muted: boolean) => {
    setIsMuted(muted);
  }, []);

  /* ==============================
     SAFE SFX PLAY
  =============================== */
  const playSfx = useCallback((type: SoundType) => {
    if (isMuted) return;

    if (type === SoundType.UI_CLICK) {
      const click = sfx.click;

      // prevent stacking
      click.stop();
      click.play();
    }
  }, [isMuted]);

  /* ==============================
     SAFE BACKGROUND START
  =============================== */
  const startBgMusic = useCallback(() => {
    const bg = bgRef.current;

    if (bg.playing()) return;

    if (Howler.ctx && Howler.ctx.state === "suspended") {
      Howler.ctx.resume().then(() => {
        bg.play();
      });
    } else {
      bg.play();
    }
  }, []);

  return (
    <SoundContext.Provider
      value={{
        isMuted,
        toggleMute,
        setMute,
        playSfx,
        startBgMusic,
      }}
    >
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error("useSound must be used within SoundProvider");
  }
  return context;
};







