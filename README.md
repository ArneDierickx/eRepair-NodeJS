Deze versie ondersteunt inloggen enkel voor gebruikers in configs.js en in de database, dit is momenteel enkel: user "eRepair" met password "test".

Er wordt gebruik gemaakt van de online Combell database voor alle data.

Voor authenticatie wordt JWT (json web token) gebruikt om te controleren of een binnenkomende request van een geauthenticeerde gebruiker is.
Hiervoor worden de files private.key en public.key gebruikt.
Voor de "beschermde" endpoints is er middleware geschreven die de token verifieert en wanneer dit ok is de eigenlijke endpoint logica uitvoert.

Er is een validator die user input verifieert. Nu is deze zeer basis, maar deze kan gemakkelijk uitgebreid worden.

Enkele dingen kunnen aangepast worden in configs.js.

Voor password verificatie wordt Bcrypt gebruikt.

De API stuurt aangepaste error berichten en codes terug wanneer iets fout loopt.