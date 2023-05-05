export default function (htmlElement) {
  js(htmlElement).Observe(
    { childList: true },
     (mutationList, observer)=> {
      js.print(mutationList);

      for (const mutation of mutationList) {
        js(mutation.target).Move();
      }
    }
  );
}
