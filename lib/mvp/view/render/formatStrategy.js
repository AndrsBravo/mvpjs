export default {

    dateLocal: (date) => new Date(date).toLocaleDateString(),
    inputDate: (date) => new Date(date).toISOString().split("T")[0],
    capitalized: (str) => str.charAt(0).toUpperCase() + str.substring(1).toLocaleLowerCase()

}