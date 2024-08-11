export default async function ({ pathname, search, href }) {

  const route = [pathname.trim().replace(" ", "_"), search.trim().replace(" ", "_")];

  const result = { pageRoute: "/", id: undefined, pageMethod: "start", pathname, search, href };

  let id = route.reduce((total, value) => total = total + value.trim().replace(" ", "_"), "");

  id = [...id].reduce((total, item) => total + (id.length * item.charCodeAt(0)), 1).toString(36);

  return result.id = id, result;

}
