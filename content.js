// Treści są generowane przez AI na podstawie promptów Vincenque (https://github.com/Vincenque)

let adresStartowy = new URL(window.location.href);
let numerBiezacejStrony = parseInt(adresStartowy.searchParams.get("p")) || 1;
let czyTrwaPobieranieKolejnejStrony = false;
let czyOsiagnietoKoniecStron = false;
let minimalnaLiczbaWidocznychOfert = 12;
let czyZainicjowanoZapisaneFiltry = false;
let ostatniZnanyUrl = window.location.href;

function znajdzGlownyKontener(korzenDokumentu) {
    let wszystkieArtykuly;
    let drzewoKandydatow;
    let wytypowanyKontener;
    let maksymalnaLiczbaDzieci;

    wszystkieArtykuly = korzenDokumentu.querySelectorAll("article");
    drzewoKandydatow = new Set();
    wytypowanyKontener = korzenDokumentu.body || korzenDokumentu;
    maksymalnaLiczbaDzieci = 0;

    wszystkieArtykuly.forEach(function(artykul) {
        let rodzic;
        rodzic = artykul.parentElement;
        while (rodzic && rodzic !== korzenDokumentu) {
            drzewoKandydatow.add(rodzic);
            rodzic = rodzic.parentElement;
        }
    });

    drzewoKandydatow.forEach(function(kandydat) {
        let liczbaDzieciZArtykulami;
        liczbaDzieciZArtykulami = 0;
        
        Array.from(kandydat.children).forEach(function(dziecko) {
            (dziecko.tagName === "ARTICLE" || dziecko.querySelector("article")) ? liczbaDzieciZArtykulami++ : null;
        });

        (liczbaDzieciZArtykulami > maksymalnaLiczbaDzieci) ? (maksymalnaLiczbaDzieci = liczbaDzieciZArtykulami, wytypowanyKontener = kandydat) : null;
    });

    return wytypowanyKontener;
}

function synchronizujZakresy() {
    let poleOd;
    let poleDo;
    let wartoscOd;
    let wartoscDo;

    poleOd = document.getElementById("zakres-ocena-od");
    poleDo = document.getElementById("zakres-ocena-do");

    wartoscOd = parseFloat(poleOd.value.replace(",", ".")) || 0;
    wartoscDo = parseFloat(poleDo.value.replace(",", ".")) || 5;

    poleDo.min = poleOd.value;
    (wartoscDo < wartoscOd) ? poleDo.value = poleOd.value : null;
}

function aktualizujAdresUrl(wartoscOd) {
    let obiektUrl;
    let obecnyParametr;
    let wartoscParametru;
    let znacznikCzasuPrzeladowania;

    obiektUrl = new URL(window.location.href);
    obecnyParametr = obiektUrl.searchParams.get("ocena-produktu") || "";
    wartoscParametru = "";

    (wartoscOd >= 5.0) ? wartoscParametru = "5.0" : ((wartoscOd >= 4.8) ? wartoscParametru = "od-4.8" : ((wartoscOd >= 4.6) ? wartoscParametru = "od-4.6" : ""));

    if (obecnyParametr !== wartoscParametru) {
        znacznikCzasuPrzeladowania = new Date().toISOString();
        console.log(znacznikCzasuPrzeladowania + " - Zmiana natywnego filtra Allegro, nastąpi odświeżenie strony.");
        
        (wartoscParametru !== "") ? obiektUrl.searchParams.set("ocena-produktu", wartoscParametru) : obiektUrl.searchParams.delete("ocena-produktu");
        obiektUrl.searchParams.delete("p");
        window.location.href = obiektUrl.toString();
        return true;
    }
    
    window.history.replaceState({}, "", obiektUrl.toString());
    ostatniZnanyUrl = window.location.href;
    
    return false;
}

function ukryjPaginacje() {
    let elementyPaginacji;
    
    elementyPaginacji = document.querySelectorAll('[aria-label*="paginacj"], [aria-label*="pagination"], [data-box-name*="Pagination"], [data-role*="pagination"]');
    elementyPaginacji.forEach(function(element) {
        element.style.display = "none";
    });
}

