# Esquema de extracción de fichas PNJ (plan 6)
Un archivo JSON por libro: { "book": "...", "pdf": "<ruta>", "pageConvention": "...", "npcs": [ ... ] }
Cada NPC:
{
  "id": "kebab-case con prefijo del libro: core-, cemk-, hardened-, dg-",
  "name": "exacto como en el libro",
  "subtitle": "descriptor corto del libro (o '')",
  "sourcePage": <número de página IMPRESA>,
  "tier": "mook|hardened_mook|lieutenant|hardened_lieutenant|mini_boss|hardened_mini_boss|boss|hardened_boss|cyberpsycho",
  "faction": "texto del libro o ''",
  "role": "Solo|Netrunner|Tech|Medtech|Media|Exec|Lawman|Fixer|Nomad|Rockerboy|'' (como el libro)",
  "roleAbility": { "name": "...", "rank": N } | null,
  "level": N | null, "rep": N | null,
  "stats": { "INT":N, "REF":N, "DEX":N, "TECH":N, "COOL":N, "WILL":N, "LUCK":N|null, "MOVE":N, "BODY":N, "EMP":N },
  "statsArmorModified": { "REF":N, ... } | null,   // valores entre paréntesis si el libro los imprime
  "hp": N, "seriouslyWounded": N, "deathSave": N,
  "armor": { "name": "...", "headSp": N, "bodySp": N, "headSpVsMelee": N|null, "bodySpVsMelee": N|null, "penalty": "..."|null },
  "weapons": [ { "name": "...", "skill": "...", "skillBase": N, "damage": "3d6", "rof": N, "mag": N|null, "ammo": "..."|null, "quality": "Poor|Standard|Excellent|null", "weaponType2077": "Power|Smart|Tech|null (solo si el libro lo dice)", "notes": "..." } ],
  "skillBases": { "Brawling": N, "Evasion": N, ... },
  "cyberware": [ "nombre exacto, con opciones" ],
  "gear": [ "..." ],
  "isNetrunner": bool, "interfaceRank": N|null,
  "cyberdeckPrograms": [ "..." ],          // RED
  "hasNeuroport": bool|null,                // solo CEMK nativo
  "selfIce": N|null,                        // cantidad de Passwalls si el libro lo dice
  "quickhacks": [ "..." ],                  // solo CEMK nativo, si los lista
  "specialRules": [ "paráfrasis precisa en español de reglas especiales/habilidades del bloque, con números" ],
  "lore": "1-2 frases en español parafraseando la descripción (no copiar texto largo)",
  "doubts": [ "cualquier número dudoso o atribución inferida" ]
}
Reglas: nada inventado; si un campo no está en el libro va null/[]; verificar dígitos rotos por la extracción ("1 1" = 11); HP y Death Save tal como los imprime el libro.
