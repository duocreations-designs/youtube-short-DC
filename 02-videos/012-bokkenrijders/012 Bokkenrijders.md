# 012 Bokkenrijders

Gemaakt op 25 nov 2026 in een cloudsessie, met de Stick3D-engine (Remotion + Three.js).

## Onderwerp en uniek-test
- Echt verhaal: de Bokkenrijders, Land van Overmaas (Zuid-Limburg), 1743 tot 1794.
- Vorm: kettingreactie van bekentenissen (1 naam wordt 3, wordt 9). Anders dan 011 (What if) en 010 (detective).
- Thema: misdaad en geheim.
- Zoekformuleringen (Google, 5 stuks, ook Nederlands): "Bokkenrijders flying goats Limburg video", "bokkenrijders youtube short tiktok goat riders Limburg animation", "Buckriders torture confessions", "Bokkenrijders 1743 1794 foltering bekentenis", "Kerckhoffs bokkenrijders Herzogenrath".
- Gevonden: geen Shorts, TikToks of animaties. Wel een jeugdserie (1994), een korte film "Hugo" (1996) en een musical in Maastricht (juni 2026).
- YouTube, TikTok en Instagram zelf zijn vanuit de cloud geblokkeerd. Zoek ze nog 2 minuten handmatig na voor plaatsing.
- Score: 8 van 10. Het onderwerp bestaat in Nederlandse media, de invalshoek "de marteling schreef het verhaal" als Short nog niet.

## Feitencheck (2 bronnen per feit)
| Feit | Bron 1 | Bron 2 |
| --- | --- | --- |
| Bokkenrijders, Zuid-Limburg, 1743 tot 1794 | en.wikipedia.org/wiki/Buckriders | dbnl.org De Bokkerijders (melc015bokk02) |
| Volksgeloof: de duivel gaf ze vliegende bokken | iamexpat.nl Dutch Folklore: The Bokkenrijders | en.wikipedia.org/wiki/Buckriders |
| Bekentenissen onder marteling of dreiging daarmee | en.wikipedia.org/wiki/Buckriders | dbnl.org pasi001woes01 (zaak Maaseik, Spaanse laarzen) |
| Eed: God afzweren, trouw aan de duivel | dbnl.org Sinninghe, Verhalen uit het land der bokkenrijders | en.wikipedia.org/wiki/Buckriders |
| Joseph Kerckhoffs, chirurgijn uit Herzogenrath, kapitein | en.wikipedia.org/wiki/Joseph_Kerckhoffs | dbnl.org pasi001woes01_01_0026 |
| Kerckhoffs opgehangen op 11 mei 1772 | en.wikipedia.org/wiki/Buckriders (tabel) | en.wikipedia.org/wiki/Joseph_Kerckhoffs |
| Ongeveer 1.200 beschuldigd (1.170 in een andere telling) | en.wikipedia.org/wiki/Buckriders | wikiwand / iamexpat |
| Minstens 425 tot 468 terechtgesteld | en.wikipedia.org/wiki/Buckriders | wikiwand Buckriders |

Voorbehoud: "1 gevangene gaf 3 namen, die gaven er 9" is een voorbeeld van het mechanisme (beschuldigingen onder marteling noemden medeplichtigen). De aantallen 3 en 9 staan niet in een bron. De voornaam van Kerckhoffs verschilt per bron (Joseph of Joseph Heinrich).

## Script (196 woorden geschreven, 209 gesproken, 16 zinnen)
Zie lines.txt (geschreven) en spoken.txt (zoals de stem het uitspreekt).
- Hook: tegenstelling zonder uitkomst. Brug: "But" in zin 2.
- Draaien: But (2), So (5), Then (8), You see (11, op 65%), but (12), But (15), So (16).
- Slot: vraag.

## Stem
- Harrison (573e5163-59b3-4926-aab1-951ef2985f81), Higgsfield elevenlabs_v4, stabiliteit 0,25, 16 dialoogregels met emotie-tags. 6,21 credits. Job 5f045c65-a796-496a-9380-aaa618d3acfd.
- Ruw 78,6 s. Pauzes boven 0,25 s ingekort (1 pauze van 0,4 s voor "You see"), daarna rubberband-tempo x1,296. Zin 1 niet versneld.
- Tempo gemeten op gesproken woorden (209, jaartallen voluit): 58,79 s van eerste tot laatste woord, 3,555 woorden per seconde.
- "But" op 3,20 s (frame 96). "You see" op 39,33 s (67%).
- Woordtiming: pocketsphinx, 196 van 196 woorden. Uitspraak-hulp in spoken.json (Bokkenrijders = "bock in riders", Kerckhoffs = "kirk offs", Herzogenrath = "hertz oh gun rot").
- Lichte compressie op de stem (3:1 vanaf -26 dB) voor een LRA binnen 1,7 tot 3,2 LU.
- tools/voice/edit_voice.py kreeg 2 optionele argumenten: het woord voor de lange pauze en het laatste woord van zin 1. Zonder die argumenten werkt het als bij 011.

