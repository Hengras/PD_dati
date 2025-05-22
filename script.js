// Функции для переключения между формами
function showForm1() {
    document.getElementById('form1').style.display = 'block';
    document.getElementById('form2').style.display = 'none';
    document.getElementById('form3').style.display = 'none';
}

function showLoginForm() {
    document.getElementById('form1').style.display = 'none';
    document.getElementById('form2').style.display = 'block';
    document.getElementById('form3').style.display = 'none';
}

function showPublicData() {
    document.getElementById('form1').style.display = 'none';
    document.getElementById('form2').style.display = 'none';
    document.getElementById('form3').style.display = 'block';
    // Загрузка и отображение данных для публичной базы данных
    loadData();
}

// Ваш JavaScript код для загрузки и фильтрации данных
// ... (скопируйте сюда код из предыдущего ответа) ...

// Пример: Использование fetch() для загрузки JSON
async function loadData() {
    try {
        const inventarsResponse = await fetch('inventars.json');
        const inventarsData = await inventarsResponse.json();

        const vielasResponse = await fetch('vielas.json');
        const vielasData = await vielasResponse.json();

        const processedInventarsData = inventarsData.map(item => ({ ...item, isInventars: true }));

        const allData = [...processedInventarsData, ...vielasData];
        renderTable(allData);

        // Добавление обработчиков событий для кнопок фильтрации
        document.getElementById('showAll').addEventListener('click', () => {
            renderTable(allData);
        });

        document.getElementById('showVielas').addEventListener('click', () => {
            const vielas = allData.filter(item => item.tips === 'reaģents');
            renderTable(vielas);
        });

        document.getElementById('showEquipment').addEventListener('click', () => {
            const equipment = allData.filter(item => item.isInventars);
            renderTable(equipment);
        });

    } catch (error) {
        console.error('Kļūda datu ielādē:', error);
    }
}

// Инициализация: показать первую форму при загрузке страницы
document.addEventListener('DOMContentLoaded', showForm1);
