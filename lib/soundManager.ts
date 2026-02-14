import { Howl, HowlOptions, Howler } from "howler";

/* ---------------------------------------------------
   GLOBAL AUDIO SETTINGS
--------------------------------------------------- */

(Howler as any).poolSize = 64; // Avoid any pool errors
Howler.autoUnlock = true;      // Mobile unlock

/* ---------------------------------------------------
   SOUND SOURCES
--------------------------------------------------- */

const SILENT_MP3 =
  "data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//OEAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAEAAABIADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV6enp6enp6enp6enp6enp6enp6enp6enp//OEAAAAAAAAAAAAAAAAAAAAAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAAASCCrb8LAAAAAAAAAAAAAAAAAAAAAAA=";

const UI_CLICK_URL = "/click.mp3";

// ✅ Local background music (downloaded to public folder)
const BG_MUSIC_URL = "/bg-music.mp3";

/* ---------------------------------------------------
 * Background Music Configuration
 * --------------------------------------------------- */
export const bgMusicConfig: HowlOptions = {
  src: [BG_MUSIC_URL],
  loop: true,
  volume: 0.5,
  html5: true, // ✅ Use HTML5 Audio for large files
  preload: true,
  onload: () => console.log("Background music loaded successfully from local path"),
  onplay: (id) => console.log("Background music started playing! ID:", id),
  onend: () => console.log("Background music ended (looping)"),
  onloaderror: (id, err) => {
    console.error("Background music load error:", err);
  },
  onplayerror: (id, err) => {
    console.error("Background music play error:", err);
    Howler.ctx?.resume();
  }
};

/* ---------------------------------------------------
   GLOBAL SINGLETON BG MUSIC
--------------------------------------------------- */

let globalBgMusic: Howl | null = null;

export const getGlobalBgMusic = () => {
  if (!globalBgMusic) {
    globalBgMusic = new Howl(bgMusicConfig);
  }
  return globalBgMusic;
};

/* ---------------------------------------------------
   SFX SYSTEM (WebAudio)
--------------------------------------------------- */

let sfxInstances: Record<string, Howl> | null = null;

const createSfx = () => ({
  click: new Howl({ src: [UI_CLICK_URL], volume: 0.5, preload: true }),
  hover: new Howl({ src: [SILENT_MP3], volume: 0.2, preload: true }),
  entrance: new Howl({ src: [SILENT_MP3], volume: 0.7, preload: true }),
  heartbeat: new Howl({ src: [SILENT_MP3], volume: 0.3, preload: true }),
  chime: new Howl({ src: [SILENT_MP3], volume: 0.5, preload: true }),
  success: new Howl({ src: [SILENT_MP3], volume: 0.5, preload: true }),
  error: new Howl({ src: [SILENT_MP3], volume: 0.5, preload: true }),
});

const getSfxInstances = () => {
  if (!sfxInstances) sfxInstances = createSfx();
  return sfxInstances;
};

export const sfx = {
  get click() { return getSfxInstances().click; },
  get hover() { return getSfxInstances().hover; },
  get entrance() { return getSfxInstances().entrance; },
  get heartbeat() { return getSfxInstances().heartbeat; },
  get chime() { return getSfxInstances().chime; },
  get success() { return getSfxInstances().success; },
  get error() { return getSfxInstances().error; },
};

/* ---------------------------------------------------
   HMR CLEANUP
--------------------------------------------------- */

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    if (sfxInstances) {
      Object.values(sfxInstances).forEach(sound => sound.unload());
      sfxInstances = null;
    }
    if (globalBgMusic) {
      globalBgMusic.unload();
      globalBgMusic = null;
    }
  });
}







