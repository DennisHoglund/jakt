// Allmänna jakttider för jaktåret 2026/27.
// Källa: Jaktförordningen (1987:905) bilaga 1 i lydelsen som gäller t.o.m. 30 juni 2027.
// Älg: länsstyrelsernas beslut för 2026 (sammanställt av Svensk Jakt).
// Perioder anges som [start, slut] i MMDD. Slut 0229 = 28 (29) feb.
//
// Radernas l:
//   'ALL'                       hela landet
//   ['M', 'N']                  angivna län
//   { rest: true, except: [] }  övriga län, dvs. län som inte nämns i en annan rad med samma g
// g grupperar rader som hör ihop (t.ex. bara tupp), så att "övriga" räknas inom gruppen.

window.JAKT = (() => {
  const LAN = [
    { k: 'AB', n: 'Stockholms län', c: [59.45, 18.2] },
    { k: 'C', n: 'Uppsala län', c: [60.1, 17.6] },
    { k: 'D', n: 'Södermanlands län', c: [59.05, 16.6] },
    { k: 'E', n: 'Östergötlands län', c: [58.35, 15.6] },
    { k: 'F', n: 'Jönköpings län', c: [57.5, 14.4] },
    { k: 'G', n: 'Kronobergs län', c: [56.8, 14.6] },
    { k: 'H', n: 'Kalmar län', c: [57.3, 16.1] },
    { k: 'I', n: 'Gotlands län', c: [57.5, 18.5] },
    { k: 'K', n: 'Blekinge län', c: [56.25, 15.2] },
    { k: 'M', n: 'Skåne län', c: [55.9, 13.5] },
    { k: 'N', n: 'Hallands län', c: [56.9, 12.75] },
    { k: 'O', n: 'Västra Götalands län', c: [58.2, 12.5] },
    { k: 'S', n: 'Värmlands län', c: [59.8, 13.2] },
    { k: 'T', n: 'Örebro län', c: [59.4, 15.0] },
    { k: 'U', n: 'Västmanlands län', c: [59.75, 16.2] },
    { k: 'W', n: 'Dalarnas län', c: [61.0, 14.7] },
    { k: 'X', n: 'Gävleborgs län', c: [61.5, 16.3] },
    { k: 'Y', n: 'Västernorrlands län', c: [63.0, 17.3] },
    { k: 'Z', n: 'Jämtlands län', c: [63.2, 14.2] },
    { k: 'AC', n: 'Västerbottens län', c: [64.8, 18.0] },
    { k: 'BD', n: 'Norrbottens län', c: [67.0, 20.5] }
  ];

  const NORR6 = ['W', 'X', 'Y', 'Z', 'AC', 'BD'];
  const SYD7 = ['E', 'F', 'G', 'H', 'K', 'N', 'O'];
  const SMYG = 'Endast smyg- eller vaktjakt';
  const GRANS = 'Från kl. 11.00 den 20 aug';
  const rest = (except) => ({ rest: true, except: except || [] });

  const ALG_SODER = ['T', 'C', 'U', 'AB', 'D', 'E', 'O', 'H', 'G', 'F', 'N', 'K', 'M'];

  const ARTER = [
    // Klövvilt
    { id: 'alg', n: 'Älg', cat: 'Klövvilt',
      info: 'Jakttiderna beslutas av länsstyrelsen per älgförvaltningsområde. Licens eller registrerat område krävs. Kontrollera alltid länsstyrelsens beslut för ditt område.',
      r: [
        { l: ['BD'], part: 'Kiruna kommun ovanför odlingsgränsen', p: [['0901', '1011']], note: '1–5 sep endast kalv' },
        { l: ['BD'], part: 'Kiruna kommun nedanför odlingsgränsen', p: [['0901', '1101']], note: '1–5 sep endast kalv' },
        { l: ['BD'], part: 'Gällivare, Jokkmokk, Arjeplog, Arvidsjaur', p: [['0901', '1115']], note: '1–5 sep endast kalv. Särskilda beslut för delar av Arjeplog och Arvidsjaur (16 nov–6 dec) och delar av Jokkmokk (14 dec–31 jan).' },
        { l: ['BD'], part: 'Piteå, Luleå, Älvsbyn, Boden, Kalix, Haparanda, Pajala, Överkalix, Övertorneå', p: [['0901', '0131']], note: '1–5 sep endast kalv' },
        { l: ['AC', 'Z', 'Y'], p: [['0901', '0925'], ['1010', '0131']], note: '1–5 sep endast kalv' },
        { l: ['X'], part: 'Ljusdal-Ramsjö, Ljusnan-Voxnan, Långvind, Norra Hälsingland, Strömsbruk, Ödmården, Öster Ljusnan', p: [['0901', '0923'], ['1008', '0131']] },
        { l: ['X'], part: 'Furuvik, Hamrångefjärden, Södra Gästrikland', p: [['1008', '0131']] },
        { l: ['W'], part: 'Bingsjö, Bjursås, Malungs Västra, Malungs Östra Venjan, Noppikoski, Siljansringen, Särna-Idre, Älvdalen', p: [['0901', '0923'], ['1008', '0131']] },
        { l: ['W'], part: 'Övriga områden', p: [['1008', '0131']] },
        { l: ['S'], part: 'Finnskogens område', p: [['0901', '0926'], ['1008', '0131']], note: '1–5 sep endast kalv' },
        { l: ['S'], part: 'Övriga områden', p: [['1008', '0131']], note: '8–12 okt endast kalv' },
        { l: ALG_SODER, p: [['1008', '0131']], note: '8–12 okt endast kalv' }
      ] },
    { id: 'kronhjort', n: 'Kronhjort', cat: 'Klövvilt',
      info: 'I kronhjortsområden och kronhjortsskötselområden gäller länsstyrelsens beslut.',
      r: [
        { l: ['M'], part: 'Utanför kronhjortsområden', p: [['1008', '0131']] },
        { g: 'kalv', l: rest(['M']), who: 'Årskalv', part: 'Utanför kronhjortsskötselområden', p: [['0816', '0131']], note: '16 aug–30 sep endast smyg- eller vaktjakt' }
      ] },
    { id: 'dovhjort', n: 'Dovhjort', cat: 'Klövvilt',
      r: [
        { l: 'ALL', who: 'Alla djur', p: [['1001', '1020'], ['1116', '0229']] },
        { l: 'ALL', who: 'Hornbärande djur och kalv', p: [['0901', '0930']], note: SMYG },
        { l: 'ALL', who: 'Hind och kalv', p: [['1021', '1115'], ['0301', '0331']], note: SMYG }
      ] },
    { id: 'radjur', n: 'Rådjur', cat: 'Klövvilt',
      r: [
        { l: 'ALL', who: 'Alla djur', p: [['1001', '0131']] },
        { l: 'ALL', who: 'Bock', p: [['0816', '0930'], ['0501', '0615']], note: SMYG },
        { l: 'ALL', who: 'Kid', p: [['0901', '0930']], note: SMYG }
      ] },
    { id: 'vildsvin', n: 'Vildsvin', cat: 'Klövvilt',
      r: [
        { l: 'ALL', who: 'Alla utom sugga med randiga eller bruna kultingar', p: [['0401', '0131']] },
        { l: 'ALL', who: 'Årsunge', p: [['0701', '0630']] }
      ] },

    // Småvilt
    { id: 'falthare', n: 'Fälthare', cat: 'Småvilt', r: [{ l: 'ALL', p: [['0901', '0229']] }] },
    { id: 'skogshare', n: 'Skogshare', cat: 'Småvilt', r: [
      { l: ['I', 'N', 'F', 'H', 'G', 'M', 'D', 'O', 'E'], p: [['0901', '0215']] },
      { l: rest(), p: [['0901', '0229']] }
    ] },
    { id: 'baver', n: 'Bäver', cat: 'Småvilt', r: [
      { l: NORR6, p: [['1001', '0515']] },
      { l: rest(), p: [['1001', '0510']] }
    ] },
    { id: 'rodrav', n: 'Rödräv', cat: 'Småvilt', r: [
      { l: ['K', 'M', 'N'], p: [['0801', '0229']] },
      { l: ['S', 'T', 'X'], p: [['0801', '0331']] },
      { l: ['W'], part: 'Utom Älvdalens kommun', p: [['0801', '0331']] },
      { l: ['W'], part: 'Älvdalens kommun', p: [['0801', '0415']] },
      { l: ['Y', 'Z', 'AC', 'BD'], p: [['0801', '0415']] },
      { l: rest(), p: [['0801', '0315']] }
    ] },
    { id: 'iller', n: 'Iller', cat: 'Småvilt', r: [{ l: 'ALL', p: [['0901', '0229']] }] },
    { id: 'skogsmard', n: 'Skogsmård', cat: 'Småvilt', r: [
      { l: ['S', 'W', 'X', 'Y', 'Z', 'AC', 'BD'], p: [['0901', '0331']] },
      { l: rest(), p: [['0901', '0229']] }
    ] },
    { id: 'gravling', n: 'Grävling', cat: 'Småvilt', r: [{ l: 'ALL', p: [['0801', '0131']] }] },

    // Skogsfågel och hönsfåglar
    ...['Tjäder', 'Orre'].map((n) => ({ id: n.toLowerCase(), n, cat: 'Skogsfågel', r: [
      { l: SYD7, p: [['0825', '0930']] },
      { l: rest(['I', 'M']), p: [['0825', '1115']] },
      { g: 'tupp', who: 'Endast tupp', l: SYD7, p: [['0101', '0131']] },
      { g: 'tupp', who: 'Endast tupp', l: ['M'], p: [['0901', '0915'], ['0101', '0131']] },
      { g: 'tupp', who: 'Endast tupp', l: rest(['I']), p: [['1116', '0215']] }
    ] })),
    { id: 'jarpe', n: 'Järpe', cat: 'Skogsfågel', r: [
      { l: ['BD', 'AC', 'Z', 'Y', 'X', 'W', 'S'], p: [['0825', '1115']] }
    ] },
    ...['Dalripa', 'Fjällripa'].map((n) => ({ id: n.toLowerCase(), n, cat: 'Skogsfågel', r: [
      { l: ['W'], part: 'Älvdalens kommun', p: [['0825', '0229']] },
      { l: ['W'], part: 'Övriga delar av länet', p: [['0825', '0215']] },
      { l: ['Z'], p: [['0825', '0229']] },
      { l: ['AC', 'BD'], part: 'Nedanför lappmarksgränsen', p: [['0825', '0215']] },
      { l: ['AC', 'BD'], part: 'Ovanför lappmarksgränsen', p: [['0825', '0315']] },
      { l: ['S', 'X', 'Y'], p: [['0825', '1115']] }
    ] })),
    { id: 'fasan', n: 'Fasan', cat: 'Skogsfågel', r: [{ l: 'ALL', p: [['1001', '0131']] }] },
    { id: 'rapphona', n: 'Rapphöna', cat: 'Skogsfågel', r: [{ l: 'ALL', p: [['0916', '1130']] }] },
    { id: 'morkulla', n: 'Morkulla', cat: 'Skogsfågel', r: [{ l: 'ALL', p: [['0911', '1231']] }] },
    { id: 'ringduva', n: 'Ringduva', cat: 'Skogsfågel', r: [
      { l: NORR6, p: [['0801', '1231']] },
      { l: rest(), p: [['0816', '1231']] }
    ] },

    // Sjöfågel
    { id: 'grasand', n: 'Gräsand', cat: 'Sjöfågel', r: [
      { l: ['I', 'K', 'M'], p: [['0821', '1231']] },
      { l: ['W', 'X', 'Y', 'Z', 'AC'], p: [['0825', '1130']] },
      { l: ['BD'], part: 'Utom gränsälvsområdet', p: [['0825', '1130']] },
      { l: ['BD'], part: 'Gränsälvsområdet', p: [['0820', '1130']], note: GRANS },
      { l: rest(), p: [['0821', '1231']] }
    ] },
    ...['Kricka', 'Bläsand'].map((n) => ({ id: n.toLowerCase(), n, cat: 'Sjöfågel', r: [
      { l: ['I', 'K', 'M'], p: [['0821', '1231']] },
      { l: ['W', 'X', 'Y', 'Z', 'AC'], p: [['0825', '1130']] },
      { l: ['BD'], part: 'Utom gränsälvsområdet', p: [['0825', '1130']] },
      { l: ['BD'], part: 'Gränsälvsområdet', p: [['0820', '1130']], note: GRANS },
      { l: rest(), p: [['0821', '1130']] }
    ] })),
    ...['Knipa', 'Storskrake', 'Vigg'].map((n) => ({ id: n.toLowerCase(), n, cat: 'Sjöfågel', r: [
      { l: ['BD'], part: 'Utom gränsälvsområdet', p: [['0821', '0131']] },
      { l: ['BD'], part: 'Gränsälvsområdet', p: [['0820', '0131']], note: GRANS },
      { l: rest(), p: [['0821', '0131']] }
    ] })),
    { id: 'sjoorre', n: 'Sjöorre', cat: 'Sjöfågel', r: [{ l: 'ALL', p: [['0921', '0131']] }] },
    ...['Grågås', 'Kanadagås'].map((n) => ({ id: n.toLowerCase(), n, cat: 'Sjöfågel', r: [
      { l: ['BD'], part: 'Utom gränsälvsområdet', p: [['0811', '0131']] },
      { l: ['BD'], part: 'Gränsälvsområdet', p: [['0820', '0131']], note: GRANS },
      { l: rest(), p: [['0811', '0131']] }
    ] })),
    { id: 'blasgas', n: 'Bläsgås', cat: 'Sjöfågel', r: [{ l: ['M'], p: [['1001', '0131']] }] },

    // Övriga fåglar
    { id: 'fiskmas', n: 'Fiskmås', cat: 'Övriga fåglar', r: [{ l: 'ALL', p: [['0811', '0229']] }] },
    { id: 'gratrut', n: 'Gråtrut', cat: 'Övriga fåglar', r: [{ l: 'ALL', p: [['0801', '0331']] }] },
    ...['Kråka', 'Kaja', 'Skata'].map((n) => ({ id: n.toLowerCase(), n, cat: 'Övriga fåglar', r: [
      { l: ['Y', 'Z', 'AC', 'BD'], p: [['0716', '0430']] },
      { l: rest(), p: [['0701', '0415']] }
    ] })),
    { id: 'raka', n: 'Råka', cat: 'Övriga fåglar', r: [{ l: ['M', 'N'], p: [['0721', '0131']] }] },
    { id: 'notskrika', n: 'Nötskrika', cat: 'Övriga fåglar', r: [{ l: 'ALL', p: [['0821', '0310']] }] }
  ];

  // Vapen och ammunition enligt NFS 2023:8 (i kraft 1 aug 2023).
  // k = lägsta tillåtna kulklass (högre klass är alltid tillåten), h = hagel.
  const H_STOR = 'Kaliber 12, 16 eller 20';
  const H_ALLA = 'Kaliber 12, 16, 20, 24, 28, 32 eller .410';
  const BLY = 'Blyhagel är förbjudet inom 100 m från våtmark.';
  const V = (k, h, note) => ({ k, h, note });
  const VAPEN = {
    alg: V(1, null), kronhjort: V(1, null),
    dovhjort: V(1, null, 'Slugpatron i kaliber 12, 16 eller 20 är tillåten om du är behörig för klass 1.'),
    vildsvin: V(1, null, 'Slugpatron i kaliber 12, 16 eller 20 är tillåten om du är behörig för klass 1.'),
    radjur: V(2, H_STOR, 'Slugpatron är tillåten om du är behörig för klass 2.'),
    baver: V(2, null),
    falthare: V(3, H_STOR), skogshare: V(3, H_STOR),
    rodrav: V(3, H_STOR, 'Klass 4 räcker under jord, vid gryt eller lya.'),
    gravling: V(3, H_STOR, 'Klass 4 räcker under jord, vid gryt eller med ställande hund.'),
    iller: V(4, H_ALLA), skogsmard: V(4, H_ALLA),
    'tjäder': V(3, H_STOR), orre: V(3, H_STOR),
    jarpe: V(4, H_ALLA), dalripa: V(4, H_ALLA), 'fjällripa': V(4, H_ALLA),
    fasan: V(4, H_ALLA), rapphona: V(4, H_ALLA), morkulla: V(4, H_ALLA), ringduva: V(4, H_ALLA),
    grasand: V(4, H_ALLA, BLY), kricka: V(4, H_ALLA, BLY), 'bläsand': V(4, H_ALLA, BLY),
    knipa: V(4, H_ALLA, BLY), storskrake: V(4, H_ALLA, BLY), vigg: V(4, H_ALLA, BLY),
    sjoorre: V(3, H_STOR, BLY),
    'grågås': V(3, H_STOR, BLY), 'kanadagås': V(3, H_STOR, BLY), blasgas: V(3, H_STOR, BLY),
    fiskmas: V(4, H_ALLA), gratrut: V(4, H_ALLA),
    'kråka': V(4, H_ALLA), kaja: V(4, H_ALLA), skata: V(4, H_ALLA), raka: V(4, H_ALLA), notskrika: V(4, H_ALLA)
  };
  ARTER.forEach((a) => { a.v = VAPEN[a.id] || null; });

  const KLASS = [
    'Klass 1: expanderande kula, minst 9 g och 2 700 J, eller 10 g och 2 000 J (blyfri: 7,7 g och 2 000 J) på 100 m. Exempel: .308 Win, .30-06, 9,3×62, 6,5×55 med tung kula.',
    'Klass 2: expanderande kula, minst 3,2 g och 800 J på 100 m. Exempel: .222 Rem, .223 Rem, .243 Win.',
    'Klass 3: valfri kulkonstruktion, minst 2,5 g och 200 J på 100 m. Exempel: .22 Hornet, vissa .22 WMR-laddningar.',
    'Klass 4: valfri kulkonstruktion, minst 150 J vid mynningen. Exempel: .22 LR (high velocity), .17 HMR, .22 WMR.',
    'Exemplen är vägledning. Det är den aktuella laddningens kulvikt och energi som avgör klassen, så kontrollera tillverkarens tabell.',
    'Hagel: högst 3 patroner (2 i magasinet), hagel högst 4,1 mm (US 1), pipa minst 48 cm.'
  ];

  // Bilder: latinskt namn + varianter [svensk etikett, engelskt sökord] för Wikimedia Commons.
  const HH = [['Hane', 'male'], ['Hona', 'female']];
  const TH = [['Tupp', 'male'], ['Höna', 'female']];
  const ARS = [['Sommardräkt', 'summer'], ['Vinterdräkt', 'winter']];
  const ADU = [['Adult', 'adult'], ['Ungfågel', 'juvenile']];
  const BILD = {
    alg: ['Alces alces', [['Tjur', 'bull'], ['Ko', 'cow'], ['Kalv', 'calf']]],
    kronhjort: ['Cervus elaphus', [['Hjort', 'stag'], ['Hind', 'hind'], ['Kalv', 'calf']]],
    dovhjort: ['Dama dama', [['Hjort', 'buck'], ['Hind', 'doe'], ['Kalv', 'fawn']]],
    radjur: ['Capreolus capreolus', [['Bock', 'buck'], ['Get', 'doe'], ['Kid', 'fawn']]],
    vildsvin: ['Sus scrofa', [['Galt', 'boar'], ['Sugga med kultingar', 'piglets'], ['Årsunge', 'juvenile']]],
    falthare: ['Lepus europaeus'], skogshare: ['Lepus timidus', [['Sommarpäls', 'summer'], ['Vinterpäls', 'winter']]],
    baver: ['Castor fiber'], rodrav: ['Vulpes vulpes', [['Vuxen', 'adult'], ['Unge', 'cub']]],
    iller: ['Mustela putorius'], skogsmard: ['Martes martes'], gravling: ['Meles meles'],
    'tjäder': ['Tetrao urogallus', TH], orre: ['Lyrurus tetrix', TH], jarpe: ['Tetrastes bonasia', TH],
    dalripa: ['Lagopus lagopus', ARS], 'fjällripa': ['Lagopus muta', ARS],
    fasan: ['Phasianus colchicus', TH], rapphona: ['Perdix perdix'], morkulla: ['Scolopax rusticola'], ringduva: ['Columba palumbus'],
    grasand: ['Anas platyrhynchos', HH], kricka: ['Anas crecca', HH], 'bläsand': ['Mareca penelope', HH],
    knipa: ['Bucephala clangula', HH], storskrake: ['Mergus merganser', HH], vigg: ['Aythya fuligula', HH], sjoorre: ['Melanitta nigra', HH],
    'grågås': ['Anser anser'], 'kanadagås': ['Branta canadensis'], blasgas: ['Anser albifrons'],
    fiskmas: ['Larus canus', ADU], gratrut: ['Larus argentatus', ADU],
    'kråka': ['Corvus cornix'], kaja: ['Coloeus monedula'], skata: ['Pica pica'], raka: ['Corvus frugilegus'], notskrika: ['Garrulus glandarius']
  };
  ARTER.forEach((a) => { const b = BILD[a.id]; if (b) { a.latin = b[0]; a.var = b[1] || null; } });

  // Rader som gäller för ett län
  function rowsFor(art, lan) {
    const named = {};
    art.r.forEach((row) => {
      if (Array.isArray(row.l)) { const g = row.g || ''; (named[g] = named[g] || new Set()); row.l.forEach((k) => named[g].add(k)); }
    });
    return art.r.filter((row) => {
      if (row.l === 'ALL') return true;
      if (Array.isArray(row.l)) return row.l.includes(lan);
      const g = row.g || '';
      return !(named[g] && named[g].has(lan)) && !row.l.except.includes(lan);
    });
  }

  return { LAN, ARTER, KLASS, rowsFor, SOURCE_LAW: 'Jaktförordningen (1987:905) bilaga 1, lydelse t.o.m. 30 juni 2027', SOURCE_ALG: 'Länsstyrelsernas beslut om älgjakt 2026' };
})();
