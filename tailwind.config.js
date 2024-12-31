/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: yunyouliu
 * @Date: 2024-11-14 21:23:16
 * @LastEditors: yunyouliu
 * @LastEditTime: 2024-11-21 19:42:20
 */
module.exports = {
  content: [
    "./src/pages/**/*.tsx",
    "./src/components/**/*.tsx",
    "./src/layouts/**/*.tsx",
    // jsx
    "./src/pages/**/*.jsx",
    "./src/components/**/*.jsx",
    "./src/layouts/**/*.jsx",
  ],
  theme: {
    screens: {
      tablet: "502px",
      // => @media (min-width: 502px) { ... }

      laptop: "1024px",
      // => @media (min-width: 1024px) { ... }

      desktop: "1280px",
      // => @media (min-width: 1280px) { ... }
    },
  },
  darkMode: "media", // or 'media' or 'class'
};
