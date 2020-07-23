let filteredPeoples = [];
let allPeoples = [];

let inputName = null;
let btnSearch = null;

let totalFilteredPeoples = 0;
let searchResults = null;

let tabStatistic = null;
let tabResultSearch = null

let checkInput = false;

let numberFormat = null
let loading = null;


function start() {

    inputName = document.querySelector('#search-peoples');
    btnSearch = document.querySelector('.btn-search');
    totalFilteredPeoples = document.querySelector('.search-count');
    searchResults = document.querySelector('.results');
    tabStatistic = document.querySelector('.tab-statistic');
    tabResultSearch = document.querySelector('.results');
    loading = document.querySelector('.progress');

    numberFormat = Intl.NumberFormat('pt-BR');

    // "Loading"
    setTimeout(() => {
        fetchPeoples();
        activeInput();
    }, 2000);

}

async function fetchPeoples() {

    const peoples = await fetch('https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo');
    const peoplesJson = await peoples.json();

    allPeoples = peoplesJson.results.map(({ name, picture, dob, gender }) => {
        return {
            name: name.first + ' ' + name.last,
            picture: picture.large,
            age: dob.age,
            gender: gender
        };
    });
}


function activeInput() {
    loading.classList.add('hide');
    inputName.disabled = false;
    inputName.focus();

    inputName.addEventListener('keyup', (e) => {
        checkInput = inputName.value.length > 0;
        btnSearch.disabled = !checkInput;
        if (e.key === 'Enter') filterName(inputName.value);
    });

    btnSearch.addEventListener('click', () => filterName(inputName.value));
}



function filterName(name) {

    if (!name.length) {
        return;
    }

    filteredPeoples = allPeoples.filter(people => people.name.toLowerCase().includes(name.toLowerCase()));
    filteredPeoples.sort((a, b) => a.name.localeCompare(b.name));

    renderFilteredPeoples();
}


function renderFilteredPeoples() {
    let peoplesHTML = '<ul>';


    filteredPeoples.forEach(({ name, picture, age }) => {
        const peopleHTML = `
        <li>
            <div class="card z-depth-1">
                <img src="${picture}" alt="${name}" class="circle">
                <label class="name-age">${name}, ${age} anos</label>                
            </div>
        </li>
        `;


        peoplesHTML += peopleHTML;
    });
    peoplesHTML += '</ul>'

    tabResultSearch.innerHTML = peoplesHTML;
    renderStatistic();
}

function renderStatistic() {

    const allFiltered = filteredPeoples.length;

    let female = 0;
    const male = filteredPeoples.reduce((acc, curr) => {
        if (curr.gender === 'male') return acc += 1;
        female += 1;
        return acc;
    }, 0);

    const allAges = filteredPeoples.reduce((acc, curr) => acc + curr.age, 0);

    let averageAge = (allAges / allFiltered).toFixed(2);

    averageAge = (averageAge > 0) ? averageAge : 0;



    totalFilteredPeoples.innerHTML = `${allFiltered} usuário(s) encontrado(s)`;

    tabStatistic.innerHTML = `
        <div class = "tab-st">
            <h2>Estatísticas</h2>
            <p>Sexo masculino: <strong>${formatNumber(male)}</strong></p>
            <p>Sexo feminino: <strong>${formatNumber(female)}</strong></p>
            <p>Soma das idades: <strong>${formatNumber(allAges)}</strong></p>
            <p>Média das idades: <strong>${formatNumber(averageAge)}</strong></p>
        </div>
    `;
}

function formatNumber(number) {
    return numberFormat.format(number);
}

start();
