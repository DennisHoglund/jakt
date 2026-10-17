# Jaktvind

Steg 1 av jaktappen: vindriktning, vindstyrka, byar och vittring för din position, med kompass och prognos för de kommande 6 timmarna.

- Väderdata: Open-Meteo (gratis, ingen nyckel). Prognosen sparas i telefonen och fungerar offline resten av dagen.
- Kompass: telefonens magnetometer. På iPhone måste du trycka "Aktivera kompass" en gång.
- Testa på datorn utan GPS: lägg till `?demo` i adressen.

## Publicera med GitHub Pages

1. Skapa ett publikt repo på github.com, till exempel `jaktvind`.
2. Ladda upp alla filer i mappen till repots rot (Add file › Upload files).
3. Gå till Settings › Pages och välj Branch `main`, mapp `/ (root)`. Spara.
4. Efter någon minut ligger appen på `https://<ditt-användarnamn>.github.io/jaktvind/`.

## Installera på iPhone

1. Öppna adressen i Safari.
2. Tryck Dela › Lägg till på hemskärmen.
3. Starta från ikonen, tillåt plats och tryck "Aktivera kompass".

Platstjänster och kompass kräver https, så appen fungerar inte om du öppnar filen direkt från disk.

## Molnsynk av loggen (Supabase)

Loggen sparas alltid i telefonen först och skickas till Supabase när du är inloggad och har täckning.

Engångsinställning i Supabase-projektet:
1. **SQL Editor → New query**: klistra in `supabase/schema.sql` och tryck **Run**.
2. **Authentication → Users → Add user → Create new user**: e-post och lösenord, kryssa i *Auto Confirm User*.
3. **Authentication → Sign In / Providers**: stäng av *Allow new users to sign up*.

Projektets URL och publika nyckel ligger i `config.js`. Den publika nyckeln får ligga öppet: RLS gör att
bara inloggade användare kommer åt data, och var och en bara sina egna poster.
