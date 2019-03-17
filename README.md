Deze versie ondersteunt inloggen enkel voor gebruikers in configs.js en in de database, dit is momenteel enkel: user "eRepair" met password "test".

Deze versie heb ik nog niet op Combell gekregen en is nog niet echt secure (geen https of jwt voor authenticatie), maar gebruikt wel al de online database van Combell die ook gebruikt wordt door de PWA en Laravel.

Enkele dingen kunnen aangepast worden in configs.js.

Via de endpoint /temptest (tijdelijk als test), kan een testbericht in de database gezet worden, deze kunnen dan uitgelezen worden door de PWA via Laravel.
Deze endpoint controleert nog niet als iemand wel degelijk ingelogd is.

Voor password storage wordt Bcrypt gebruikt.