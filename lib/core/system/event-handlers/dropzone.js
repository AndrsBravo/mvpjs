export function dropZone(el) {

  ["dragenter", "dragleave"].forEach(function (eventName) {
    el.addEventListener(eventName, function (evt) {
      evt.preventDefault();
      evt.stopPropagation();
      evt.currentTarget.classList.remove("drag-over");
    }, false);
  });

  el.addEventListener("dragover", function (evt) {
    evt.preventDefault();
    evt.stopPropagation();
    evt.currentTarget.classList.add("drag-over");
  }, false);

  el.addEventListener("drop", function (evt) {

    evt.preventDefault();
    evt.stopPropagation();

    const target = evt.currentTarget;
    target.classList.add("drag-over");

    const dataTransfer = new DataTransfer();
    var inputFile = el.querySelector("input[type=file]");

    target.dataTransfer.files.forEach((file) => {

      if (!inputFile) {
        return;
      }

      if (inputFile.accept) {

        inputFile.accept.split(",").forEach((extencion) => {

          if (file.name.endsWith(extencion)) {
            dataTransfer.items.add(file)
          }
        });
      }
    }

    );
  }, false);

}
