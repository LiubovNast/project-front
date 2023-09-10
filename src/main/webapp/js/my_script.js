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
            '<td><img class="edit" id="edit' + user.id + '" src="../img/edit.png" onclick="editUser(this.id, ' + user.id + ')">' +
            '<img class="save" id="save' + user.id + '" src="../img/save.png" onclick="save(' + user.id + ')"></td>' +
            '<td><img class="delete" id="' + user.id + '" src="../img/remove.png" onclick="deleteUser(this.id)"></td>' +
            '</tr>');
    }
}

function deleteUser(id) {
    $.ajax({
        type: "DELETE",
        url: "/rest/players/" + id,
        success: drawActive()
    });
}

function editUser(edit, id) {
    document.getElementById(edit).style.visibility = 'hidden';
    document.getElementById('save' + id).style.visibility = 'visible';
    document.getElementById(id).style.visibility = 'hidden';
    let name = document.getElementById('name' + id).className;
    let title = document.getElementById('title' + id).className;
    let race = document.getElementById('race' + id).className;
    let profession = document.getElementById('profession' + id).className;
    let banned = document.getElementById('banned' + id).className;
    $('#name' + id).html('<input type="text" id="input-name" placeholder="' + name + '" value="' + name + '">');
    $('#title' + id).html('<input type="text" id="input-title" placeholder="' + title + '" value="' + title + '">');
    $('#race' + id).html('<select id="select-race">\n' +
        '            <option value="' + race + '" selected="selected">' + race + '</option>\n' +
        '            <option value="HUMAN">HUMAN</option>\n' +
        '            <option value="DWARF">DWARF</option>\n' +
        '            <option value="ELF">ELF</option>\n' +
        '            <option value="GIANT">GIANT</option>\n' +
        '            <option value="ORC">ORC</option>\n' +
        '            <option value="TROLL">TROLL</option>\n' +
        '            <option value="HOBBIT">HOBBIT</option>\n' +
        '        </select>');
    $('#profession' + id).html('<select id="select-prof">\n' +
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
    $('#banned' + id).html('<select id="select-ban">\n' +
        '            <option value="' + banned + '" selected="selected">' + banned + '</option>\n' +
        '            <option value="true">true</option>\n' +
        '            <option value="false">false</option>\n' +
        '        </select>');
}

function save(id) {
    let name = document.getElementById('input-name').value;
    let title = document.getElementById('input-title').value;
    let race = document.getElementById('select-race').value;
    let profession = document.getElementById('select-prof').value;
    let banned = document.getElementById('select-ban').value;

    const obj = {
        "name": name,
        "title": title,
        "race": race,
        "profession": profession,
        "banned": banned
    };
    const myJSON = JSON.stringify(obj);
    $.ajax({
        contentType: 'application/json; charset=UTF-8',
        type: "POST",
        url: "/rest/players/" + id,
        data: myJSON,
        success: drawActive()
    });
}

function drawActive() {
    const page = document.getElementById('pages').getElementsByClassName('active');
    const active = page.item(0).value;
    getAccountsList(active);
}