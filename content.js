// Treści są generowane przez AI na podstawie promptów Vincenque (https://github.com/Vincenque)

function wstrzyknijPanelBoczny() {
    let znacznikCzasu;
    let naglowki;
    let naglowekOceny;
    let sekcja;
    let wszystkieRadia;
    let ostatnieRadio;
    let nazwaGrupyRadio;
    let wierszOstatniejOpcji;
    let autorskiPanelFiltrow;
    let poleRadio;
    let inneRadia;
    let przyciskUruchamiajacy;

    znacznikCzasu = new Date().toISOString();
    console.log(znacznikCzasu + " - Wstrzykiwanie własnego precyzyjnego zakresu do panelu ocen.");

    // Niezawodny punkt zaczepienia: szukamy wyłącznie nagłówka w panelu bocznym
    naglowki = Array.from(document.querySelectorAll("h3"));
    naglowekOceny = naglowki.find(naglowek => naglowek.innerText.includes("Ocena produktu"));
    
    if (!naglowekOceny) {
        console.log(znacznikCzasu + " - Brak sekcji ocen, przerywam wstrzykiwanie.");
        return;
    }

    // Szukamy kontenera, który zawiera opcje radio (wspinamy się w górę)
    sekcja = naglowekOceny.parentElement;
    while (sekcja && sekcja.tagName !== "BODY" && sekcja.querySelectorAll('input[type="radio"]').length === 0) {
        sekcja = sekcja.parentElement;
    }

    wszystkieRadia = sekcja.querySelectorAll('input[type="radio"]');
    ostatnieRadio = wszystkieRadia[wszystkieRadia.length - 1];
    nazwaGrupyRadio = ostatnieRadio ? ostatnieRadio.name : "ocena_produktu_radio";

    // Odnajdujemy bezpośredni wiersz (kontener) ostatniej opcji, aby wstawić nasz panel jako jego rodzeństwo
    wierszOstatniejOpcji = ostatnieRadio.parentElement;
    while (wierszOstatniejOpcji && wierszOstatniejOpcji.parentElement && wierszOstatniejOpcji.parentElement.querySelectorAll('input[type="radio"]').length === 1) {
        wierszOstatniejOpcji = wierszOstatniejOpcji.parentElement;
    }

    // Tworzymy nasz kontener z zachowaniem tagu i klas CSS oryginalnego wiersza (dla idealnego układu)
    autorskiPanelFiltrow = document.createElement(wierszOstatniejOpcji.tagName.toLowerCase());
    autorskiPanelFiltrow.className = wierszOstatniejOpcji.className; 
    autorskiPanelFiltrow.classList.add("precyzyjny-filtr-kontener");

    autorskiPanelFiltrow.innerHTML = `
        <div class="allegro-radio-wtyczka">
            <input type="radio" id="wlasny-zakres-radio" name="${nazwaGrupyRadio}" class="pole-wyboru-radio">
            <label for="wlasny-zakres-radio" class="etykieta-radio">Własny precyzyjny zakres</label>
        </div>
        <div id="szczegoly-filtru" class="szczegoly-ukryte" style="display: none;">
            <div class="sekcja-filtru">
                <input type="number" id="zakres-ocena-od" class="pole-wprowadzania" step="0.01" value="4.75" placeholder="Od (np. 4.75)">
                <input type="number" id="zakres-ocena-do" class="pole-wprowadzania" step="0.01" value="5.00" placeholder="Do (np. 4.95)">
            </div>
            <div class="sekcja-filtru">
                <div class="wiersz-opinii">
                    <input type="checkbox" id="weryfikuj-opinie" class="pole-wyboru">
                    <label for="weryfikuj-opinie" class="etykieta-opinii">Min. liczba opinii:</label>
                    <input type="number" id="wymagane-opinie" class="pole-wprowadzania pole-krotkie" value="30" placeholder="np. 30">
                </div>
            </div>
            <button id="uruchom-filtrowanie" class="przycisk-akcji">Zastosuj filtry</button>
        </div>
    `;

    // Wstawiamy DOKŁADNIE pod ostatnią opcją Allegro (z pominięciem appendChild i błędów z tym związanych)
    wierszOstatniejOpcji.insertAdjacentElement("afterend", autorskiPanelFiltrow);

    poleRadio = document.getElementById("wlasny-zakres-radio");
    poleRadio.addEventListener("change", function(zdarzenie) {
        document.getElementById("szczegoly-filtru").style.display = zdarzenie.target.checked ? "block" : "none";
    });

    // Nasłuchiwanie na oryginalne radia z TEJ KONKRETNEJ sekcji, aby chować nasz panel
    inneRadia = sekcja.querySelectorAll('input[type="radio"]:not(#wlasny-zakres-radio)');
    inneRadia.forEach(function(radio) {
        radio.addEventListener("change", function() {
            document.getElementById("szczegoly-filtru").style.display = "none";
        });
    });

    przyciskUruchamiajacy = document.getElementById("uruchom-filtrowanie");
    przyciskUruchamiajacy.addEventListener("click", function(zdarzenie) {
        zdarzenie.preventDefault();
        przetwarzajOferty();
    });
}

function przetwarzajOferty() {
    let znacznikCzasu;
    let ocenaOd;
    let ocenaDo;
    let liczbaOpinii;
    let sprawdzajOpinie;
    let oferty;
    let ofertyZOcenami;
    let elementOceny;
    let ariaLabel;
    let fragmenty;
    let tekstOcena;
    let tekstOpinie;
    let wartoscOceny;
    let wartoscOpinii;

    znacznikCzasu = new Date().toISOString();
    console.log(znacznikCzasu + " - Uruchomiono algorytm ukrywania ofert.");

    ocenaOd = parseFloat(document.getElementById("zakres-ocena-od").value.replace(",", ".")) || 0;
    ocenaDo = parseFloat(document.getElementById("zakres-ocena-do").value.replace(",", ".")) || 5;
    liczbaOpinii = parseInt(document.getElementById("wymagane-opinie").value) || 0;
    sprawdzajOpinie = document.getElementById("weryfikuj-opinie").checked;

    oferty = document.querySelectorAll("article");
    oferty.forEach(oferta => oferta.style.display = "none");

    ofertyZOcenami = document.querySelectorAll('article:has([aria-label*="na 5"])');

    ofertyZOcenami.forEach(function(oferta) {
        elementOceny = oferta.querySelector('[aria-label*="na 5"]');
        ariaLabel = elementOceny.getAttribute('aria-label');
        
        fragmenty = ariaLabel.split("na 5");
        
        tekstOcena = fragmenty[0].replace(/[^0-9,.]/g, "").replace(",", ".");
        tekstOpinie = (fragmenty[1] || "").replace(/[^0-9]/g, "");

        wartoscOceny = parseFloat(tekstOcena) || 0;
        wartoscOpinii = parseInt(tekstOpinie) || 0;

        if (wartoscOceny >= ocenaOd && wartoscOceny <= ocenaDo && (!sprawdzajOpinie || wartoscOpinii >= liczbaOpinii)) {
            oferta.style.display = "";
        }
    });

    znacznikCzasu = new Date().toISOString();
    console.log(znacznikCzasu + " - Proces filtrowania zakończony.");
}

wstrzyknijPanelBoczny();