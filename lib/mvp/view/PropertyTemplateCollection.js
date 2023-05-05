export default class PropertyTemplateCollection{
    
    constructor(){}
    add(template){

        const entries= Object.entries(template);
        entries.forEach(entry=>{const [key,value] = entry; this[key] = value; })

    }
}