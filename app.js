async function getPokemons() {
    
    try {
        
        pokes = [];
    
        await fetch('https://pokeapi.co/api/v2/pokemon/')
        .then(response => response.json())
        /**then 1 */
        .then( async data =>  
    
            {
                pok = data.results            
                
    
                /** FETCH POKEMONS  DATA */
                return pokes = await Promise.all(pok.map(async e => await fetch(e.url)
                .then(res=> res.json())
                .then(async d => {
    
    
    
    
                    const weakness = await Promise.all(
                        d.types.map(async e => {
                            return await fetch(e.type.url)
                                .then(res => res.json())
                                .then(data => {
                                    // Construimos el objeto de debilidades con reduce
                                    return data.damage_relations.double_damage_from.reduce((acc, type) => {
                                        acc[type.name] = type.name;
                                        return acc;
                                    }, {});
                                });
                        })
                    );
    
                    // Combinamos las debilidades en un solo objeto
                    const combinedWeakness = weakness.reduce((acc, current) => {
                        return { ...acc, ...current };
                    }, {});
    
    
                    // const weakness = await Promise.all(d.types.map(async e =>
                    //     {
                    //         await fetch(e.type.url)
                    //         .then(res=> res.json())
                    //         .then(data => {
                                
                    //             console.log(data.damage_relations.double_damage_from)
                    //             return data.damage_relations.double_damage_from.reduce((acc,type)=>{
                    //                 {
                    //                     acc[type.name] = true;
                    //                     return acc;
                    //                 }
                    //             }, {})
                                
                    //         })
                    // })) 
    
                    // d.types.map(async e =>{
                    //     console.log(e.type.url)
                    // });
                     
    
                    const object = 
                    {
                        name:d.name,
                        weight:d.weight,
                        height:d.height,
                        picture:d.sprites.other['official-artwork'].front_default,
                        type:d.types,
                        weakness:combinedWeakness
    
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

document.addEventListener('DOMContentLoaded',async () =>{
    
    const maincontainer = document.getElementById('maincontainer');
    let cont = 0;
    pokes = [];

    pokes = await getPokemons();

    pokes.forEach(element => {
        console.log(cont);
        console.log(element.name);
        cont++

        types = element.type.map(e=> {
            return e.type.name;
        })

        console.log(types)

        let card = document.createElement('div');
        card.className = "Card"+ " " +types[0];
        

        /* PROFILE POKEMON */
        let card_pokeprofile = document.createElement('div');
        card_pokeprofile.className = "card-poke-profile"

        let tittle_card = document.createElement('h1');
        tittle_card.innerHTML = formatText(element.name);

        let pokeimage = document.createElement('img');
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
        tipo.innerHTML = types.map(e=> `<li>${e}</li>`).join("");
        /** CARD STATS */

        
        maincontainer.appendChild(card);
        card.appendChild(card_pokeprofile);
        card.appendChild(card_pokestats);
        card_pokeprofile.appendChild(pokeimage);
        card_pokeprofile.appendChild(tittle_card);
        card_pokestats.appendChild(altura);
        card_pokestats.appendChild(peso);
        card_pokestats.appendChild(tipo);
    });

}
)