function wstrzyknijPanelBoczny() {
    let znacznikCzasuWstrzykiwania;
    let znacznikCzasuBledu;
    let istniejacePanele;
    let aktywnyZnaleziony;
    let wszystkieNaglowki;
    let naglowekOceny;
    let sekcjaOceny;
    let wszystkieRadia;
    let ostatnieRadio;
    let nazwaGrupyRadio;
    let wierszOstatniejOpcji;
    let autorskiPanelFiltrow;
    let poleRadio;
    let inneRadia;
    let przyciskUruchamiajacy;
    let sekcjaZastepcza;
    let kontenerZastepczy;
    let poleOd;
    let poleDo;

    // Mechanizm samoczyszczący - niszczy zduplikowane lub osierocone przez SPA panele
    istniejacePanele = document.querySelectorAll(".precyzyjny-filtr-kontener");
    aktywnyZnaleziony = false;

    (istniejacePanele.length > 0) ? istniejacePanele.forEach(function(panel) {
        (!aktywnyZnaleziony && document.body.contains(panel)) ? aktywnyZnaleziony = true : panel.remove();
    }) : null;

    if (aktywnyZnaleziony) {
        return;
    }

    znacznikCzasuWstrzykiwania = new Date().toISOString();
    console.log(znacznikCzasuWstrzykiwania + " - Rozpoczęcie wstrzykiwania własnego precyzyjnego zakresu do panelu ocen.");

    autorskiPanelFiltrow = document.createElement("div");

    try {
        wszystkieNaglowki = Array.from(document.querySelectorAll("h3"));
        naglowekOceny = wszystkieNaglowki.find(function(naglowek) {
            return naglowek.innerText.includes("Ocena produktu");
        });

        // Agresywny "happy path" - wspinanie się po węzłach
        sekcjaOceny = naglowekOceny.parentElement;
        while (sekcjaOceny.tagName !== "BODY" && sekcjaOceny.querySelectorAll('input[type="radio"]').length === 0) {
            sekcjaOceny = sekcjaOceny.parentElement;
        }

        wszystkieRadia = sekcjaOceny.querySelectorAll('input[type="radio"]');
        ostatnieRadio = wszystkieRadia[wszystkieRadia.length - 1];
        nazwaGrupyRadio = ostatnieRadio.name;

        wierszOstatniejOpcji = ostatnieRadio.parentElement;
        while (wierszOstatniejOpcji.parentElement.querySelectorAll('input[type="radio"]').length === 1) {
            wierszOstatniejOpcji = wierszOstatniejOpcji.parentElement;
        }

        autorskiPanelFiltrow.className = wierszOstatniejOpcji.className + " precyzyjny-filtr-kontener";
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

        wierszOstatniejOpcji.insertAdjacentElement("afterend", autorskiPanelFiltrow);

        inneRadia = sekcjaOceny.querySelectorAll('input[type="radio"]:not(#wlasny-zakres-radio)');
        inneRadia.forEach(function(radio) {
            radio.addEventListener("change", function() {
                document.getElementById("szczegoly-filtru").style.display = "none";
                sessionStorage.removeItem("wlasnyFiltrAktywny");
            });
        });

    } catch (bladWstrzykiwania) {
        try {
            znacznikCzasuBledu = new Date().toISOString();
            console.log(znacznikCzasuBledu + " - Filtr ocen niedostępny. Błąd: " + bladWstrzykiwania.message + ". Inicjacja bezpiecznej sekcji zastępczej.");

            nazwaGrupyRadio = "ocena_produktu_radio_wlasna";
            sekcjaZastepcza = wszystkieNaglowki.find(function(naglowek) {
                return naglowek.innerText.includes("Stan") || naglowek.innerText.includes("Cena") || naglowek.innerText.includes("Gwarancja") || naglowek.innerText.includes("Marka");
            });

            kontenerZastepczy = sekcjaZastepcza.parentElement.parentElement;

            autorskiPanelFiltrow.className = "precyzyjny-filtr-kontener precyzyjna-nowa-sekcja";
            autorskiPanelFiltrow.innerHTML = `
                <h3 class="tytul-nowej-sekcji">Ocena produktu (Własny zakres)</h3>
                <div class="allegro-radio-wtyczka">
                    <input type="radio" id="wlasny-zakres-radio" name="${nazwaGrupyRadio}" class="pole-wyboru-radio" checked>
                    <label for="wlasny-zakres-radio" class="etykieta-radio">Edytuj precyzyjny zakres</label>
                </div>
                <div id="szczegoly-filtru" class="szczegoly-ukryte" style="display: block; padding-left: 0;">
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

            kontenerZastepczy.insertAdjacentElement("beforebegin", autorskiPanelFiltrow);
        } catch (bladKrytyczny) {
            let znacznikKrytyczny = new Date().toISOString();
            console.log(znacznikKrytyczny + " - Zaniechano wstrzykiwania. Błąd krytyczny struktury DOM: " + bladKrytyczny.message);
            return;
        }
    }

    poleRadio = document.getElementById("wlasny-zakres-radio");
    poleRadio.addEventListener("change", function(zdarzenie) {
        document.getElementById("szczegoly-filtru").style.display = zdarzenie.target.checked ? "block" : "none";
    });

    if (sessionStorage.getItem("wlasnyFiltrAktywny") === "tak") {
        poleRadio.checked = true;
        document.getElementById("szczegoly-filtru").style.display = "block";
        document.getElementById("zakres-ocena-od").value = sessionStorage.getItem("wlasnaOcenaOd") || "4.75";
        document.getElementById("zakres-ocena-do").value = sessionStorage.getItem("wlasnaOcenaDo") || "5.00";
        document.getElementById("wymagane-opinie").value = sessionStorage.getItem("wlasneOpinie") || "30";
        document.getElementById("weryfikuj-opinie").checked = (sessionStorage.getItem("weryfikujOpinie") === "true");
        
        (!czyZainicjowanoZapisaneFiltry) ? (czyZainicjowanoZapisaneFiltry = true, setTimeout(przetwarzajOferty, 600)) : null;
    }

    poleOd = document.getElementById("zakres-ocena-od");
    poleDo = document.getElementById("zakres-ocena-do");

    poleOd.addEventListener("input", synchronizujZakresy);
    poleDo.addEventListener("input", synchronizujZakresy);

    przyciskUruchamiajacy = document.getElementById("uruchom-filtrowanie");
    przyciskUruchamiajacy.addEventListener("click", function(zdarzenie) {
        zdarzenie.preventDefault();
        przetwarzajOferty();
    });

    ukryjPaginacje();
}

function przetwarzajOferty() {
    let znacznikCzasuFiltrowania;
    let ocenaOd;
    let ocenaDo;
    let liczbaOpinii;
    let sprawdzajOpinie;
    let glownyKontener;
    let ofertyZOcenami;
    let liczbaWidocznychOfert;

    znacznikCzasuFiltrowania = new Date().toISOString();
    console.log(znacznikCzasuFiltrowania + " - Start algorytmu ukrywania ofert według precyzyjnych progów.");

    ocenaOd = parseFloat(document.getElementById("zakres-ocena-od").value.replace(",", ".")) || 0;
    ocenaDo = parseFloat(document.getElementById("zakres-ocena-do").value.replace(",", ".")) || 5;
    liczbaOpinii = parseInt(document.getElementById("wymagane-opinie").value) || 0;
    sprawdzajOpinie = document.getElementById("weryfikuj-opinie").checked;

    sessionStorage.setItem("wlasnyFiltrAktywny", "tak");
    sessionStorage.setItem("wlasnaOcenaOd", document.getElementById("zakres-ocena-od").value);
    sessionStorage.setItem("wlasnaOcenaDo", document.getElementById("zakres-ocena-do").value);
    sessionStorage.setItem("wlasneOpinie", document.getElementById("wymagane-opinie").value);
    sessionStorage.setItem("weryfikujOpinie", sprawdzajOpinie);

    if (aktualizujAdresUrl(ocenaOd)) {
        return;
    }

    ukryjPaginacje();
    czyOsiagnietoKoniecStron = false;
    glownyKontener = znajdzGlownyKontener(document);

    document.querySelectorAll("article").forEach(function(oferta) {
        let ramkaSiatki;
        oferta.style.display = "none";
        ramkaSiatki = oferta;
        
        while (ramkaSiatki.parentElement && ramkaSiatki.parentElement !== glownyKontener) {
            ramkaSiatki = ramkaSiatki.parentElement;
        }
        
        (glownyKontener.contains(oferta)) ? ramkaSiatki.style.display = "none" : null;
    });

    ofertyZOcenami = glownyKontener.querySelectorAll('article:has([aria-label*="na 5"])');

    ofertyZOcenami.forEach(function(oferta) {
        let elementOceny;
        let ariaLabel;
        let fragmenty;
        let tekstOcena;
        let tekstOpinie;
        let wartoscOceny;
        let wartoscOpinii;

        elementOceny = oferta.querySelector('[aria-label*="na 5"]');
        ariaLabel = elementOceny.getAttribute("aria-label");

        fragmenty = ariaLabel.split("na 5");
        tekstOcena = fragmenty[0].replace(/[^0-9,.]/g, "").replace(",", ".");
        tekstOpinie = (fragmenty[1] || "").replace(/[^0-9]/g, "");

        wartoscOceny = parseFloat(tekstOcena) || 0;
        wartoscOpinii = parseInt(tekstOpinie) || 0;

        if (wartoscOceny >= ocenaOd && wartoscOceny <= ocenaDo && (!sprawdzajOpinie || wartoscOpinii >= liczbaOpinii)) {
            let aktualnyPoziom;
            aktualnyPoziom = oferta;
            while (aktualnyPoziom && aktualnyPoziom !== glownyKontener) {
                aktualnyPoziom.style.display = "";
                aktualnyPoziom = aktualnyPoziom.parentElement;
            }
        }
    });

    liczbaWidocznychOfert = Array.from(glownyKontener.querySelectorAll("article")).filter(function(oferta) {
        return oferta.style.display !== "none";
    }).length;

    (liczbaWidocznychOfert < minimalnaLiczbaWidocznychOfert && !czyOsiagnietoKoniecStron) ? pobierzKolejnaStrone() : null;
    console.log(znacznikCzasuFiltrowania + " - Proces filtrowania drzewa DOM zakończony.");
}

function pobierzKolejnaStrone() {
    let znacznikCzasuPobierania;
    let urlKolejnejStrony;
    let ocenaOd;
    let ocenaDo;
    let liczbaOpinii;
    let sprawdzajOpinie;

    if (czyTrwaPobieranieKolejnejStrony || czyOsiagnietoKoniecStron) {
        return;
    }

    czyTrwaPobieranieKolejnejStrony = true;
    numerBiezacejStrony += 1;

    znacznikCzasuPobierania = new Date().toISOString();
    console.log(znacznikCzasuPobierania + " - Pobieranie zawartości strony o numerze: " + numerBiezacejStrony);

    ocenaOd = parseFloat(document.getElementById("zakres-ocena-od").value.replace(",", ".")) || 0;
    ocenaDo = parseFloat(document.getElementById("zakres-ocena-do").value.replace(",", ".")) || 5;
    liczbaOpinii = parseInt(document.getElementById("wymagane-opinie").value) || 0;
    sprawdzajOpinie = document.getElementById("weryfikuj-opinie").checked;

    urlKolejnejStrony = new URL(window.location.href);
    urlKolejnejStrony.searchParams.set("p", numerBiezacejStrony);

    window.history.replaceState({}, "", urlKolejnejStrony.toString());
    ostatniZnanyUrl = window.location.href;

    fetch(urlKolejnejStrony.toString())
        .then(function(odpowiedz) {
            return odpowiedz.text();
        })
        .then(function(tekstHtml) {
            let parserHtml;
            let sparsowanyDokument;
            let pobranyKontener;
            let docelowyKontener;
            let sprawdzaneArtykuly;
            let liczbaNowoDodanychOfert;
            let lacznaLiczbaWidocznychOfert;

            parserHtml = new DOMParser();
            sparsowanyDokument = parserHtml.parseFromString(tekstHtml, "text/html");

            pobranyKontener = znajdzGlownyKontener(sparsowanyDokument);
            docelowyKontener = znajdzGlownyKontener(document);
            sprawdzaneArtykuly = sparsowanyDokument.querySelectorAll('article:has([aria-label*="na 5"])');
            liczbaNowoDodanychOfert = 0;

            (sprawdzaneArtykuly.length === 0) ? czyOsiagnietoKoniecStron = true : null;

            Array.from(pobranyKontener.children).forEach(function(komorka) {
                let podArtykuly;
                let czyZostawicKomorke;

                podArtykuly = (komorka.tagName === "ARTICLE") ? [komorka] : Array.from(komorka.querySelectorAll("article"));
                czyZostawicKomorke = false;

                (podArtykuly.length > 0) ? podArtykuly.forEach(function(pojedynczyArtykul) {
                    let elementOcenyNowej;
                    
                    elementOcenyNowej = pojedynczyArtykul.querySelector('[aria-label*="na 5"]');
                    
                    try {
                        let ariaLabelNowej;
                        let fragmentyNowej;
                        let tekstOcenaNowej;
                        let tekstOpinieNowej;
                        let wartoscOcenyNowej;
                        let wartoscOpiniiNowej;
                        let aktualnaGalaz;

                        ariaLabelNowej = elementOcenyNowej.getAttribute("aria-label");
                        fragmentyNowej = ariaLabelNowej.split("na 5");
                        tekstOcenaNowej = fragmentyNowej[0].replace(/[^0-9,.]/g, "").replace(",", ".");
                        tekstOpinieNowej = (fragmentyNowej[1] || "").replace(/[^0-9]/g, "");

                        wartoscOcenyNowej = parseFloat(tekstOcenaNowej) || 0;
                        wartoscOpiniiNowej = parseInt(tekstOpinieNowej) || 0;

                        if (wartoscOcenyNowej >= ocenaOd && wartoscOcenyNowej <= ocenaDo && (!sprawdzajOpinie || wartoscOpiniiNowej >= liczbaOpinii)) {
                            aktualnaGalaz = pojedynczyArtykul;
                            while (aktualnaGalaz && aktualnaGalaz !== pobranyKontener) {
                                aktualnaGalaz.style.display = "";
                                aktualnaGalaz = aktualnaGalaz.parentElement;
                            }
                            czyZostawicKomorke = true;
                        } else {
                            pojedynczyArtykul.style.display = "none";
                        }
                    } catch (brakOceny) {
                        let znacznikBledu = new Date().toISOString();
                        console.log(znacznikBledu + " - Artykuł na zaciągniętej stronie nie posiada etykiety oceny (np. sponsorowany). Ukrywanie.");
                        pojedynczyArtykul.style.display = "none";
                    }
                }) : null;

                (czyZostawicKomorke) ? (komorka.style.display = "", docelowyKontener.appendChild(komorka), liczbaNowoDodanychOfert++) : null;
            });

            ukryjPaginacje();
            czyTrwaPobieranieKolejnejStrony = false;

            lacznaLiczbaWidocznychOfert = Array.from(docelowyKontener.querySelectorAll("article")).filter(function(oferta) {
                return oferta.style.display !== "none";
            }).length;

            (lacznaLiczbaWidocznychOfert < minimalnaLiczbaWidocznychOfert && !czyOsiagnietoKoniecStron) ? pobierzKolejnaStrone() : null;
        })
        .catch(function(bladPobierania) {
            let znacznikBledu;
            znacznikBledu = new Date().toISOString();
            console.log(znacznikBledu + " - Błąd podczas pobierania kolejnej strony: " + bladPobierania.message);
            czyTrwaPobieranieKolejnejStrony = false;
        });
}

window.addEventListener("scroll", function() {
    let dystansDoDnaOkna;
    let obiektXPath;
    let identyfikatorWyszukiwania;
    let pozycjaWyzwalacza;

    obiektXPath = document.evaluate("//span[contains(., 'identyfikator wyszukiwania')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
    identyfikatorWyszukiwania = obiektXPath.singleNodeValue;

    if (identyfikatorWyszukiwania) {
        pozycjaWyzwalacza = identyfikatorWyszukiwania.getBoundingClientRect().top;
        (pozycjaWyzwalacza < window.innerHeight + 800 && !czyTrwaPobieranieKolejnejStrony && !czyOsiagnietoKoniecStron) ? pobierzKolejnaStrone() : null;
    } else {
        dystansDoDnaOkna = document.documentElement.scrollHeight - (window.innerHeight + window.scrollY);
        (dystansDoDnaOkna < 900 && !czyTrwaPobieranieKolejnejStrony && !czyOsiagnietoKoniecStron) ? pobierzKolejnaStrone() : null;
    }
});

setInterval(function() {
    let znacznikCzasuSpa;

    wstrzyknijPanelBoczny();
    ukryjPaginacje();

    if (window.location.href !== ostatniZnanyUrl) {
        ostatniZnanyUrl = window.location.href;

        if (sessionStorage.getItem("wlasnyFiltrAktywny") === "tak") {
            znacznikCzasuSpa = new Date().toISOString();
            console.log(znacznikCzasuSpa + " - Wykryto nawigację SPA. Odtwarzanie własnego filtra ofert.");
            
            setTimeout(przetwarzajOferty, 1200);
        }
    }
}, 1500);