"use strict";

const app = {
    menuData : {},
    dataUrl : "data/static.json",
    menuIndex : null,
    fetchOptions : {cache: "no-store"},

    init : () => {
        fetch(app.dataUrl, app.fetchOptions)
            .then((response) => response.json())
            .then((json) => {
                app.menuData = json["menu"];
                app.updateMenuIndex();
                app.buildMenu();
                app.buildPage();
            });
    },

    updateMenuIndex : () => {
        app.menuIndex = localStorage.getItem("menuIndex");
        if(app.menuIndex === null || app.menuIndex === "undefined"){
            app.setCurrentPageUrl(app.menuData[0].id);
        }
    },

    getCurrentPageData : () => {
        let result;
        app.menuData.every((d) => {
            result = d;
            return (app.menuIndex !== d.id);
        });
        return result;
    },

    setCurrentPageUrl : (index) => {
        app.menuIndex = index;
        localStorage.setItem("menuIndex", index);
    },

    buildMenu : () => {
        const ul = document.createElement("ul");
        app.menuData.forEach((d) => {
            let li = document.createElement("li");
            li.textContent = d.name;
            li.dataset.id = d.id;
            if(app.menuIndex === d.id){
                li.classList.add("active");
            }
            ul.appendChild(li);
        });
        const menu = document.getElementById("menu");
        menu.appendChild(ul);
        menu.addEventListener('click' , app.onMenuClickEvent);
    },

    onMenuClickEvent : (e) => {
        for (const child of e.target.parentElement.children) {
            child.classList.remove('active'); //reset all
        }
        e.target.classList.add('active'); //add current
        app.setCurrentPageUrl(e.target.dataset.id)
        app.buildPage();
    },

    buildPage : () => {
        const data = app.getCurrentPageData();
        fetch(data.page, app.fetchOptions)
            .then((response) => response.text())
            .then((text) => {
                document.getElementById("content").innerHTML = String(text);
            });

        const nav = document.getElementById("nav");
        nav.innerHTML = data.name;
    }
};

app.init();






