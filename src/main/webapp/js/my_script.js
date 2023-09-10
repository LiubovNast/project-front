$.get("/rest/players", function (response) {
    getTable(response);
    getPages(14, 1);
});

function getUsers(number, size) {
    $("td").remove();
    $.get("/rest/players", {pageNumber: number, pageSize: size}, function (response) {
        getTable(response);
    });
}


function getPages(number, active) {
    if (1 == active) {
        $('#pages').html('<button value="' + 1 + '" class="btn active">' + 1 + '</button>');
    } else $('#pages').html('<button class="btn" onclick="getAccountsList(1)">' + 1 + '</button>');
    for (let i = 2; i < number + 1; i++) {
        if (i == active) {
            $('#pages').append('<button value="' + i + '" class="btn active">' + i + '</button>');
        } else $('#pages').append('<button class="btn" onclick="getAccountsList(' + i + ')">' + i + '</button>');
    }
}

function getAccountsList(active) {
    let amount = document.getElementById("select");
    $.get("/rest/players/count", function (response) {
        var number = parseInt(response / parseInt(amount.value));
        getPages(number, active);
    });
    getUsers(active - 1, amount.value);
}

function getTable(response) {
    for (const i in response) {
        var user = response[i];
        $('#users').append('<tr>' +
            '<td>' + user.id + '</td>' +
            '<td id="name' + user.id + '" class="' + user.name + '">' + user.name + '</td>' +
            '<td id="title' + user.id + '" class="' + user.title + '">' + user.title + '</td>' +
            '<td id="race' + user.id + '" class="' + user.race + '">' + user.race + '</td>' +
            '<td id="profession' + user.id + '" class="' + user.profession + '">' + user.profession + '</td>' +
            '<td>' + user.level + '</td>' +
            '<td>' + user.birthday + '</td>' +
            '<td id="banned' + user.id + '" class="' + user.banned + '">' + user.banned + '</td>' +
            '<td><img class="edit" id="edit' + user.id + '" src="../img/edit.png" onclick="editUser(this.id, ' + user.id + ')"></td>' +
            '<td><img class="delete" id="' + user.id + '" src="../img/remove.png" onclick="deleteUser(this.id)"></td>' +
            '</tr>');
    }
}

function deleteUser(id) {
    $.ajax({
        type: "DELETE",
        url: "/rest/players/" + id,
        success: function () {
            const page = document.getElementById('pages').getElementsByClassName('active');
            const active = page.item(0).value;
            getAccountsList(active);
        }
    });
}

function editUser(id, id_delete) {
    var image = document.getElementById(id);
    image.src = "../img/save.png";
    document.getElementById(id_delete).style.visibility = 'hidden';
    name = document.getElementById('name' + id_delete).className;
    title = document.getElementById('title' + id_delete).className;
    race = document.getElementById('race' + id_delete).className;
    profession = document.getElementById('profession' + id_delete).className;
    banned = document.getElementById('banned' + id_delete).className;
    $('#name' + id_delete).html('<input type="text" placeholder="' + name + '" value="' + name + '">');
    $('#title' + id_delete).html('<input type="text" placeholder="' + title + '" value="' + title + '">');
    $('#race' + id_delete).html('<select>\n' +
        '            <option value="' + race + '" selected="selected">' + race + '</option>\n' +
        '            <option value="HUMAN">HUMAN</option>\n' +
        '            <option value="DWARF">DWARF</option>\n' +
        '            <option value="ELF">ELF</option>\n' +
        '            <option value="GIANT">GIANT</option>\n' +
        '            <option value="ORC">ORC</option>\n' +
        '            <option value="TROLL">TROLL</option>\n' +
        '            <option value="HOBBIT">HOBBIT</option>\n' +
        '        </select>');
    $('#profession' + id_delete).html('<select>\n' +
        '            <option value="' + profession + '" selected="selected">' + profession + '</option>\n' +
        '            <option value="WARRIOR">WARRIOR</option>\n' +
        '            <option value="ROGUE">ROGUE</option>\n' +
        '            <option value="SORCERER">SORCERER</option>\n' +
        '            <option value="CLERIC">CLERIC</option>\n' +
        '            <option value="PALADIN">PALADIN</option>\n' +
        '            <option value="NAZGUL">NAZGUL</option>\n' +
        '            <option value="WARLOCK">WARLOCK</option>\n' +
        '            <option value="DRUID">DRUID</option>\n' +
        '        </select>');
    $('#banned' + id_delete).html('<select>\n' +
        '            <option value="' + banned + '" selected="selected">' + banned + '</option>\n' +
        '            <option value="true">true</option>\n' +
        '            <option value="false">false</option>\n' +
        '        </select>');
}