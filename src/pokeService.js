class PokeService{

    constructor(){
        this.url = 'https://pokeapi.co/api/v2/pokemon/'
    }


    async getpokemons( type){

        if(!type){

            let pokes = {};

            await fetch(`${this.url}`)
            .then(res => res.json())
            .then( async data => {
                let d = data.results;

                /*** */
                pokes = await Promise.all(d.map( async e => {
                    return await fetch(`${e.url}`)
                    .then(res => res.json())
                    .then(async d => {
                        
                        let abilities = d.abilities
                        
                        let types = d.types.map(e  => e.type.name);
                        
                                               
                        

                        return {
                            nombre: d.name,
                            sprite: d.sprites.other['official-artwork'].front_default,
                            type: types    
                        }
                    })
                } ))
                /*** */


                
            })
            .catch(err => {
                console.log(err)
                return [];
            });

            
            
            return pokes;



        }

    }


    async renderPokemons(pokearray,container){
        container.innerHTML = "";
        
        pokearray.forEach(e => {
        
            const card = document.createElement('div')
            card.className = `PokeCard ${e.nombre}`

            container.appendChild(card)
        
        
        });

        
    }

}


export default new PokeService;