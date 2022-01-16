export async function addEventListener(element) {

    js(element).evento(element.getAttribute("event"), async function (evt) {

        evt.preventDefault();
        evt.stopPropagation();

        let formData = new FormData(evt.target);
        console.log(formData.entries().next());
        for(let entry of formData.entries()){
            console.log(entry);
        }

        const { setUpApplicationComponent } = await Import("setUpApplicationComponent");
        setUpApplicationComponent(evt);

        js.print(evt);

    });

}