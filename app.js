import {searching, render,getPokemons,rendering, formatText, makingbuttons } from "./functions.js";

document.addEventListener('DOMContentLoaded', async () => {
    const menu = document.getElementById('menu');
    const maincontainer = document.getElementById('maincontainer');
    const search_bar = document.getElementById('search-input');
    const search_button = document.getElementById('search-button');

    search_button.addEventListener('click', async () => 
    {
        const search = search_bar.value;
        maincontainer.innerHTML = "";
        searching(search,maincontainer);
    });
    let pokearray = [];
    pokearray = await getPokemons();

    rendering(pokearray,maincontainer);

    try {
    
        const maker = await makingbuttons();
        maker.forEach(e => {
            const button = document.createElement('button');
            button.innerHTML = formatText(e);
            button.className = "button";
            button.style.setProperty('background-color', `var(--background-${e})`);
            button.style.setProperty('color', `var(--font-color-${e})`);

            button.addEventListener('click', async (event) => {
                const type = event.target.textContent.toLowerCase();

                maincontainer.innerHTML = "";
                render(type,maincontainer);

            });

            menu.appendChild(button);
        });


    } catch (error) {
        console.error("Error al inicializar la aplicación:", error);
    }
});

