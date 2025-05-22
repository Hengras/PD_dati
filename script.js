// Funkcijas, lai pārslēgtos starp formām
function showForm1() {
    document.getElementById('form1').style.display = 'block';
    document.getElementById('form2').style.display = 'none';
    document.getElementById('form3').style.display = 'none';
    // Noņemam aktīvo klasi no filtru pogām, ja atgriežamies no formas3
    const filterButtons = document.querySelectorAll('.filter-button');
    filterButtons.forEach(btn => btn.classList.remove('active'));
    document.getElementById('showAll').classList.add('active'); // Atjaunojam "Rādīt visu" kā aktīvu
}

function showLoginForm() {
    document.getElementById('form1').style.display = 'none';
    document.getElementById('form2').style.display = 'block';
    document.getElementById('form3').style.display = 'none';
}

async function showPublicData() {
    document.getElementById('form1').style.display = 'none';
    document.getElementById('form2').style.display = 'none';
    document.getElementById('form3').style.display = 'block';
    // Ielādējam datus, kad tiek atvērta publiskā datubāze
    await loadData();
    // Pārliecināmies, ka "Rādīt visu" poga ir aktīva, kad atver publisko datubāzi
    const filterButtons = document.querySelectorAll('.filter-button');
    filterButtons.forEach(btn => btn.classList.remove('active'));
    document.getElementById('showAll').classList.add('active');
}

let allData = []; // Mainīgais visiem ielādētajiem datiem

async function loadData() {
    if (allData.length > 0) { // Ja dati jau ir ielādēti, nerādām vēlreiz
        renderTable(allData);
        return;
    }

    try {
        const inventarsResponse = await fetch('inventars.json');
        const inventarsData = await inventarsResponse.json();

        const vielasResponse = await fetch('vielas.json');
        const vielasData = await vielasResponse.json();

        // Pievienojam 'isInventars' lauku inventāra datiem, lai viegli filtrētu
        const processedInventarsData = inventarsData.map(item => ({ ...item, isInventars: true }));

        allData = [...processedInventarsData, ...vielasData]; // Apvienojam visus datus
        renderTable(allData); // Sākumā rādām visus datus

        // Pievienojam notikumu klausītājus filtru pogām
        document.getElementById('showAll').addEventListener('click', () => {
            renderTable(allData);
            setActiveButton('showAll');
        });

        document.getElementById('showVielas').addEventListener('click', () => {
            const vielas = allData.filter(item => item.tips === 'reaģents');
            renderTable(vielas);
            setActiveButton('showVielas');
        });

        document.getElementById('showEquipment').addEventListener('click', () => {
            const equipment = allData.filter(item => item.isInventars);
            renderTable(equipment);
            setActiveButton('showEquipment');
        });

    } catch (error) {
        console.error('Kļūda datu ielādē:', error);
        // Var pievienot kļūdas ziņojumu lietotājam
        document.querySelector('#dataTable tbody').innerHTML = '<tr><td colspan="8">Neizdevās ielādēt datus. Lūdzu, mēģiniet vēlreiz.</td></tr>';
    }
}

function renderTable(dataToDisplay) {
    const tableBody = document.querySelector('#dataTable tbody');
    tableBody.innerHTML = ''; // Notīra esošos datus

    if (dataToDisplay.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="8">Nav atrasti ieraksti, kas atbilst atlasei.</td></tr>';
        return;
    }

    dataToDisplay.forEach(item => {
        const row = tableBody.insertRow();
        row.insertCell().textContent = item.id;
        row.insertCell().textContent = item.nosaukums;
        row.insertCell().textContent = item.isInventars ? item.tips : item.tips;
        row.insertCell().textContent = item.apakstips;
        row.insertCell().textContent = item.skaits;
        // Daudzums/Svars kolonna (rādām tikai, ja ir definēts)
        row.insertCell().textContent = item.daudzums !== undefined ? item.daudzums : '';
        // Mērvienības kolonna (rādām tikai, ja ir definēts)
        row.insertCell().textContent = item.mervienibas !== undefined ? item.mervienibas : '';
        row.insertCell().textContent = item.komentari;
    });
}

// Funkcija, kas iestata aktīvo pogu un noņem aktīvo no citām
function setActiveButton(activeButtonId) {
    const filterButtons = document.querySelectorAll('.filter-button');
    filterButtons.forEach(btn => btn.classList.remove('active'));
    document.getElementById(activeButtonId).classList.add('active');
}


// Sākumā rādām pirmo formu, kad lapa ir ielādēta
document.addEventListener('DOMContentLoaded', showForm1);
