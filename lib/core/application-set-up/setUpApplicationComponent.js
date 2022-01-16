export async function setUpApplicationComponent(evt) {
  console.log("Desde el setUpApplicationComponent");

  let el;

  if (evt instanceof Event) el = evt.target;

  if (evt instanceof HTMLElement) el = evt;

  const dataset = js.dataObject(el.dataset);

  let { appActions } = await Import("appActions");

  for (let key in dataset) {
    let appFunction = appActions[key];

    if (appFunction) {
      appFunction(el);
    }
  }
}
