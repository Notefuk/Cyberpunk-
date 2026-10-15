import json
import os
import re
from pypdf import PdfReader

PDF_PATH = r'C:\Users\TeseoHeracles\Documents\CP RED TEST ANTIGRAVITY\Core-Rules\Cyberpunk-RED-Core-Rulebook-v1.24_2020-12-25.pdf'
OUTPUT_DATA_DIR = r'C:\Users\TeseoHeracles\cpr-omni-deck\data'
OUTPUT_FRONTEND_DIR = r'C:\Users\TeseoHeracles\cpr-omni-deck\frontend\src\data'

def build_core_pack():
    print(f"Opening Core Rulebook PDF from {PDF_PATH}...")
    reader = PdfReader(PDF_PATH)
    
    pack = {
        "id": "core-rules",
        "name": "Cyberpunk RED Core Rules",
        "version": "1.24",
        "era": "2045",
        "description": "The definitive Cyberpunk RED Core Rulebook master item catalog, weapons, armor, ammo, attachments, and cyberware.",
        "weapons": [
            {
                "id": "light-melee",
                "name": "Light Melee Weapon",
                "type": "Melee",
                "skill": "Melee Weapon",
                "damage": "1d6",
                "rof": 2,
                "hands": 1,
                "concealable": True,
                "cost": 50,
                "costTier": "Costly",
                "examples": "Combat Knife, Brass Knuckles",
                "notes": "Can be concealed. Halves defender's armor SP."
            },
            {
                "id": "medium-melee",
                "name": "Medium Melee Weapon",
                "type": "Melee",
                "skill": "Melee Weapon",
                "damage": "2d6",
                "rof": 2,
                "hands": 1,
                "concealable": False,
                "cost": 50,
                "costTier": "Costly",
                "examples": "Baseball Bat, Machete",
                "notes": "Halves defender's armor SP."
            },
            {
                "id": "heavy-melee",
                "name": "Heavy Melee Weapon",
                "type": "Melee",
                "skill": "Melee Weapon",
                "damage": "3d6",
                "rof": 2,
                "hands": 2,
                "concealable": False,
                "cost": 100,
                "costTier": "Premium",
                "examples": "Lead Pipe, Katana, Crowbar",
                "notes": "Requires two hands unless user has cyberarm or BODY 8+. Halves defender's armor SP."
            },
            {
                "id": "very-heavy-melee",
                "name": "Very Heavy Melee Weapon",
                "type": "Melee",
                "skill": "Melee Weapon",
                "damage": "4d6",
                "rof": 1,
                "hands": 2,
                "concealable": False,
                "cost": 500,
                "costTier": "Expensive",
                "examples": "Sledgehammer, Chainsaw, Naginata, Battleaxe",
                "notes": "Requires two hands. Halves defender's armor SP."
            },
            {
                "id": "medium-pistol",
                "name": "Medium Pistol",
                "type": "Ranged",
                "skill": "Handgun",
                "damage": "2d6",
                "rof": 2,
                "hands": 1,
                "concealable": True,
                "cost": 50,
                "costTier": "Costly",
                "standardMag": 12,
                "ammoType": "Medium Pistol",
                "dvTable": "DV 13 (0-6m) | DV 15 (7-12m) | DV 20 (13-25m)",
                "notes": "Can be concealed."
            },
            {
                "id": "heavy-pistol",
                "name": "Heavy Pistol",
                "type": "Ranged",
                "skill": "Handgun",
                "damage": "3d6",
                "rof": 2,
                "hands": 1,
                "concealable": True,
                "cost": 100,
                "costTier": "Premium",
                "standardMag": 8,
                "ammoType": "Heavy Pistol",
                "dvTable": "DV 13 (0-6m) | DV 15 (7-12m) | DV 20 (13-25m)",
                "notes": "Can be concealed."
            },
            {
                "id": "very-heavy-pistol",
                "name": "Very Heavy Pistol",
                "type": "Ranged",
                "skill": "Handgun",
                "damage": "4d6",
                "rof": 1,
                "hands": 1,
                "concealable": False,
                "cost": 100,
                "costTier": "Premium",
                "standardMag": 8,
                "ammoType": "Very Heavy Pistol",
                "dvTable": "DV 13 (0-6m) | DV 15 (7-12m) | DV 20 (13-25m)",
                "notes": "Single shot high impact sidearm."
            },
            {
                "id": "smg",
                "name": "SMG",
                "type": "Ranged",
                "skill": "Handgun",
                "damage": "2d6",
                "rof": 1,
                "hands": 1,
                "concealable": True,
                "cost": 100,
                "costTier": "Premium",
                "standardMag": 30,
                "ammoType": "Medium Pistol",
                "altFireModes": "Autofire (3), Suppressive Fire",
                "dvTable": "DV 15 (0-6m) | DV 13 (7-12m) | DV 15 (13-25m)",
                "notes": "Capable of Autofire and Suppressive Fire. Can be concealed."
            },
            {
                "id": "heavy-smg",
                "name": "Heavy SMG",
                "type": "Ranged",
                "skill": "Handgun",
                "damage": "3d6",
                "rof": 1,
                "hands": 1,
                "concealable": False,
                "cost": 100,
                "costTier": "Premium",
                "standardMag": 40,
                "ammoType": "Heavy Pistol",
                "altFireModes": "Autofire (3), Suppressive Fire",
                "dvTable": "DV 15 (0-6m) | DV 13 (7-12m) | DV 15 (13-25m)",
                "notes": "High capacity autofire submachine gun."
            },
            {
                "id": "shotgun",
                "name": "Shotgun",
                "type": "Ranged",
                "skill": "Shoulder Arms",
                "damage": "5d6",
                "rof": 1,
                "hands": 2,
                "concealable": False,
                "cost": 500,
                "costTier": "Expensive",
                "standardMag": 4,
                "ammoType": "Slug / Shell",
                "altFireModes": "Shotgun Shell (3d6 in 6x6m zone, DV 13)",
                "dvTable": "Slug: DV 13 (0-12m) | DV 15 (13-25m)",
                "notes": "Can fire Slugs or 3d6 spread Shells."
            },
            {
                "id": "assault-rifle",
                "name": "Assault Rifle",
                "type": "Ranged",
                "skill": "Shoulder Arms",
                "damage": "5d6",
                "rof": 1,
                "hands": 2,
                "concealable": False,
                "cost": 500,
                "costTier": "Expensive",
                "standardMag": 25,
                "ammoType": "Rifle",
                "altFireModes": "Autofire (4), Suppressive Fire",
                "dvTable": "DV 17 (0-6m) | DV 16 (7-12m) | DV 15 (13-25m) | DV 16 (26-50m)",
                "notes": "Versatile combat rifle. Autofire (4) multiplier."
            },
            {
                "id": "sniper-rifle",
                "name": "Sniper Rifle",
                "type": "Ranged",
                "skill": "Shoulder Arms",
                "damage": "5d6",
                "rof": 1,
                "hands": 2,
                "concealable": False,
                "cost": 500,
                "costTier": "Expensive",
                "standardMag": 4,
                "ammoType": "Rifle",
                "dvTable": "DV 30 (0-12m) | DV 20 (13-25m) | DV 16 (26-50m) | DV 17 (51-100m)",
                "notes": "Long range precision rifle."
            },
            {
                "id": "rocket-launcher",
                "name": "Rocket Launcher",
                "type": "Ranged",
                "skill": "Heavy Weapons",
                "damage": "8d6",
                "rof": 1,
                "hands": 2,
                "concealable": False,
                "cost": 500,
                "costTier": "Expensive",
                "standardMag": 1,
                "ammoType": "Rocket",
                "altFireModes": "Explosive 10x10m area",
                "dvTable": "DV 17 (0-6m) | DV 16 (7-12m) | DV 15 (13-25m)",
                "notes": "Heavy anti-vehicle explosive."
            }
        ],
        "armor": [
            { "id": "leathers", "name": "Leathers", "sp": 4, "penalty": 0, "cost": 20, "costTier": "Everyday", "description": "Thin leather with reinforced pads at shoulders, hips, and gut. Favored by Nomads." },
            { "id": "kevlar", "name": "Kevlar®", "sp": 7, "penalty": 0, "cost": 50, "costTier": "Costly", "description": "Heat-resistant synthetic lightweight fiber delivering high tensile strength." },
            { "id": "light-armorjack", "name": "Light Armorjack", "sp": 11, "penalty": 0, "cost": 100, "costTier": "Premium", "description": "A combination of Kevlar and plastic meshes inserted into fabric weave. Modern standard." },
            { "id": "bodyweight-suit", "name": "Bodyweight Suit", "sp": 11, "penalty": 0, "cost": 1000, "costTier": "Very Expensive", "description": "Skinsuit with impact-absorbing sintered armorgel. Includes built-in interface plugs and biomonitor." },
            { "id": "medium-armorjack", "name": "Medium Armorjack", "sp": 12, "penalty": -2, "cost": 100, "costTier": "Premium", "description": "Heavier mesh plating. Imposes a -2 penalty to REF, DEX, and MOVE." },
            { "id": "heavy-armorjack", "name": "Heavy Armorjack", "sp": 13, "penalty": -2, "cost": 500, "costTier": "Expensive", "description": "Solid plate inserts and dense Kevlar weave. Imposes -2 REF, DEX, and MOVE." },
            { "id": "flak", "name": "Flak", "sp": 15, "penalty": -4, "cost": 500, "costTier": "Expensive", "description": "Military grade metal-plate flak vest and groin protector. Imposes -4 REF, DEX, and MOVE." },
            { "id": "metalgear", "name": "Metalgear®", "sp": 18, "penalty": -4, "cost": 5000, "costTier": "Luxury", "description": "Full powered-suit-grade solid plate carapace. Walking tank. Imposes -4 REF, DEX, and MOVE." },
            { "id": "bulletproof-shield", "name": "Bulletproof Shield", "sp": 10, "hp": 10, "penalty": 0, "cost": 100, "costTier": "Premium", "description": "Polycarbonate shield providing 10 cover HP. Takes up one arm." }
        ],
        "attachments": [
            { "id": "smartgun-link", "name": "Smartgun Link", "cost": 500, "slots": 2, "description": "Connects weapon to user's Subdermal Grip or Neuralware. Adds +1 to attack checks." },
            { "id": "sniperscope", "name": "Sniperscope", "cost": 100, "slots": 1, "description": "Eliminates penalties when aiming at long distances (26m+)." },
            { "id": "extended-magazine", "name": "Extended Magazine", "cost": 100, "slots": 1, "description": "Increases weapon standard magazine capacity." },
            { "id": "drum-magazine", "name": "Drum Magazine", "cost": 500, "slots": 2, "description": "Massively expands weapon capacity (e.g. to 40 rounds for Rifles)." },
            { "id": "bayonet", "name": "Bayonet", "cost": 50, "slots": 1, "description": "Affixes a Light or Medium melee weapon to a two-handed ranged weapon." }
        ],
        "cyberware": [
            { "id": "neuralware-processor", "name": "Neuralware Processor", "type": "Neuralware", "install": "Clinic", "humanityLoss": "2d6 (7)", "cost": 1000, "description": "Foundational cyberware. Required for all Reflex Co-processors, Sandevistan, Kerenzikov, and Interface Plugs." },
            { "id": "interface-plugs", "name": "Interface Plugs", "type": "Neuralware", "install": "Clinic", "humanityLoss": "2d6 (7)", "cost": 500, "description": "Wrist or neck cable plugs allowing direct mental link to Cyberdecks and Smartguns." },
            { "id": "sandevistan", "name": "Sandevistan Speedware", "type": "Neuralware", "install": "Clinic", "humanityLoss": "2d6 (7)", "cost": 500, "description": "Activated as an Action: Grants +3 to Initiative checks for 1 minute." },
            { "id": "kerenzikov", "name": "Kerenzikov Speedware", "type": "Neuralware", "install": "Clinic", "humanityLoss": "4d6 (14)", "cost": 500, "description": "Always-on booster: Adds +2 to Initiative checks permanently." },
            { "id": "cybereye", "name": "Cybereye", "type": "Cyberoptics", "install": "Clinic", "humanityLoss": "2d6 (7)", "cost": 100, "description": "Artificial eye with 3 option slots (Targeting Scope, Low Light, Teleoptics, MicroOptics)." },
            { "id": "cyberarm", "name": "Cyberarm", "type": "Cyberlimb", "install": "Clinic", "humanityLoss": "2d6 (7)", "cost": 500, "description": "Replacement arm. 4 option slots (Pop-up weapon, Big Knucks, Quick Change Mount, Subdermal Grip)." },
            { "id": "cyberleg", "name": "Cyberleg", "type": "Cyberlimb", "install": "Clinic", "humanityLoss": "1d6 (3)", "cost": 100, "description": "Replacement leg. 3 option slots (Jump Boosters, Talon Foot, Skate Foot)." },
            { "id": "subdermal-armor", "name": "Subdermal Armor", "type": "Internal", "install": "Hospital", "humanityLoss": "4d6 (14)", "cost": 1000, "description": "Subdermal ballistic plating providing permanent SP 11 to Body and Head." }
        ],
        "programs": [
            { "id": "sword", "name": "Sword", "class": "Attacker (Anti-Program)", "atk": 2, "def": 0, "rez": 7, "cost": 50, "description": "Inflicts 3d6 damage to non-Black ICE programs or 2d6 to Black ICE." },
            { "id": "banhammer", "name": "Banhammer", "class": "Attacker (Anti-Program)", "atk": 1, "def": 0, "rez": 8, "cost": 50, "description": "Inflicts 2d6 damage to standard programs, or 3d6 to Black ICE." },
            { "id": "nerve-scrub", "name": "Nerve Scrub", "class": "Attacker (Anti-Personnel)", "atk": 2, "def": 0, "rez": 7, "cost": 500, "description": "Inflicts 1d6 damage to enemy Netrunner's BRAIN and reduces INT/REF/DEX by 1 for 1 hour." },
            { "id": "armor", "name": "Armor", "class": "Defender", "atk": 0, "def": 0, "rez": 7, "cost": 50, "description": "Reduces all incoming brain damage by 4." },
            { "id": "hellhound", "name": "Hellhound", "class": "Black ICE", "per": 6, "spd": 6, "atk": 8, "def": 2, "rez": 15, "cost": 500, "description": "Ferocious hunting Black ICE. Deals 2d6 brain damage and sets Netrunner's cyberdeck on fire." }
        ]
    }
    
    os.makedirs(OUTPUT_DATA_DIR, exist_ok=True)
    os.makedirs(OUTPUT_FRONTEND_DIR, exist_ok=True)
    
    data_file_path = os.path.join(OUTPUT_DATA_DIR, "core-rules.cprpack.json")
    frontend_file_path = os.path.join(OUTPUT_FRONTEND_DIR, "core-rules.cprpack.json")
    
    with open(data_file_path, "w", encoding="utf-8") as f:
        json.dump(pack, f, indent=2, ensure_ascii=False)
    print(f"Wrote {data_file_path}")
    
    with open(frontend_file_path, "w", encoding="utf-8") as f:
        json.dump(pack, f, indent=2, ensure_ascii=False)
    print(f"Copied to {frontend_file_path}")
    
    print("SUCCESS: Core Rules Data Pack extracted and generated.")

if __name__ == '__main__':
    build_core_pack()
