
document.body.insertAdjacentHTML("beforeend","<input type='text' id='inputText'/>");
const input = document.body.lastChild;

const objectData = {name:'',address:{}};


Object.defineProperty(objectData.address,"street",{
    get(){return input.value},
    set(newValue){input.value = newValue;}
});

objectData.name = "KlK mundo"
