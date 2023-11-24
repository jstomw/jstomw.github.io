"use strict";

function buildMenu(data){
    let html = ["<ul>"];
    data.forEach(d => {
        html.push(`<li>/${d.name}</li>`);
    });
    html.push("<ul>");
    document.getElementById("menu").innerHTML = html.join("\n");
}

function buildPage(page){
    fetch(page)
        .then((response) => response.text())
        .then((text) => {
            document.getElementById("content").innerHTML = String(text);
        });
}

fetch('data/static.json')
    .then((response) => response.json())
    .then((json) => {
        buildMenu(json["menu"]);
        json["pages"].forEach(d => buildPage(d));
    });

