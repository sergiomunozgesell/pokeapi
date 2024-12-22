async function getPokemons() {
    
    try {
        
        pokes = [];
    
        await fetch('https://pokeapi.co/api/v2/pokemon?limit=10000&offset=0')
        .then(response => response.json())
        /**then 1 */
        .then( async data =>  
    
            {
                pok = data.results            
                
    
                /** FETCH POKEMONS  DATA */
                return pokes = await Promise.all(pok.map(async e => await fetch(e.url)
                .then(res=> res.json())
                .then(async d => {
    
    
    
                    /** EN CASO DE QUERER TRABABAR CON OBJETOS */
                    //////////////////
                    //////////////////
                    // const weakness = await Promise.all(
                    //     d.types.map(async e => {
                    //         return await fetch(e.type.url)
                    //             .then(res => res.json())
                    //             .then(data => {
                    //                 // Construimos el objeto de debilidades con reduce
                    //                 return data.damage_relations.double_damage_from.reduce((acc, type) => {
                    //                     acc[type.name] = type.name;
                    //                     return acc;
                    //                 }, {});
                    //             });
                    //     })
                    // );
    
                    // // Combinamos las debilidades en un solo objeto
                    // const combinedWeakness = weakness.reduce((acc, current) => {
                    //     return { ...acc, ...current };
                    // }, {});
                    ///////////////////////////////////////////////////////////////////
                    

                    const weakness = await Promise.all(
                        d.types.map(async type => {
                            return await fetch(type.type.url)
                                .then(res => res.json())
                                .then(data => {
                                    return data.damage_relations.double_damage_from.map(type => type.name);
                                });
                        })
                    );

                    const combinedWeakness = [...new Set(weakness.flat())];

                    const strongAgainst= await Promise.all(
                        d.types.map(async type => {
                            return await fetch(type.type.url)
                                .then(res => res.json())
                                .then(data => {
                                    
                                    return data.damage_relations.double_damage_to.map(type => type.name);
                                });
                        })
                    );

                    const combinedStrong = [...new Set(strongAgainst.flat())];
                    
                    const object = 
                    {
                        id:d.id,
                        name:d.name,
                        weight:d.weight,
                        height:d.height,
                        picture:d.sprites.other['official-artwork'].front_default,
                        type:d.types,
                        weakness:combinedWeakness,
                        strongAgainst:combinedStrong
    
                    }


                    return object;
    
                })
                /** FETCH POKEMONS  DATA */
    
    
            ))
            
    
            }
        )
        /**then 1 */
        return pokes;

    } catch (error) {
        return console.log(`Error al cargar los recursos de la pokeapi... ${error}`);        
    }

}

function formatText(text){
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    /* charAt, toma un caracter dependiendo del indice que se le indica 
       toUpperCase, convierte el texto al cual aplica la función en mayúsculas
       slice, toma la cadena desde el valor que se indica
       toLowerCase, al contrario de upper, este convierte en minusculas todos los carácteres*/

}

async function makingbuttons() {
    
    let types = [];

    await fetch("https://pokeapi.co/api/v2/type/")
    .then(res => res.json())
    .then(data => {
            types = data.results.map(e => e.name);
            console.log(types);
         })
    .catch(error => console.log(`ERror en la obtención de la data .... ${error}`));

    return types;

}


document.addEventListener('DOMContentLoaded',async () =>{
    const menu = document.getElementById('menu');
    let maincontainer = document.getElementById('maincontainer');
    
    let maker = await makingbuttons();
    maker.forEach(e => {

        const button = document.createElement('button');
        button.innerHTML = e;
        button.className = "button"
        button.style.setProperty('background-color', `var(--background-${e})`);
        button.style.setProperty('color',`var(--font-color-${e})`);

        //Añadir evento a los botones.
        button.addEventListener('click', async e =>{
            console.log(e.target.textContent);
            type = e.target.textContent;

            console.log(`Parametro a recibir por boton :.... ${type}`)
            //PENDIENTE, se elimina el contenido
            // maincontainer.innerHTML = " ";

            //Función que va hacer el renderizado nuevamente de los pokemons
            // await render(type, container);
        })
        menu.appendChild(button);
    }
    )

    let pokes = [];

    pokes = await getPokemons();

    pokes.forEach(element => {


        types = element.type.map(e=> {
            return e.type.name;
        })

        

        let card = document.createElement('div');
        card.className = "Card"+ " " +types[0];
        

        /* PROFILE POKEMON */
        let card_pokeprofile = document.createElement('div');
        card_pokeprofile.className = "card-poke-profile";
        card.style.setProperty('background-color',`var(--background-${types[0]})`);
        card.style.setProperty('color',`var(--font-color-${types[0]})`);

        let tittle_card = document.createElement('h1');
        tittle_card.innerHTML = formatText(element.name);

        let pokeimage = document.createElement('img');
        pokeimage.className = "poke-image";
        pokeimage.src = element.picture;
        /* PROFILE POKEMON */

        /** CARD STATS */
        
        let card_pokestats = document.createElement('div');
        card_pokestats.className = "card-poke-stats";

        let altura =document.createElement('p'); 
        altura.innerHTML = (element.height / 10) + " M";

        let peso = document.createElement('p');
        peso.innerHTML = element.weight+ " LB";

        let tipo = document.createElement('ul');
        tipo.className = "poke-list-type"
        /**ASIGNAR ETIQUETA */
        // tipo.innerHTML = types.map(e=> `<li class="poke-list-element tag" >${e}</li>`).join("");
        /**ESTABLECER CUSTOM PROPERTIES DINAMICAMENTE */
        types.forEach(e => {
            let li = document.createElement('li');
            li.className = "poke-list-element tag";
            li.textContent = e;
        
            // Establecer estilos dinámicos con custom properties
            li.style.setProperty('background-color', `var(--background-${e})`);
            li.style.setProperty('color', `var(--font-color-${e})`);
        
            tipo.appendChild(li);
        });

        let weakagainst = document.createElement('ul');
        weakagainst.className = "poke-list-weak";
        // weakagainst.innerHTML = element.weakness
        //     .map(e => `<li class="poke-list-weak-item ${e}">${formatText(e)}</li>`)
        //     .join("");

        element.weakness.forEach(e => {
            let list_item = document.createElement('li');
            list_item.className = "poke-list-element tag"
            list_item.textContent = e;

            list_item.style.setProperty('background-color', `var(--background-${e})`);
            list_item.style.setProperty('color', `var(--font-color-${e})`);

            weakagainst.appendChild(list_item);
        })

        let smart = document.createElement('ul');
        smart.className = "poke-list-doubleto";


        element.strongAgainst.forEach(e => {
            let item = document.createElement('li');
            item.className = "poke-list-element tag";
            item.textContent = e;
            item.style.setProperty('background-color', `var(--background-${e})`);
            item.style.setProperty('color', `var(--font-color-${e})`);
        
            smart.appendChild(item);
        })




        /** CARD STATS */

        
        maincontainer.appendChild(card);
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
)