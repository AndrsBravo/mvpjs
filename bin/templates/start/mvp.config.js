export default {
  theme: { layout: () => import("./src/layout/DefaultLayout.js") },
  routes: [
    { '/': () => import("./src/start/pages/StartPage.js") },
    { '404': () => import("./src/notfound/pages/NotFoundPage.js") },
  ],
  config: {},
};
