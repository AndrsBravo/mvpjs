export default class{

    #filesResumeListener;
    #fileDataListener;
    #fileSlicerListener;
    #fileList;

   
    constructor({}){}

}

function FileSlicer(file, fn) {

    var dataCallback = fn;

    var reader = new FileReader();

    var data = [];

    reader.onload = (evt) => {

        data = evt.target.result.split("\r\n");

        this.firesData();

    };

    this.fileName = file.name;
    this.file = file;
    this.currentRecords = 0;
    this.progress = 0;
    this.records = 0;
    this.status = "";

    this.hasRecords = function () {

        return (data.length > this.currentRecords);
    };

    this.getData = function (records = 50) {

        this.records = records;
        this.firesData();

    };

    this.firesData = function () {

        if (data.length <= this.currentRecords) {

            return;
        }

        let starts = this.currentRecords;
        let ends = Math.min(this.currentRecords + this.records, data.length);

        let ratio = ends / data.length;

        this.progress = isNaN(ratio) ? 0 * 100 : ratio * 100;

        let result = { fileName: file.name, total: data.length, portion: ends, data: data.slice(starts, ends).join(",") };

        this.currentRecords += this.records;

        if (dataCallback) {
            dataCallback(result);
        }

    };

    this.data = function () {

        let starts = this.currentRecords;
        let ends = Math.min(this.currentRecords + this.records, data.length);

        let result = { fileName: file.name, total: data.length, portion: ends, data: data.slice(starts, ends).join(",") };
        return result;
    };


    reader.readAsBinaryString(file);


}

//FileSlicers
const fileSlicers = function (fileList = null, fn) {

    var result;

    if (fileList) {
        result = fileList.map((file) => {

            return new FileSlicer(file, fn);

        });

    }
    return result;

};