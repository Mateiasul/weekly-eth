import createCache from "@emotion/cache";

const createEmotionCache = () => {
  return createCache({
    key: "css",
    stylisPlugins: [
      /* your plugins here */
    ],
  });
};

export default createEmotionCache;
