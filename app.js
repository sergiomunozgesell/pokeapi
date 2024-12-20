
async function getpokemons() {

    let pokemons = [];


    await fetch('https://pokeapi.co/api/v2/pokemon/')
        .then(response => response.json())
        .then(async data => {
            pokes = data.results;

            pokemons = await Promise.all(pokes.map(async e => {

                return await fetch(e.url)
                    .then(r => r.json())
                    .then(data => {

                        const regis = {
                            name: data.name,
                            height: data.height,
                            type: data.types
                        }

                        return regis;
                    })

            }))

        })



    return pokemons
}

document.addEventListener('DOMContentLoaded', async () => {
    const maincontent = document.getElementById('maincontainer');
    pokes = await getpokemons();

    console.log(pokes)

    pokes.forEach(e => {

        tipos = e.type.map( e => e.type.name)
        console.log(e.name,e.height, tipos)

        let card = document.createElement('div');
        tittle = document.createElement('h1');
        tittle.innerHTML = e.name;

        maincontent.appendChild(card);
        card.appendChild(tittle)

        
    });
});