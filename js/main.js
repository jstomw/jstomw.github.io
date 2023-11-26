"use strict";

const app = {
    menuData : {},
    dataUrl : "data/static.json",
    menuIndex : null,
    fetchOptions : {cache: "no-store"},
    language : "en-US",

    init : () => {
        fetch(app.dataUrl, app.fetchOptions)
            .then((response) => response.json())
            .then((json) => {
                app.menuData = json["menu"];
                app.updateMenuIndex();
                app.buildMenu();
                app.buildPage();
                app.buildLang();
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
            li.innerHTML = d.name;
            li.dataset.id = d.id;
            if(app.menuIndex === d.id){
                li.classList.add("active");
            }
            ul.appendChild(li);
        });
        const menu = document.getElementById("menu");
        menu.appendChild(ul);
        ul.addEventListener('click' , app.onMenuClick);
    },

    onMenuClick : (e) => {
        let target = e.target;
        if(target.tagName !== "LI"){
            while(target.tagName !== "LI"){
                target = target.parentElement;
            }
        }
        for (const child of target.parentElement.children) {
            if(child.tagName === "LI")
                child.classList.remove('active'); //reset all
        }
        target.classList.add('active'); //add current
        app.setCurrentPageUrl(target.dataset.id)
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
    },

    buildLang : () => {
        app.language = localStorage.getItem("language");
        if(app.language === null || app.menuIndex === "undefined"){
            localStorage.setItem("language", app.language = "en-US");
        }
        const nav = document.getElementById("main");
        nav.dataset.lang = app.language;
        document.getElementById("ls").addEventListener("click", app.onLangClick);
    },

    onLangClick: (e)=>{
        const nav = document.getElementById("main");
        if(e.target.dataset.lang !== undefined){
            localStorage.setItem("language", app.language = nav.dataset.lang = e.target.dataset.lang);
        }
    }
};

app.init();






