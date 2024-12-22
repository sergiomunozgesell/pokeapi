import { render,getPokemons,rendering, formatText, makingbuttons } from "./functions.js";

document.addEventListener('DOMContentLoaded', async () => {
    const menu = document.getElementById('menu');
    const maincontainer = document.getElementById('maincontainer');

    let pokearray = [];
    pokearray = await getPokemons();

    rendering(pokearray,maincontainer);

    try {
        // Crear botones dinámicamente
        const maker = await makingbuttons();
        maker.forEach(e => {
            const button = document.createElement('button');
            button.innerHTML = formatText(e); // Formatea el texto
            button.className = "button";
            button.style.setProperty('background-color', `var(--background-${e})`);
            button.style.setProperty('color', `var(--font-color-${e})`);

            button.addEventListener('click', async (event) => {
                const type = event.target.textContent.toLowerCase(); // Declaración explícita de 'type'

                maincontainer.innerHTML = "";
                render(type,maincontainer);

            });

            menu.appendChild(button);
        });


    } catch (error) {
        console.error("Error al inicializar la aplicación:", error);
    }
});

