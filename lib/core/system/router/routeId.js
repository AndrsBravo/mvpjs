export default async function ({ pathname, search, href }, config) {
 

  const route = [pathname, search];

  const result = { pageRoute: "/", id: undefined, pageMethod: "start", pathname, search, href, params: {}, values: [] };

  let id = route.reduce((acum, value) => acum = acum + value.trim().replace(" ", "_"), "");

  id = [...id].reduce((acum, item) => acum + (id.length * item.charCodeAt(0)), 1).toString(36);

  let values = pathname.replace(config.base, "");

  if (pathname === "/" || values === "" || values === "/") {
    return result.id = result.pageRoute + "_" + id, result;
  };

  values = values.substring(1);

  let params = values.split("/");

  return result.pageRoute = params.shift(),
    result.values = params,
    result.params = setParams(search),
    result.id = result.pageRoute + "_" + id,
    result;
}

function setParams(search) {

  const urlSearchParams = new URLSearchParams(search);
  const data = Object.fromEntries(urlSearchParams.entries());
  return data;

}
