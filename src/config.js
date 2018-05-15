import {moodImagery} from "./assets.js";

export const config = {
  mood: {
    seasons: {
      spring: moodImagery.sSG,
      summer: moodImagery.sSU,
      autumn: moodImagery.sAT,
      winter: moodImagery.sWT,
    },
    imagery: {
      brokenClouds: {
        day: {
          autumn: moodImagery.wBCdA1,
          spring: moodImagery.wBCdS1, // subst
          summer: moodImagery.wBCdS1,
          winter: moodImagery.wBCdA1, // subst
        },
        night: {
          autumn: moodImagery.wBCnS1, // subst
          spring: moodImagery.wBCnS1, // subst
          summer: moodImagery.wBCnS1,
          winter: moodImagery.wBCnS1, // subst
        },
      },
      clearSky: {
        day: {
          autumn: moodImagery.wCSdA1,
          spring: moodImagery.wCSdS1, // subst
          summer: moodImagery.wCSdS1,
          winter: moodImagery.wCSdW1,
        },
        night: {
          autumn: moodImagery.wCSnA1,
          spring: moodImagery.wCSnS1, // subst
          summer: moodImagery.wCSnS1,
          winter: moodImagery.wCSnW1,
        },
      },
      mist: {
        day: {
          autumn: moodImagery.wMdA1,
          spring: moodImagery.wMdA1, // subst
          summer: moodImagery.wMdA1, // subst
          winter: moodImagery.wMdW1,
        },
        night: {
          autumn: moodImagery.wMnS1, // subst
          spring: moodImagery.wMnS1, // subst
          summer: moodImagery.wMnS1,
          winter: moodImagery.wMnW1,
        },
      },
      rain: {
        day: {
          autumn: moodImagery.wRdA1,
          spring: moodImagery.wRdSG1,
          summer: moodImagery.wRdS1,
          winter: moodImagery.wRdW1,
        },
        night: {
          autumn: moodImagery.wRnS1, // subst
          spring: moodImagery.wRnS1, // subst
          summer: moodImagery.wRnS1,
          winter: moodImagery.wRnS1, // subst
        },
      },
      fewClouds: {
        day: {
          autumn: moodImagery.wSCdS1, // subst
          spring: moodImagery.wSCdS1, // subst
          summer: moodImagery.wSCdS1, // subst
          winter: moodImagery.wSCdW1, // subst
        },
        night: {
          autumn: moodImagery.wBCnS1, // subst
          spring: moodImagery.wBCnS1, // subst
          summer: moodImagery.wBCnS1, // subst
          winter: moodImagery.wBCnS1, // subst
        },
      },
      scatteredClouds: {
        day: {
          autumn: moodImagery.wSCdS1, // subst
          spring: moodImagery.wSCdS1, // subst
          summer: moodImagery.wSCdS1,
          winter: moodImagery.wSCdW1,
        },
        night: {
          autumn: moodImagery.wBCnS1, // subst
          spring: moodImagery.wBCnS1, // subst
          summer: moodImagery.wBCnS1, // subst
          winter: moodImagery.wBCnS1, // subst
        },
      },
      showerRain: {
        day: {
          autumn: moodImagery.wSRdS1, // subst
          spring: moodImagery.wSRdS1, // subst
          summer: moodImagery.wSRdS1,
          winter: moodImagery.wRdW1,
        },
        night: {
          autumn: moodImagery.wRnS1, // subst
          spring: moodImagery.wRnS1, // subst
          summer: moodImagery.wRnS1, // subst
          winter: moodImagery.wRnS1, // subst
        },
      },
      snow: {
        day: {
          autumn: moodImagery.wSdA1,
          spring: moodImagery.wSdA1, // subst
          summer: moodImagery.wSdA1, // subst
          winter: moodImagery.wSdW1,
        },
        night: {
          autumn: moodImagery.wSnW1, // subst
          spring: moodImagery.wSnW1, // subst
          summer: moodImagery.wSnW1, // subst
          winter: moodImagery.wSnW1,
        },
      },
      thunderStorm: {
        day: {
          autumn: moodImagery.wTSdS1, // subst
          spring: moodImagery.wTSdS1, // subst
          summer: moodImagery.wTSdS1,
          winter: moodImagery.wTSdW1,
        },
        night: {
          autumn: moodImagery.wTSnS1, // subst
          spring: moodImagery.wTSnS1, // subst
          summer: moodImagery.wTSnS1,
          winter: moodImagery.wTSnS1, // subst
        },
      },
    } // imagery
  }, // mood
};
