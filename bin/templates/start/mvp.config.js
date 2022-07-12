export default {
  theme: { layout:()=> import("./src/layout/DefaultLayout.js") }
  ,
  routes: [{ '/':()=> import("./src/start/pages/StartPage.js") },
  { 'pagenotfound':()=> import("./src/notfound/pages/NotFoundPage.js") },],
  config: {},
};
