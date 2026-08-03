const fetch = require('node-fetch'); // veya standart fetch (Node 18+)
const fs = require('fs');

async function tumOyunculariCek() {
    let oyuncuListesi = [];
    
    // 44'ten başla, istediğin son ID'ye kadar (örneğin 2000 oyuncu için)
    let baslangicId = 01;
    let bitisId = 2000; // Test için 200'den başlatabilirsin, sonra artırabilirsin

    console.log("Oyuncular API'den çekiliyor, lütfen bekleyin...");

    for (let id = baslangicId; id <= bitisId; id++) {
        try {
            const response = await urlCek(`http://api.football-data.org/v4/persons/${id}`);
            if (response && response.name) {
                let oyuncu = {
                    isim: response.name,
                    uyruk: response.nationality || "Bilinmiyor",
                    takim: response.currentTeam ? response.currentTeam.name : "Kulüpsüz",
                    mevki: response.position || "Bilinmiyor",
                    yas: yasHesapla(response.dateOfBirth)
                };
                oyuncuListesi.push(oyuncu);
                console.log(`[Eklendi]: ${oyuncu.isim}`);
            }
        } catch (e) {
            // Bulunamayan ID'leri atla
        }
        // API sınırına takılmamak için minik bir bekleme ekleyebilirsin
        await new Promise(resolve => setTimeout(resolve, 200));
    }

    // Çekilen verileri JSON dosyasına kaydet
    fs.writeFileSync('oyuncular.json', JSON.stringify(oyuncuListesi, null, 2), 'utf-8');
    console.log("İşlem tamam! oyuncular.json dosyası oluşturuldu.");
}

function yasHesapla(dogumTarihi) {
    if (!dogumTarihi) return 25;
    let yil = new Date(dogumTarihi).getFullYear();
    return new Date().getFullYear() - yil;
}
