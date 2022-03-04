var page;
var lastPage;
var size = 20; //quanti elementi vedere per pagina
var first;
var last;
var prev;
var next;
var id;
var nextId;
var btnModifica = "<button class='btn btn-primary ms-5 modifica' data-bs-toggle='modal' data-bs-target='#modal-modify'>Modifica</button>";
var btnElimina = "<button class='btn btn-danger elimina'>Elimina</button>";

function nPage() {
    $("#current-page").html(page);
    if (page == 0) {
        $("#first").parent().addClass("disabled");
        $("#prev").parent().addClass("disabled");
        $("#next").parent().removeClass("disabled");
        $("#last").parent().removeClass("disabled");
    } else if (page == lastPage) {
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
    $.get("http://localhost:8080/employees?size=" + size,
        function (data) {
            console.log(data);
            page = data["page"]["number"];
            lastPage = data["page"]["totalPages"] - 1;
            nextId = data["page"]["totalElements"] + 199976;
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

    $("#loading").addClass("d-none");

    $("#pagination").removeClass("d-none");

    $("tbody").append(dipendente);

    $(".elimina").click(function () {
        var idd = $(this).parent().data("id");
        console.log("ti elimino " + idd);

        $.ajax({
            type: "DELETE",
            url: "http://localhost:8080/employees?page=" + page,
            data: JSON.stringify({
                id: idd
            }),
            dataType: "json",
            success: function () {
                $("#loading").removeClass("d-none");
                $("tbody").html("");
                $.get("http://localhost:8080/employees?page=" + page,
                    function (data) {
                        displayTable(data['_embedded']['employees']);
                        page = data["page"]["number"];
                        prev = data["_links"]["prev"]["href"];
                        nPage();
                    },
                );
            }
        });
    });
}

$("#next").click(function () {
    $("#loading").removeClass("d-none");
    $("tbody").html("");
    $.get(next,
        function (data) {
            displayTable(data['_embedded']['employees']);
            page = data["page"]["number"];
            if (page < lastPage) {
                next = data["_links"]["next"]["href"];
            }
            prev = data["_links"]["prev"]["href"];
            nPage();
        },
    );
});

$("#prev").click(function () {
    $("#loading").removeClass("d-none");
    $("tbody").html("");
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
    $("#loading").removeClass("d-none");
    $("tbody").html("");
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
    $("#loading").removeClass("d-none");
    $("tbody").html("");
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

    //posto il nuovo dipendente al server
    $.ajax({
        type: 'POST',
        url: 'http://localhost:8080/employees',
        data: JSON.stringify({
            birthDate: "",
            firstName: nome,
            lastName: cognome,
            gender: "M",
            hireDate: ""
        }),
        success: function () {
            nextId++;
            $("#loading").removeClass("d-none");
            $("tbody").html("");
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
        },
        contentType: "application/json",
        dataType: 'json'
    });
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
