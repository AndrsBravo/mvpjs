export default async function ({ pathname, search, href }) {
  const route = [pathname, search];

  const result = { pageRoute: "'/'", id: undefined, pageMethod: "start", pathname, search, href };

  let id = route.reduce((acum, value) => {
    acum = acum + value.trim().replace(" ", "_");
    return acum;
  }, "");

  id = [...id]
    .reduce((acum, item) => acum + 32 * item.charCodeAt(0), 1)
    .toString(36);

  if (pathname === "/") {
    result.id = result.pageRoute + "_" + id;
    return result;
  }

  const values = pathname.split("/");
  values.shift();

  if (values.length > 0) {
    result.pageRoute = `'${values.shift()}'`;
  }
  if (values.length > 0) {
    result.pageMethod = values.shift();
  }

  result.id = result.pageRoute + "_" + id;
  return result;
}
