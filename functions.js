export async function getPokemons() {
    try {
        let pokes = []; // Usa let para variables locales
        await fetch('https://pokeapi.co/api/v2/pokemon?limit=1000&offset=0')
            .then(response => response.json())
            .then(async data => {
                const pok = data.results;

                pokes = await Promise.all(
                    pok.map(async e =>
                        fetch(e.url)
                            .then(res => res.json())
                            .then(async d => {
                                const weakness = await Promise.all(
                                    d.types.map(async type =>
                                        fetch(type.type.url)
                                            .then(res => res.json())
                                            .then(data => data.damage_relations.double_damage_from.map(t => t.name))
                                    )
                                );

                                const combinedWeakness = [...new Set(weakness.flat())];

                                const strongAgainst = await Promise.all(
                                    d.types.map(async type =>
                                        fetch(type.type.url)
                                            .then(res => res.json())
                                            .then(data => data.damage_relations.double_damage_to.map(t => t.name))
                                    )
                                );

                                const combinedStrong = [...new Set(strongAgainst.flat())];

                                return {
                                    id: d.id,
                                    name: d.name,
                                    weight: d.weight,
                                    height: d.height,
                                    picture: d.sprites.other['official-artwork'].front_default,
                                    type: d.types,
                                    weakness: combinedWeakness,
                                    strongAgainst: combinedStrong,
                                };
                            })
                    )
                );
            });
        return pokes;
    } catch (error) {
        console.log(`Error al cargar los recursos de la pokeapi: ${error}`);
        return [];
    }
}

export function rendering(pokearray,container){
        pokearray.forEach(element => {
        const types = element.type.map(e => e.type.name); // Declaración explícita de 'types'

        // Crear la tarjeta
        const card = document.createElement('div');
        card.className = `Card ${types[0]}`;
        card.style.setProperty('background-color', `var(--background-${types[0]})`);
        card.style.setProperty('color', `var(--font-color-${types[0]})`);

        // Perfil del Pokémon
        const card_pokeprofile = document.createElement('div');
        card_pokeprofile.className = "card-poke-profile";

        const tittle_card = document.createElement('h1');
        tittle_card.innerHTML = formatText(element.name);

        const pokeimage = document.createElement('img');
        pokeimage.className = "poke-image";
        pokeimage.src = element.picture;

        // Estadísticas del Pokémon
        const card_pokestats = document.createElement('div');
        card_pokestats.className = "card-poke-stats";

        const altura = document.createElement('p');
        altura.innerHTML = `${(element.height / 10)} M`;

        const peso = document.createElement('p');
        peso.innerHTML = `${element.weight} LB`;

        const tipo = document.createElement('ul');
        tipo.className = "poke-list-type";
        types.forEach(e => {
            const li = document.createElement('li');
            li.className = "poke-list-element tag";
            li.textContent = formatText(e);
            li.style.setProperty('background-color', `var(--background-${e})`);
            li.style.setProperty('color', `var(--font-color-${e})`);
            tipo.appendChild(li);
        });

        // Debilidades
        const weakagainst = document.createElement('ul');
        weakagainst.className = "poke-list-weak";
        element.weakness.forEach(e => {
            const list_item = document.createElement('li');
            list_item.className = "poke-list-element tag";
            list_item.textContent = formatText(e);
            list_item.style.setProperty('background-color', `var(--background-${e})`);
            list_item.style.setProperty('color', `var(--font-color-${e})`);
            weakagainst.appendChild(list_item);
        });

        // Ventajas
        const smart = document.createElement('ul');
        smart.className = "poke-list-doubleto";
        element.strongAgainst.forEach(e => {
            const item = document.createElement('li');
            item.className = "poke-list-element tag";
            item.textContent = formatText(e);
            item.style.setProperty('background-color', `var(--background-${e})`);
            item.style.setProperty('color', `var(--font-color-${e})`);
            smart.appendChild(item);
        });

        // Agregar elementos al DOM
        container.appendChild(card);
        card.appendChild(card_pokeprofile);
        card.appendChild(card_pokestats);
        card_pokeprofile.appendChild(pokeimage);
        card_pokeprofile.appendChild(tittle_card);
        card_pokestats.appendChild(altura);
        card_pokestats.appendChild(peso);
        card_pokestats.appendChild(tipo);
        card_pokestats.appendChild(weakagainst);
        card_pokestats.appendChild(smart);
    });


}

export function formatText(text){
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    /* charAt, toma un caracter dependiendo del indice que se le indica 
       toUpperCase, convierte el texto al cual aplica la función en mayúsculas
       slice, toma la cadena desde el valor que se indica
       toLowerCase, al contrario de upper, este convierte en minusculas todos los carácteres*/

}

export async function makingbuttons() {
    

    try {

        let types = [];

        await fetch("https://pokeapi.co/api/v2/type/")
        .then(res => res.json())
        .then(data => {types = data.results.map(e => e.name)})
        .catch(error => console.log(`Error en la obtención de la data .... ${error}`));
    
        return types;
        
    } catch (error) {
        
        return console.log(`Error de ejecución..... ${error}`);
        

    }


}

export async function render(type,container) {

    
        let pokes = [];
        pokes = await getPokemons();

        if(type){


            let filteredpokes =[];
            filteredpokes = pokes.filter(p =>p.type.some(t =>  t.type.name == type.toLowerCase()));
            if(filteredpokes.length <= 0){
                let h1 = document.createElement('h1');
                h1.innerHTML = "No se encontraron pokemons del parametro correspondiente. Se procedera a renderizar listado completo"
                h1.style.textAlign = "center";
                h1.style.color ="red";
                container.appendChild(h1);
                rendering(pokes,container);

            }
            rendering(filteredpokes,container);
        }

}