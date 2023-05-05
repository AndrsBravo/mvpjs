export default async function ({ pathname, search, href }) {

  const route = [pathname, search];

  const result = { pageRoute: "'/'", id: undefined, pageMethod: "start", pathname, search, href, params: {}, values: [] };

  let id = route.reduce((acum, value) => acum = acum + value.trim().replace(" ", "_"), "");

  id = [...id].reduce((acum, item) => acum + (id.length * item.charCodeAt(0)), 1).toString(36);

  if (pathname === "/") {
    result.id = result.pageRoute + "_" + id;
    return result;
  }

  var values = pathname;

  if (values.startsWith("/")) values = values.slice(1);
  if (values.endsWith("/")) values = values.slice(0, values.length - 1);

  values = values.split("/");

  if (values.length > 0) {
    result.pageRoute = `'${values.shift()}'`;
  }

  /*
  if (values.length > 0) {
    result.pageMethod = values.shift();
  }*/

  
  if (values.length > 0) result.values = values;
  if (search.length > 0) result.params = setParams(search);

  result.id = result.pageRoute + "_" + id;
  return result;
}

function setParams(search) {

  const urlSearchParams = new URLSearchParams(search);
  const data = Object.fromEntries(urlSearchParams.entries());
  return data;

}
