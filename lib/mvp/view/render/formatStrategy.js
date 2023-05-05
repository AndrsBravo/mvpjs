export default {

    dateLocal: (date) => new Date(date).toLocaleDateString(),
    inputDate: (date) => new Date(date).toISOString().split("T")[0]

}