import { Howl, HowlOptions } from "howler";

/* ===================================================
   SOUND FILES
=================================================== */

const BG_MUSIC_URL = "/bg-music.mp3";
const UI_CLICK_URL = "/click.mp3";

/* ===================================================
   BACKGROUND MUSIC CONFIG
=================================================== */

const bgMusicConfig: HowlOptions = {
  src: [BG_MUSIC_URL],
  loop: true,
  volume: 0.5,
  preload: true,
};

/* ===================================================
   SINGLETON BACKGROUND MUSIC
=================================================== */

let bgInstance: Howl | null = null;

export const getGlobalBgMusic = (): Howl => {
  if (!bgInstance) {
    bgInstance = new Howl(bgMusicConfig);
  }
  return bgInstance;
};

/* ===================================================
   SFX SYSTEM (SAFE + NON STACKING)
=================================================== */

let sfxInstances: Record<string, Howl> | null = null;

const createSfx = () => ({
  click: new Howl({
    src: [UI_CLICK_URL],
    volume: 0.5,
    preload: true,
  }),
});

const getSfxInstances = () => {
  if (!sfxInstances) {
    sfxInstances = createSfx();
  }
  return sfxInstances;
};

export const sfx = {
  get click() {
    return getSfxInstances().click;
  },
};

/* ===================================================
   HMR CLEANUP (DEV SAFE)
=================================================== */

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    if (sfxInstances) {
      Object.values(sfxInstances).forEach(sound => sound.unload());
      sfxInstances = null;
    }

    if (bgInstance) {
      bgInstance.unload();
      bgInstance = null;
    }
  });
}








