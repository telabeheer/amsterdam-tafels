# 1st github webhost _amsterdamtafels.nl_

## Projectomschrijving
Eerste poging statische website hosten door github met externe domeinprovider (transip) (domein amsterdamtafels.nl)

## Info

### Features
- host: **github**
- domeinprovider: __transip__
- domein: <ins>amsterdamtafel.nl</ins>

## Setup

### TransIP (domeinprovider) setup
- DNS Record
- A-Records 
- redirect

**DNS Record**
Toevoegen bij DNS instellingen van transip (selecteer het gewenste domein dmv links aanvinken) en voeg toe
```
Type: CNAME
Naam: wwww
Waarde: telabeheer.github.io
```

**A-Records** 
Toevoegen bij DNS instellingen van transip, met naam @, type A en volgende GitHub Pages IP’s (apart toevoegen, onder DNS record CNAME)
```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
````
**Redirect**
Je wil dat www.amsterdamtafels.nl en amsterdamtafels.nl beiden naar https://amsterdamtafels.nl leiden. Dit kun je doen door 1 pagina 
te hosten en de andere daarnaar te redirecten. GitHub kan niet gemakkelijk redirecten f (die kan maar één domein targeten).
Maar redirecten kan wel makkelijk in transip. <ins>Redirecten kun je instellen bij heheer van domein op transip dashboard.</ins>
_CloudFare_ tussenproxy is een andere optie voor het directen als het niet lukt via domeinprovider. Via transip geen SSL op redirect, is nadelig. Redirect gaat met transip ook niet over https maar over http, daarom krijg je
met transip soms ssl-warning als je zonder wwww gebruikt in browser.

## GitHub (host) setup
1) maak een repository en zorg dat tenminste index.html aanwezig en eventueel style.css en script.js. Deze bestanden kun je het makkelijkst lokaal maken en in 1x uploaden.
2) maak verder een bestand met de naam CNAME in de root van de repo met enkel de domeinnaam als inhoud die je wilt hosten (bijv www.amsterdamtafels.nl of amsterdamtafels.nl)
3) GitHub Pages inschakelen
Klik op Settings in je repo > Pages (linkermenu).
Bij Source: kies de juiste branch (main of master) en eventueel /root of /docs folder.
Bij Custom domain: vul in www.amsterdamtafels.nl.
**Vink aan: Enforce HTTPS (indien beschikbaar).** Dat is belangrijk. Met dit aangevinkt zou er op github pages moeten staan: Your site is live at http<ins>s</ins>://amsterdamtafels.nl/

## EXTRA
### DNSSEC (Domain Name System Security Extensions)
- Wat: Een uitbreiding op DNS die je domein beveiligt tegen zogeheten DNS spoofing.
- Hoe: Werkt via een digitale handtekening (cryptografisch) die DNS-records ondertekent, zodat de client (browser) zeker weet dat de DNS-info authentiek is.
- Praktisch nut: Beveiliging tegen man-in-the-middle attacks. Belangrijk bij gevoelige sites (login, betalingen).
- Nadeel: Complexer beheer. Kleine kans op down-time als DNSSEC verkeerd is geconfigureerd.
- Aan/uit zetten: In TransIP mogelijk via één klik, maar pas aanzetten als al je records stabiel zijn en je geen DNS-wijzigingen meer verwacht.

## HSTS (HTTP Strict Transport Security)
- Wat: Dwingt browsers om alleen HTTPS te gebruiken voor jouw domein.
- Hoe: Via een response header die de browser instrueert: “Gebruik nooit meer HTTP voor dit domein”.
- Header:
```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```
- Nut: Beschermt tegen protocol downgrade attacks. Verhoogt veiligheid en laadtijd (geen 301 redirect meer nodig naar HTTPS).
- Let op: Zodra geactiveerd, kun je niet makkelijk terug naar HTTP.
GitHub Pages zet automatisch een milde HSTS, maar géén preload. Voor preload (in browsers opgenomen worden) moet je dit zelf expliciet regelen via een custom proxy zoals Cloudflare of een eigen server.

# UITLEG 
## SSL (Secure Sockets Layer, tegenwoordig: TLS, Transport Layer Security)
cryptografisch protocol dat:
- de verbinding tussen client en server versleutelt (encryptie),
- zorgt voor authenticatie van de server (is dit de echte site?),
- en beschermt de integriteit van data (data kan niet worden aangepast onderweg).
Waar herken je het aan?
- Slotje in je browser
- URL begint met https:// in plaats van http://
- Certificaat-informatie beschikbaar in de browser
Voorbeeld:
als je bijvoorbeel wwww.amsterdamtafels bezoekt zonder ssl maak je een http-verbinding met de site. Dat betekent dat iedereen op hetzelfde netwerk alles wat verstuurd wordt kan plakken en lezen (html, formulier inputs, cookies). Met SSL wordt er een https-verbinding gemaakt. Er wordt eerst een ssl-certificaat door de host server verstuurd wat uniek is voor mijn website, wat de browser controleert op geldigheid. de broser en server _onderhandelen_ een versleutelde verbinding (_handshake_ genoemd). alles wordt versleuteld vrzonden. GithUb regelt autmatisch een SSL-certificaat via Let's Encrypt, gekoppeld aan je CNAME DNS. in een SSL-certicaat  bevat een openbare sleutel die gebruikt wordt voor versleuteling. eb verder de domeinnaaaam, uitgever (bijv DigiCert) geldigheid en habndtekening uitgever.
- Check SSL via SSL Labs Test https://www.ssllabs.com/

## DNS (Domain Name System)
Het is het "telefoonboek van het internet" dat domeinnamen omzet in IP-adressen.
DNS staat voor Domain Name System.
Het is het "telefoonboek van het internet" dat domeinnamen omzet in IP-adressen.
Simpel voorbeeld:
Jij typt: www.example.com
Je browser vraagt: Wat is het IP-adres van deze domeinnaam?
DNS geeft terug: 93.184.216.34
Je browser maakt verbinding met dat IP → de server stuurt HTML → jij ziet een website.
Zonder DNS zou je altijd IP-adressen moeten onthouden.

DNS bij een domeinprovider (zoals TransIP)
Als jij een domeinnaam koopt, beheer je in het TransIP DNS-paneel zelf je:
-A-records (waar je site op draait)
-CNAME (voor subdomeinen)
-MX (voor je mail)
-TXT (voor verificatie, bijv. Google Search Console)
-DNSSEC instellingen
Een verkeerde configuratie → je site is offline of mail werkt niet.

 ## DNS caching en TTL
 Stel in afhankelijk van hoe snel je wil kunnen debuggen op transip: debuggen is een uur prima of korter, maar later kun je bijv een dag doen
-TTL = Time To Live: hoe lang een DNS-record geldig blijft in caches.
-Stel TTL = 3600 (seconden) → record wordt 1 uur gecached.
-Lage TTL (bijv. 60) handig bij migraties.
-Hoge TTL (bijv. 86400) handig bij stabiele config (minder load, sneller).

## transip nameservers (	Server die verantwoordelijk is voor het uitdelen van jouw DNS-records)
Hiermee bepaal je wie je dns records beheert. bijv transip zelf of als je en tussenproxy wil gebruiken zoals cloudfare hier wijzigen
transip nameservers: transIP NS:
```
	ns1.transip.net, ns2.transip.net, ns3.transip.net
```
## Spoofing
“Spoofing is het vervalsen van digitale identiteit of herkomst in een netwerkverkeer- of communicatieproces.”

# TO DO
## SEO Search Engine Optimization
## DNS email
```
@     TXT    v=spf1 include:_spf.transip.email ~all
@     MX     10 mail.transip.email
```

Some basic Git commands are:
```
git status
git add
git commit
```

