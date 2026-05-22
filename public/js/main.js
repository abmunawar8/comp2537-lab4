console.log("js file loaded");

let currentOffset = 0;
const limit = 10;

async function loadPokemonGroup() {
    const button = document.getElementById('loadMoreButton');
    const spinner = document.getElementById('loadingSpinner');
    const container = document.getElementById('pokemonList');

    button.classList.add('d-none');
    spinner.classList.remove('d-none');

    await new Promise(resolve => setTimeout(resolve, 1500));

    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${currentOffset}&limit=${limit}`);
    const listData = await response.json();

    const detailPromises = listData.results.map(p => fetch(p.url).then(res => res.json()));
    const pokemonDetails = await Promise.all(detailPromises);

    pokemonDetails.forEach(pokemon => {
        const name = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
        const imgUrl = pokemon.sprites.other['official-artwork'].front_default;

        const hp = pokemon.stats.find(s => s.stat.name === 'hp').base_stat;
        const attack = pokemon.stats.find(s => s.stat.name === 'attack').base_stat;
        const defense = pokemon.stats.find(s => s.stat.name === 'defense').base_stat;
        const type = pokemon.types.map(t => t.type.name).join(' / ').toUpperCase();

        const cardHTML = `
            <div class="col-12 col-md-6 col-lg-4">
                <div class="card pokemon-card p-3 h-100">
                    <h3 class="card-title text-center mb-3">${name}</h3>
                    <div class="hovereffect rounded">
                        <img src="${imgUrl}" class="img-fluid" alt="${name}">
                        <div class="overlay d-flex flex-column justify-content-center align-items-center">
                            <div class="pokemon-stats">
                                <h5 class="text-white mb-3 border-bottom pb-2">${type}</h5>
                                <p class="mb-1"><strong>HP:</strong> ${hp}</p>
                                <p class="mb-1"><strong>Attack:</strong> ${attack}</p>
                                <p class="mb-1"><strong>Defense:</strong> ${defense}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        container.insertAdjacentHTML('beforeend', cardHTML);
    });

    currentOffset += limit;
    spinner.classList.add('d-none');
    button.classList.remove('d-none');
}

document.getElementById('loadMoreButton').addEventListener('click', loadPokemonGroup);
document.addEventListener('DOMContentLoaded', loadPokemonGroup);