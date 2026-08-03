const searchInput = document.getElementById('searchInput');
const guessBtn = document.getElementById('guessBtn');
const guessesContainer = document.getElementById('guessesContainer');

// SENİN SOFASCORE API BİLGİLERİN
const API_KEY = '753d1ad74emsh107065bce84f45bp1970bbjsn24d5c1bcb4bd';
const API_HOST = 'sofasport.p.rapidapi.com';

// Günün Gizli Futbolcusu (Örn: Mauro Icardi - API'deki verilerine göre)
const gizliFutbolcu = {
    isim: "Mauro Icardi",
    uyruk: "Argentina",
    takim: "Galatasaray",
    mevki: "Forward"
};

// 1. Oyuncu ismini API'de aratıp ID'sini bulan fonksiyon
async function oyuncuAra(isim) {
    const url = `https://sofasport.p.rapidapi.com/v1/players/search?q=${encodeURIComponent(isim)}`;
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
        
        // Eğer aranan isim bulunduysa ilk eşleşen oyuncunun ID'sini döndür
        if (data && data.results && data.results.length > 0) {
            return data.results[0].player.id;
        }
        return null;
    } catch (error) {
        console.error("Arama Hatası:", error);
        return null;
    }
}

// 2. Oyuncu ID'si ile detaylı verilerini çeken fonksiyon
async function oyuncuDetayiCek(playerId) {
    const url = `https://sofasport.p.rapidapi.com/v1/players/data?player_id=${playerId}`;
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
        return data;
    } catch (error) {
        console.error("Detay Çekme Hatası:", error);
        return null;
    }
}

// Tahmin Et butonuna basıldığında
guessBtn.addEventListener('click', async () => {
    let girilenIsim = searchInput.value.trim();
    if (!girilenIsim) {
        alert("Lütfen bir futbolcu adı yazın!");
        return;
    }

    guessBtn.innerText = "Aranıyor...";
    
    // Önce ismi API'de aratıp ID alıyoruz
    let playerId = await oyuncuAra(girilenIsim);
    
    if (!playerId) {
        alert("Böyle bir futbolcu bulunamadı! İsmi İngilizce karakterlerle veya tam yazmayı dene.");
        guessBtn.innerText = "Tahmin Et";
        return;
    }

    // Bulunan ID ile oyuncunun gerçek verilerini çekiyoruz
    let playerData = await oyuncuDetayiCek(playerId);
    guessBtn.innerText = "Tahmin Et";

    if (!playerData || !playerData.player) {
        alert("Oyuncu verileri alınamadı.");
        return;
    }

    let p = playerData.player;
    let gelenIsim = p.name || girilenIsim;
    let gelenUyruk = p.country ? p.country.name : "Bilinmiyor";
    let gelenTakim = p.team ? p.team.name : "Bilinmiyor";
    let gelenMevki = p.position || "Bilinmiyor";

    // Gizli futbolcu ile kıyaslama (Doğruysa yeşil, yanlışsa kırmızı)
    let uyrukDurum = gelenUyruk.toLowerCase() === gizliFutbolcu.uyruk.toLowerCase() ? 'green' : 'red';
    let takimDurum = gelenTakim.toLowerCase() === gizliFutbolcu.takim.toLowerCase() ? 'green' : 'red';
    let mevkiDurum = gelenMevki.toLowerCase() === gizliFutbolcu.mevki.toLowerCase() ? 'green' : 'red';

    // Arayüze satırı ekle (Lig ve Yaş alanlarını da API verine göre genişletebiliriz)
    createGuessRow(gelenIsim, uyrukDurum, 'red', takimDurum, mevkiDurum, 'red');

    // Bildiyse tebrik et
    if (gelenIsim.toLowerCase() === gizliFutbolcu.isim.toLowerCase()) {
        setTimeout(() => alert("Tebrikler! Gizli futbolcuyu bildin! 🎉"), 100);
    }

    searchInput.value = "";
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