## Beeld
- 12 sets, 34 shots, 59,67 s (1790 frames). Overgangen alleen tussen sets: flash, whip, zoom, ghost, rewind.
- Sets: vliegende bok bij maanlicht, kasboek van de rechtbank, dorp bij nacht, overval op boerderij en kerk plus de duivel, rechters met lantaarns, martelkelder met namenbord, Herzogenrath met kasteel en galg, droom (eed, bok om middernacht, rit boven de bomen), het script van de rechters, galgenveld met teller, lege wei, slot in de kelder.
- Frame 0 beweegt: een bok met vleugels vliegt vanaf de maan naar de lens. Eerste wissel op 1,75 s.
- Nieuwe props in engine/limburg.tsx: bok (met of zonder vleugels), galg, kerk, vakwerkboerderij, kasboek met schrijvende ganzenveer, naamkaartje, maan, heuvel, fakkel, lantaarn, perkamentrol, martelpaal, rad, duivelshorens.
- Namen op het bord zijn verzonnen (JAN, PIETER, ANNA enz.). De rechtbank en het kasboek zijn nagespeeld.

## Teksten
34 pops, Archivo Black, band vanaf y 100 op 1280. Hook: "425 HANGED / FOR THIS?" van frame 0 tot 1,35 s. Volledige lijst in engine/Bok012.tsx (POPS).

## Geluid
- Eigen muziek in code, 120 bpm, 9 delen: nachtdorp (bel en drone), sluipen, mars en spanning, snaredrum Herzogenrath, speeldoos in de droom, somber, zware drums bij de telling, fluit in de wei, slotspanning met klap op "say".
- Dode stops op 21,14 (who rides with you), 32,85 (11 May 1772) en 53,33 (not one goat).
- Bedden per set: wind en krekels, druppels en fakkelgeknetter, menigte en vogels, wind.
- 98 effecten (98,5 per minuut), 7 in de eerste 3 s, 13 in de laatste 10 s. Nieuw in code: vleugelslag, geblaat, galop, voetstappen, krakend rad, doodsklok, deurklap.
- Mix: -14,0 LUFS, true peak -1,8 dBTP, LRA 2,0 LU, muziek en effecten 18,5 dB onder de stem, 0% clipping.

## Titel en beschrijving
Zie titel_beschrijving.txt.

## Stem
- Harrison (573e5163-59b3-4926-aab1-951ef2985f81), Higgsfield elevenlabs_v4, stabiliteit 0,25, 16 dialoogregels met emotie-tags. 6,21 credits. Job 5f045c65-a796-496a-9380-aaa618d3acfd.
- Ruw 78,6 s. Pauzes boven 0,25 s ingekort (1 pauze van 0,4 s voor "You see"), daarna rubberband-tempo x1,296. Zin 1 niet versneld.
- Tempo gemeten op gesproken woorden (209, jaartallen voluit): 58,79 s van eerste tot laatste woord, 3,555 woorden per seconde.
- "But" op 3,20 s (frame 96). "You see" op 39,33 s (67%).
- Woordtiming: pocketsphinx, 196 van 196 woorden. Uitspraak-hulp in spoken.json (Bokkenrijders = "bock in riders", Kerckhoffs = "kirk offs", Herzogenrath = "hertz oh gun rot").
- Lichte compressie op de stem (3:1 vanaf -26 dB) voor een LRA binnen 1,7 tot 3,2 LU.
- tools/voice/edit_voice.py kreeg 2 optionele argumenten: het woord voor de lange pauze en het laatste woord van zin 1. Zonder die argumenten werkt het als bij 011.

