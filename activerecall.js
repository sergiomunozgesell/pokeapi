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
         
        let tittle_card = document.createElement('h1');
        tittle_card.innerHTML = element.name;

        let pokeimage = document.createElement('img');
        pokeimage.src = element.picture;
        
        let peso = document.createElement('p');
        peso.innerHTML = element.weight+ " LB";
        
        maincontainer.appendChild(card);
        card.appendChild(pokeimage);
        card.appendChild(tittle_card);
        card.appendChild(peso);
    });

}
)