const searchInput = document.getElementById('searchInput');
const guessBtn = document.getElementById('guessBtn');
const guessesContainer = document.getElementById('guessesContainer');
const suggestionsBox = document.getElementById('suggestions');

const API_KEY = '753d1ad74emsh107065bce84f45bp1970bbjsn24d5c1bcb4bd';
const API_HOST = 'sofasport.p.rapidapi.com';

let gizliFutbolcu = {
    isim: "Marco Asensio",
    uyruk: "Spain",
    takim: "Fenerbahçe",
    mevki: "Midfielder"
};

let secilenOyuncuAdi = "";

// Arama kutusuna yazıldığında API'den veri çekme denemesi
searchInput.addEventListener('input', async () => {
    let query = searchInput.value.trim();
    suggestionsBox.innerHTML = '';

    if (query.length < 2) return;

    const url = `https://sofasport.p.rapidapi.com/v1/players/search?q=${encodeURIComponent(query)}`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-host': API_HOST,
            'x-rapidapi-key': API_KEY
        }
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();

        if (data && data.results && data.results.length > 0) {
            data.results.forEach(item => {
                let p = item.player;
                const div = document.createElement('div');
                div.className = 'suggestion-item';
                div.innerText = `${p.name} (${p.team ? p.team.name : 'Kulüpsüz'})`;
                
                div.addEventListener('click', () => {
                    searchInput.value = p.name;
                    secilenOyuncuAdi = p.name;
                    suggestionsBox.innerHTML = '';
                });

                suggestionsBox.appendChild(div);
            });
        } else {
            // API yanıt vermezse veya sonuç bulamazsa kullanıcı manuel yazıp tahmin edebilsin
            let div = document.createElement('div');
            div.className = 'suggestion-item';
            div.innerText = "Sonuç bulunamadı, direkt yazıp deneyebilirsin.";
            suggestionsBox.appendChild(div);
        }
    } catch (error) {
        console.error("Arama bağlantı hatası:", error);
    }
});

guessBtn.addEventListener('click', () => {
    let girilenIsim = searchInput.value.trim();
    if (!girilenIsim) {
        alert("Lütfen bir futbolcu adı girin!");
        return;
    }

    // Geçici kıyaslama testi (API detay verisi entegrasyonu tam oturana kadar akışı bozmaz)
    let uyrukDurum = girilenIsim.toLowerCase() === gizliFutbolcu.isim.toLowerCase() ? 'green' : 'red';
    let takimDurum = 'red';
    let mevkiDurum = 'red';

    createGuessRow(girilenIsim, uyrukDurum, 'red', takimDurum, mevkiDurum, 'red');
    searchInput.value = '';
    suggestionsBox.innerHTML = '';
});

function createGuessRow(name, uyruk, lig, takim, mevki, yas) {
    const row = document.createElement('div');
    row.className = 'guess-row';

    row.innerHTML = `
        <div class="box">${name}</div>
        <div class="box ${uyruk}">Uyruk</div>
        <div class="box ${lig}">Lig</div>
        <div class="box ${takim}">Takım</div>
        <div class="box ${mevki}">Mevki</div>
        <div class="box ${yas}">Yaş</div>
    `;

    guessesContainer.prepend(row);
}
