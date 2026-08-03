const searchInput = document.getElementById('searchInput');
const guessBtn = document.getElementById('guessBtn');
const guessesContainer = document.getElementById('guessesContainer');
const suggestionsBox = document.getElementById('suggestions');

// SENİN SOFASCORE API BİLGİLERİN
const API_KEY = '753d1ad74emsh107065bce84f45bp1970bbjsn24d5c1bcb4bd';
const API_HOST = 'sofasport.p.rapidapi.com';

// Günün Gizli Futbolcusu (Örn: Rastgele bir oyuncu ID'si ile veya sabit bir test oyuncusu)
// Şimdilik sistemin çalışmasını test etmek için gizli oyuncuyu sabitliyoruz, 
// sonra bunu API'den rastgele çektirebiliriz.
let gizliFutbolcu = {
    id: 12994, // Örnek ID (Örn: Asensio veya benzeri)
    isim: "Marco Asensio",
    uyruk: "Spain",
    takim: "Fenerbahçe",
    mevki: "Midfielder"
};

let secilenOyuncuId = null;

// 1. Kullanıcı yazdıkça Sofasport API'sinden canlı oyuncu listesi getiren fonksiyon
searchInput.addEventListener('input', async () => {
    let query = searchInput.value.trim();
    suggestionsBox.innerHTML = '';

    if (query.length < 2) return; // En az 2 harf yazınca arasın

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

        if (data && data.results) {
            // API'den gelen sonuçları altta listeleyelim
            data.results.forEach(item => {
                let p = item.player;
                const div = document.createElement('div');
                div.className = 'suggestion-item';
                div.innerText = `${p.name} (${p.team ? p.team.name : 'Takımsız'})`;
                
                // Listeden bir oyuncuya tıkladığında
                div.addEventListener('click', () => {
                    searchInput.value = p.name;
                    secilenOyuncuId = p.id; // Seçilen oyuncunun ID'sini hafızaya alıyoruz
                    suggestionsBox.innerHTML = '';
                });

                suggestionsBox.appendChild(div);
            });
        }
    } catch (error) {
        console.error("Canlı arama hatası:", error);
    }
});

// 2. Tahmin Et butonuna basıldığında seçilen oyuncunun detayını çek ve kıyasla
guessBtn.addEventListener('click', async () => {
    if (!secilenOyuncuId) {
        alert("Lütfen alttaki listeden bir oyuncu seçin!");
        return;
    }

    guessBtn.innerText = "Kontrol ediliyor...";

    const url = `https://sofasport.p.rapidapi.com/v1/players/data?player_id=${secilenOyuncuId}`;
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
        guessBtn.innerText = "Tahmin Et";

        if (!data || !data.player) {
            alert("Oyuncu bilgileri alınamadı.");
            return;
        }

        let p = data.player;
        let gelenIsim = p.name;
        let gelenUyruk = p.country ? p.country.name : "Bilinmiyor";
        let gelenTakim = p.team ? p.team.name : "Bilinmiyor";
        let gelenMevki = p.position || "Bilinmiyor";

        // Gizli futbolcu ile kıyaslama
        let uyrukDurum = gelenUyruk.toLowerCase() === gizliFutbolcu.uyruk.toLowerCase() ? 'green' : 'red';
        let takimDurum = gelenTakim.toLowerCase() === gizliFutbolcu.takim.toLowerCase() ? 'green' : 'red';
        let mevkiDurum = gelenMevki.toLowerCase() === gizliFutbolcu.mevki.toLowerCase() ? 'green' : 'red';

        // Ekrana yazdır
        createGuessRow(gelenIsim, uyrukDurum, 'red', takimDurum, mevkiDurum, 'red');

        // Sıfırla
        searchInput.value = '';
        secilenOyuncuId = null;

        if (gelenIsim.toLowerCase() === gizliFutbolcu.isim.toLowerCase()) {
            setTimeout(() => alert("Tebrikler! Gizli futbolcuyu bildin! 🎉"), 100);
        }

    } catch (error) {
        guessBtn.innerText = "Tahmin Et";
        console.error("Detay çekme hatası:", error);
    }
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
