var roles = [{
    "value": 1,
    "text": "Usuario"
}, {
    "value": 2,
    "text": "Administrador"
}];

var states = [{
    "value": 0,
    "text": "Inactivo"
}, {
    "value": 1,
    "text": "Activo"
}];




kendo.culture("es-ES");
$(document).ready(function () {


    dataSource = new kendo.data.DataSource({
        transport: {
            read: { url: "/readadmin", dataType: "json" },
            update: { url: "/", type: "POST", dataType: "json" },
            destroy: { url: "/user/delete", type: "POST", dataType: "json" },
            create: { url: "/user/create", type: "POST", dataType: "json" },
            parameterMap: function (options, operation) {
                if (operation !== "read" && options.models) {
                    var datos = options.models[0]
                    return datos;
                }
            }
        },
        batch: true,
        pageSize: 10,
        serverFiltering: false,
        schema: {
            model: {
                id: "id",
                fields: {
                    open: {type:'date'},
                    close: {type:'date'}
                }
            }
        }
    },
    );

    $("#grid").kendoGrid({
        dataSource: dataSource,
        height: 475,
        filterable: true,
        pageable: { refresh: true, pageSizes: true, },
        toolbar: ['create','excel'],
        columns: [
            { field: "id", title: "Ticket", filterable: { multi: true, search: true, search: true } },
            { field: "name", title: "Cliente", filterable: { multi: true, search: true, search: true } },
            { field: "open", title: "Fecha inicio", filterable: { multi: true, search: true, search: true }, format: "{0:dd/MM/yyyy HH:mm:ss}"},
            { field: "close", title: "Fecha fin", filterable: {search: true },format: "{0:dd/MM/yyyy HH:mm:ss}" },
            {field: "time", title:"Tiempo transcurrido",filterable: { search: true }},
            {field: "pause", title:"Tiempo pausas",filterable: { search: true }},
            {field: "total", title:"Tiempo total",filterable: { search: true }}],
        editable: "popup"
    });
});
function redirect(location) {
    window.location.href = location;
}
