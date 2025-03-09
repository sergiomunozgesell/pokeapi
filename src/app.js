import PokeService from './pokeService.js'


class App{

    constructor(){
        this.init()
    }


    async init(){

        const root = document.getElementById('root')

        let mainContainer = document.createElement('div');
        mainContainer.innerHTML = 
        `
        <div class='pokecard'>
            <h1>HOLA SOY UNA POKECARD DE EJEMPLO</h1>
        </div>
        `

        root.appendChild(mainContainer);       

        let pokemones = await PokeService.getpokemons();
        console.log(pokemones);
        
        
        if(pokemones){
            
            console.log("Se obtuvieron los pokemones con éxito:....");
            console.log(pokemones);
        
        }
        
        PokeService.renderPokemons(pokemones,mainContainer);
        
        



    }

}


export default new App();