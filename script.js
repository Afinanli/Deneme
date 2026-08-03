// Arayüzdeki elementleri seçiyoruz
const searchInput = document.getElementById('searchInput');
const guessBtn = document.getElementById('guessBtn');
const guessesContainer = document.getElementById('guessesContainer');

// SENİN SOFASCORE API BİLGİLERİN
const API_KEY = '753d1ad74emsh107065bce84f45bp1970bbjsn24d5c1bcb4bd';
const API_HOST = 'sofasport.p.rapidapi.com';

// Futbolcu ID'sine göre verilerini çeken ana fonksiyon
async function getPlayerData(playerId) {
    const url = `https://sofasport.p.rapidapi.com/v1/players/data?player_id=${playerId}`;
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-rapidapi-host': API_HOST,
            'x-rapidapi-key': API_KEY
        }
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        console.log("Sofascore'dan Gelen Veri:", data);
        return data;
    } catch (error) {
        console.error("API Bağlantı Hatası:", error);
    }
}

// Butona tıklandığında çalışacak test fonksiyonu
guessBtn.addEventListener('click', async () => {
    let playerName = searchInput.value;
    
    if(playerName === "") {
        alert("Lütfen bir futbolcu adı yazın!");
        return;
    }

    // ŞİMDİLİK TEST İÇİN: 12994 numaralı örnek ID'yi kullanıyoruz.
    // İleride arama kutusuna yazılan ismin ID'sini bulup buraya vereceğiz.
    let playerData = await getPlayerData(12994);
    
    // Ekrana rastgele bir deneme satırı ekleyelim (Test amaçlı)
    createGuessRow(playerName, "Kırmızı", "Yeşil", "Yeşil", "Kırmızı", "Yeşil");
});

// Arayüze kutucukları ekleyen fonksiyon
function createGuessRow(name, uyrukDurum, ligDurum, takimDurum, mevkiDurum, yasDurum) {
    const row = document.createElement('div');
    row.className = 'guess-row';

    // Durumlara göre CSS sınıflarını (yeşil/kırmızı) belirliyoruz
    row.innerHTML = `
        <div class="box">${name}</div>
        <div class="box ${uyrukDurum === 'Yeşil' ? 'green' : 'red'}">Uyruk</div>
        <div class="box ${ligDurum === 'Yeşil' ? 'green' : 'red'}">Lig</div>
        <div class="box ${takimDurum === 'Yeşil' ? 'green' : 'red'}">Takım</div>
        <div class="box ${mevkiDurum === 'Yeşil' ? 'green' : 'red'}">Mevki</div>
        <div class="box ${yasDurum === 'Yeşil' ? 'green' : 'red'}">Yaş</div>
    `;

    guessesContainer.prepend(row); // Yeni tahmini en başa ekler
}