## Beeld
- 12 sets, 34 shots, 59,67 s (1790 frames). Overgangen alleen tussen sets: flash, whip, zoom, ghost, rewind.
- Sets: vliegende bok bij maanlicht, kasboek van de rechtbank, dorp bij nacht, overval op boerderij en kerk plus de duivel, rechters met lantaarns, martelkelder met namenbord, Herzogenrath met kasteel en galg, droom (eed, bok om middernacht, rit boven de bomen), het script van de rechters, galgenveld met teller, lege wei, slot in de kelder.
- Frame 0 beweegt: een bok met vleugels vliegt vanaf de maan naar de lens. Eerste wissel op 1,75 s.
- Nieuwe props in engine/limburg.tsx: bok (met of zonder vleugels), galg, kerk, vakwerkboerderij, kasboek met schrijvende ganzenveer, naamkaartje, maan, heuvel, fakkel, lantaarn, perkamentrol, martelpaal, rad, duivelshorens.
- Namen op het bord zijn verzonnen (JAN, PIETER, ANNA enz.). De rechtbank en het kasboek zijn nagespeeld.

## Teksten
34 pops, Archivo Black, band vanaf y 100 op 1280. Hook: "425 HANGED / FOR THIS?" van frame 0 tot 1,35 s. Volledige lijst in engine/Bok012.tsx (POPS).

## Geluid
- Eigen muziek in code, 120 bpm, 9 delen: nachtdorp (bel en drone), sluipen, mars en spanning, snaredrum Herzogenrath, speeldoos in de droom, somber, zware drums bij de telling, fluit in de wei, slotspanning met klap op "say".
- Dode stops op 21,14 (who rides with you), 32,85 (11 May 1772) en 53,33 (not one goat).
- Bedden per set: wind en krekels, druppels en fakkelgeknetter, menigte en vogels, wind.
- 98 effecten (98,5 per minuut), 7 in de eerste 3 s, 13 in de laatste 10 s. Nieuw in code: vleugelslag, geblaat, galop, voetstappen, krakend rad, doodsklok, deurklap.
- Mix: -14,0 LUFS, true peak -1,8 dBTP, LRA 2,0 LU, muziek en effecten 18,5 dB onder de stem, 0% clipping.

## Titel en beschrijving
Zie titel_beschrijving.txt.

## Beeldplan (concept, tijden volgen na stem-edit)
Vorm: kettingreactie. Elke bekentenis maakt meer gevangenen, een teller loopt op.
| Set | Zinnen | Wat er gebeurt | Overgang |
| --- | --- | --- | --- |
| 1 Maannacht boven Limburg | 1 | Een bok met vleugels vliegt in frame 0 recht op de lens af. Een griffier schrijft "FLYING GOATS" in een boek. | start |
| 2 Dorpsstraat bij nacht | 2 | Dorpelingen kijken omhoog. De lucht is leeg, alleen sterren. | hard cut |
| 3 Dorp in angst | 3 tot 4 | Luiken slaan dicht. Een bende breekt een boerderijdeur en een kerkdeur open. Een schaduw van een duivel deelt bokken uit. | flash |
| 4 Rechtbank Valkenburg | 5 | Rechters met lantaarns trekken eropuit. | whip |
| 5 Martelkamer | 6 tot 8 | Verdachte op een stoel, rechter buigt naar de lens: "who rides with you?". 1 naam wordt 3, wordt 9. Namen vliegen als kaartjes de kamer in. | zoom |
| 6 Herzogenrath | 9 | Chirurgijn Kerckhoffs met dokterstas wordt opgepakt. Galg, datum 11 mei 1772. | ghost |
| 7 Droom van de bekentenis | 10 | Drie gevangenen vertellen hetzelfde: eed, bok om middernacht, rit boven de bomen. | rewind |
| 8 Het script van de rechters | 11 tot 12 | Rechter houdt een kant-en-klaar verhaal vast. De bok blijkt een poppenkast in de martelkamer. | zoom |
| 9 Galgenveld | 13 tot 14 | Teller 1.200 beschuldigd, 425 terechtgesteld. | flash |
| 10 Lege wei | 15 tot 16 | Een gewone bok kauwt gras en kijkt in de lens. De rechter buigt weer naar de lens: "whose name?". | ghost |

## Pop-teksten (concept)
THEY NAMED THEIR FRIENDS (hook) | LIMBURG | 1743 TO 1794 | BOKKENRIJDERS | THE DEVIL | JUDGES | WHO RIDES WITH YOU? | 1 → 3 | 9 MORE | JOSEPH KERCKHOFFS | HERZOGENRATH | 11 MAY 1772 | SAME STORY | TORTURE ROOM | 1,200 ACCUSED | 425 EXECUTED | 0 GOATS | WHOSE NAME?
Kleuren: geel voor jaartallen en aantallen, rood voor terechtgesteld en marteling, wit voor namen.
