import click from "./click";
import link from "./link";
import submit from "./submit";
import change from "./change";
import fileChange from "./file-change";
import event from "./event";

const eventHandlers = {

    event,
    link,
    submit,
    click,
    change,
    fileChange,
    drop: (el, eventListener, presenter) => {


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
            target.classList.remove("drag-over");

            const firePresenterFn = () => {
                if (!presenter[eventListener]) return;
                presenter[eventListener](evt.dataTransfer, target, evt);
            }
            const addFilesToInput = (files) => {

                const eventFire = () => {
                    if ("createEvent" in document) {

                        var evt = new Event("change", { bubbles: false, cancelable: true });
                        inputFile.dispatchEvent(evt);

                    }
                }

                if (inputFile.multiple) {
                    inputFile.files = files;
                    eventFire();
                    return;
                }
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(files[0]);
                eventFire();
                //inputFile.fireEvent("onchange");

            }

            var inputFile = el.querySelector("input[type=file]");
            if (!inputFile) { firePresenterFn(); return; }

            const dataTransfer = new DataTransfer();

            if (!inputFile.accept) { addFilesToInput(evt.dataTransfer.files); return; }

            Array.from(evt.dataTransfer.files).forEach(file => {

                inputFile.accept.split(",").forEach((extension) => {

                    if (file.name.endsWith(extension)) {
                        dataTransfer.items.add(file)
                    }
                });

            });

            addFilesToInput(dataTransfer.files);
        }, false);
    }

};

export default eventHandlers;