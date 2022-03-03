var page;
var first;
var last;
var prev;
var next;
var id;
var nextId = 10006;
var btnModifica = "<button class='btn btn-primary ms-5 modifica' data-bs-toggle='modal' data-bs-target='#modal-modify'>Modifica</button>";
var btnElimina = "<button class='btn btn-danger elimina'>Elimina</button>";

function nPage() {
    $("#current-page").html(page);
    if (page == 0) {
        $("#first").parent().addClass("disabled");
        $("#prev").parent().addClass("disabled");
        $("#next").parent().removeClass("disabled");
        $("#last").parent().removeClass("disabled");
    } else if (page == 30002){
        $("#first").parent().removeClass("disabled");
        $("#prev").parent().removeClass("disabled");
        $("#next").parent().addClass("disabled");
        $("#last").parent().addClass("disabled");
    } else {
        $("#first").parent().removeClass("disabled");
        $("#prev").parent().removeClass("disabled");
        $("#next").parent().removeClass("disabled");
        $("#last").parent().removeClass("disabled");
    }
}

//una volta che la pagina viene caricata, vengono inseriti gli elementi nella tabella
$(document).ready(
    $.get("http://localhost:8080/employees?size=10",
        function (data) {
            page = data["page"]["number"];
            next = data["_links"]["next"]["href"];
            if (page > 0) {
                prev = data["_links"]["prev"]["href"];
            }
            first = data["_links"]["first"]["href"];
            last = data["_links"]["last"]["href"];
            displayTable(data['_embedded']['employees']);
            nPage();
        },
    )
);

function displayTable(data) {
    var dipendente;

    $("tbody").html("");

    $.each(data, function (i, value) {
        dipendente += '<tr>';
        dipendente += '<th scope="row">' + value.id + '</th>';
        dipendente += '<td>' + value.firstName + '</td>';
        dipendente += '<td>' + value.lastName + '</td>';
        dipendente += '<td data-id=' + value.id + '>' + btnElimina + btnModifica + '</td>';
        dipendente += '</tr>';
    });
    $("tbody").append(dipendente);
}

$("#next").click(function () {
    $.get(next,
        function (data) {
            displayTable(data['_embedded']['employees']);
            page = data["page"]["number"];
            if(page < 30002)
            next = data["_links"]["next"]["href"];
            prev = data["_links"]["prev"]["href"];
            nPage();
        },
    );
});

$("#prev").click(function () {
    $.get(prev,
        function (data) {
            displayTable(data['_embedded']['employees']);
            page = data["page"]["number"];
            next = data["_links"]["next"]["href"];
            if (page > 0) {
                prev = data["_links"]["prev"]["href"];
            }
            nPage();
        },
    );
});

$("#first").click(function () {
    $.get(first,
        function (data) {
            displayTable(data['_embedded']['employees']);
            page = data["page"]["number"];
            next = data["_links"]["next"]["href"];
            nPage();
            $("#first").parent().addClass("disabled");
            $("#prev").parent().addClass("disabled");
            $("#next").parent().removeClass("disabled");
            $("#last").parent().removeClass("disabled");
        },
    );
});

$("#last").click(function () {
    $.get(last,
        function (data) {
            displayTable(data['_embedded']['employees']);
            page = data["page"]["number"];
            prev = data["_links"]["prev"]["href"];
            nPage();
            $("#first").parent().removeClass("disabled");
            $("#prev").parent().removeClass("disabled");
            $("#next").parent().addClass("disabled");
            $("#last").parent().addClass("disabled");
        },
    );
});

$("#aggiungi").click(function () {
    var nome = $("#nome").val();
    var cognome = $("#cognome").val();

    $("#nome").val("");
    $("#cognome").val("");

    //creo un nuovo oggetto
    var dipendente = {
        "id": nextId,
        "birthDate": "",
        "firstName": nome,
        "lastName": cognome,
        "gender": "",
        "hireDate": "",
    }

    //pusho il nuovo oggetto nell'array data
    data.push(dipendente);

    nextId++;

    displayTable();
});

$("#modifica").click(function () {
    var nome = $("#nome-m").val();
    var cognome = $("#cognome-m").val();

    for (var i = 0; i < data.length; i++) {
        if (id == data[i].id) {
            data[i].firstName = nome;
            data[i].lastName = cognome;
        }
    }
    displayTable();
});

$(".modifica").click(function () {
    id = $(this).parent().data("id");

    for (var i = 0; i < data.length; i++) {
        if (id == data[i].id) {
            $("#nome-m").val(data[i].firstName);
            $("#cognome-m").val(data[i].lastName);
        }
    }
});

$(".elimina").click(function () {
    $(this).parents("tr").fadeOut("fast");

    var id = $(this).parent().data("id");

    for (var i = 0; i < data.length; i++) {
        if (id == data[i].id) {
            data.splice(i, 1);
        }
    }
});