
export function formatNum(num) {
  if (num >= 1000000000000000000000000000000000000000) { return Math.round(num / 1000000000000000000000000000000000000) / 1000 + " Du"; }
  if (num >= 1000000000000000000000000000000000000) { return Math.round(num / 1000000000000000000000000000000000) / 1000 + " Un"; }
  if (num >= 1000000000000000000000000000000000) { return Math.round(num / 1000000000000000000000000000000) / 1000 + " De"; }
  if (num >= 1000000000000000000000000000000) { return Math.round(num / 1000000000000000000000000000) / 1000 + " No"; }
  if (num >= 1000000000000000000000000000) { return Math.round(num / 1000000000000000000000000) / 1000 + " Oc"; }
  if (num >= 1000000000000000000000000) { return Math.round(num / 1000000000000000000000) / 1000 + " Sp"; }
  if (num >= 1000000000000000000000) { return Math.round(num / 1000000000000000000) / 1000 + " Sx"; }
  if (num >= 1000000000000000000) { return Math.round(num / 1000000000000000) / 1000 + " Qi"; }
  if (num >= 1000000000000000) { return Math.round(num / 1000000000000) / 1000 + " Qa"; }
  if (num >= 1000000000000) { return Math.round(num / 1000000000) / 1000 + " Tr"; }
  if (num >= 1000000000) { return Math.round(num / 1000000) / 1000 + " Bi"; }
  if (num >= 1000000) { return Math.round(num / 1000) / 1000 + " Mi"; }
  return Math.round(num);
} 

var monsters = [
    "pirate", "hawk", "toad", "grizzly bear", "bear",
    "bandit", "spider", "giant", "cobra", "snake", "drunk",
    "bee", "elemental", "ogre", "anaconda", "minion", "arthropode",
    "whale", "cultist", "slug", "tarantula", "skeleton", "insect",
    "vampire", "rodent", "vermin", "gopher", "boar", "swarm", 
    "ghost", "floating eye", "miasma cloud", "beast", "insectoid",
    "dog", "thing", "nightmare", "orc", "giant", "gremlin", "mamba",
    "goblin", "goblinoid", "snail", "worm", "wurm", "drake", "gorilla",
    "merrow", "lamia", "tiger", "mermaid", "unicorn", "horse",
    "hunter", "mole", "imp", "minor demon", "underling", "whatever",
    "automaton", "ghast", "ghoul", "shark", "deer", "blob", 
    "gatekeeper", "spectre", "sorcerer", "severed hand", "parasite",
    "seagull", "ninja", "golem", "parrot", "viper", "mantis", "bat",
    "scorpion", "monolith", "spawn", "terror", "wraith", "devil", 
    "demon", "cloud", "animal", "beetle", "scarab", "ant", "manta",
    "bull", "distortion", "djinn", "manatee", "dolphin", "piranha",
    "mutant", "machine", "android", "ooze", "plant", "vine", "tree",
    "twister", "cannibal", "corpse", "pigeon", "crow", "invader", 
    "monstrosity", "aberration", "trout", "doppelganger", "clone", 
    "crab", "crablike monster", "minotaur", "medusa", "soldier",
    "inquisitor", "molelike thing", "knight", "scammer", "panda",
    "hamster", "dragonspawn", "spider monster", "wormlike beast", 
    "huge board", "animated armor", "wizard", "gelatin", "heap", 
    "illusion", "biker", "critter", "creature", "dwarf", "millipede",
    "body-snatcher", "alien", "lion", "hydra", "locust", "quivering mass",
    "gremlinoid", "hobgoblin", "drow", "assasin", "opposum", "aardvark",
    "tyrant", "dragon", "stalker", "shadow", "shade", "nephilim", 
    "fallen angel", "goat", "warrior", "barbarian", "insectoid", "mammoth",
    "stranger", "living statue", "scoundrel", "ganger", "reptile", 
    "mushroom", "lichen", "living spark", "evil knight", "ruffian",
    "reanimator", "necromancer", "warlock", "diabolist", "mage",
    "monkey", "capibara", "spook", "consuming glob", "devourer", 
    "prophet", "puppet", "tentacle", "hyena", "raptor", "lizard", "lizardfolk",
    "fish person", "tombstone", "mimic", "moth", "mutt", "crocodile", 
    "butcher", "mastodon", "cactus", "floating head", "griffin", "manticore",
    "hippogriff", "fleshbag", "pile of bone", "totem", "spirit", "turtle",
    "tulpa", "inner demon", "thrall", "skinchanger", "shapeshifter",
    "warlord", "overlord", "prawn", "troll", "titan", "sparrow", 
    "dissector", "plasmoid", "amoeba", "crawler", "bug", "scarecrow",
    "cyclops", "nymph", "fish school", "goliath", "ancient", "mannequin",
    "animated broom", "flying sword", "centipede", "ragman", "apparition",
    "armadillo", "quillspike", "urchin", "lemur", "lemure", "owlman", "bunyip",
    "rabbit", "cabbit", "cryptid", "cupacabra", "crustacean", "cephalopod", 
    "pod people", "mollusk", "clam", "giraffe", "chimera", "pigmy", 
    "rooster", "basilisk", "duergar", "pocket monster", "foal", "flea", 
    "gargantua", "mirage", "duck", "gazeebo", "pupa", "illusionist", "magician",
    "murderer", "brute", "mirror-person", "bird-person", "tendril", 
    "executor", "thug", "gangster", "mobster", "mob", "goon", "convict", 
    "lobster", "felon", "malefactor", "hellhound", "hound", "rogue",
    "transgressor", "outlaw", "outcast", "hobo", "wretch", "knave", "kobold",
    "rapscallion", "pariah", "miscreant", "maggot", "larva", "scourge",
    "polyp", "slime", "goo", "sludge", "fiend", "leviathan", "kraken", 
    "abnormal", "savage", "phoenix", "colosus", "centaur", "behemoth", 
    "hellion", "gargoyle", "swine", "varmint", "being", "anoma", "familiar",
    "summoner pet", "marauder", "ravager", "hooligan", "pixie", "gnome", 
    "witch-doctor", "embalmer", "reaper", "ripper", "organ grinder", "flammingo",
    "champion", "brownie", "nixie", "sprite", "leprechaun", "hob", "nightfolk",
    "wendigo", "yeti", "polar bear", "invocation", "ball", "phantasm", "foe",
    "sentinel", "slayer", "hitman", "enforcer", "guerilla", "rival" ,
    "cutthroat", "little devil", "demon lord", "enthusiast", "degenerate",
    "demigod", "kelpie", "idol", "artifact", "exarch", "morphean"
]

var adjectives = [
    "", "giant ", "evil ", "undead ", "glowing ", "monstrous ",
    "tentacled ", "burning ", "mystical ", "normal ", "mysterious ",
    "huge ", "poisonous ", "spectral ", "freezing ", "lightning ",
    "war ", "negative ", "malignant ", "infested ", "radiant ",
    "carnivorous ", "killer ", "assasin ", "swarming ", "hypnotic ",
    "malevolent ", "terrifyng ", "dark ", "venomous ", "flesh-eating ",
    "big ", "large ", "unusual ", "mystifying ", "astral ", "psychic ", 
    "illusionary ", "suspicious ", "digruntled ", "crazed ", "gelatinous ",
    "unliving ", "psychotic ", "blasphemous ", "irritated ", "irradiated ",
    "tormenting ", "serious ", "dangerous ", "burrowing ", "sand ", 
    "jungle ", "arctic ", "desert ", "storm ", "secret ", "brutal ",
    "distorted ", "perturbin ", "thieving ", "scandalous ", "fabulous ",
    "surprise ", "sudden ", "unwelcome ", "triggered ", "ill-advised ",
    "interestinh ", "flying ", "crawling ", "random ", "ugly ", "weird ",
    "huge ", "terrible ", "zombie ", "festering ", "graveyard ", "city ",
    "forest ", "oceanic ", "hellish ", "demonic ", "devilish ", "half-",
    "vengeful ", "enlarged ", "crusty ", "mechanical ", "militarized ",
    "typical ", "unsuspecting ", "rampaging ", "futuristic ", "single-celled ",
    "power-hungry ", "impressive ", "demonclaw ", "venomfang ", "subterranean ",
    "underhanded ", "occultist ", "magical ", "cynical ", "basic ", "two-headed ",
    "trippy ", "complicated ", "suicidal ", "fanatical ", "shadow ", "sinister ",
    "", "technical ", "tormented ", "creepy ", "dedicated ", "rust ",
    "unfair ", "well-rested ", "unwelcoming ", "hungry ", "deadly ", "lethal ",
    "skeletal ", "thorny ", "mud ", "vine-covered ", "horned ", "unassuming ",
    "anti-matter ", "proper ", "reanimated ", "unholy ", "tainted ", "elemental ",
    "normal ", "bloody ", "spike-covered ", "sword-weilding ", "sociopath ",
    "hateful ", "cloned ", "artificial ", "alienated ", "alien ", "dimensional ",
    "flame ", "smoke ", "electric ", "phasing ", "teleporting ", "telepathic ",
    "imaginary ", "daredevil ", "perfected ", "ultimate ", "grand ", "oozing ",
    "butchering ", "saddist ", "cute ", "winged ", "tremendous ", "multi-legged ",
    "arch", "super", "hyper", "anti-", "mega", "nega-", "ultra", "sinister ", 
    "brilliant ", "megalomaniac ", "cursed ", "brutalizing ", "trained ", 
    "impostor ", "clunky ", "well-prepared ", "really bad ", "omni", "hypno", 
    "delicious ", "snapping ", "underwater ", "tundra ", "stylish ", "mad ",
    "uber", "mecha-", "humongous ", "titanic ", "desperate ", "laser-eyed ", "meta-",
    "reanimated ", "returned ", "ensorcelled ", "nihilist ", "destructive ",
    "devastating ", "snow ", "blast ", "assault ", "all-terrain ", "undescribable ",
    "telekinetic ", "soul-bonded ", "nightmarish ", "chitinous ", "non-euclidean ",
    "foul-smelling ", "vampiric ", "languid ", "soft ", "hardened ", "hard-boiled ",
    "foul ", "acid ", "endless ", "ancient ", "elder ", "withered ", "bouncy ",
    "gargantuan ", "unfathomable ", "reincarnated ", "vancian ", "ferocious ", 
    "fearsome ", "radical ", "artistic ", "free-thinking ", "absolute ", "territorial ",
    "torpid ", "sleepwalking ", "syndicalized ", "forebodding ", "fomorian ", 
    "clueless ", "conspiring ", "traitorous ", "axe-weilding ", "four-eyed ", 
    "enhanced ", "superior ", "infernalist ", "computarized ", "fully equipped ",
    "blighted ", "stone ", "metal ", "brass ", "steampunk ", "primitive ",
    "plasma ", "exhuberant ", "gut-wrenching ", "diseased ", "dissecated ",
    "offensive ", "cankerous ", "corrupted ", "rotting ", "standard ",
    "replicated ", "plagued ", "gloating ", "faulty ", "stigmatic ", "epileptic ",
    "impure ", "scalding ", "industrial ", "weaponized ", "explosive ", "bog ", 
    "marsh ", "mountain ", "quicksilver ", "fairy ", "freaky ", "fiendish ",
    "ludicrous ", "aberrant ", "surreal ", "strange ", "grotesque ", "gnarled ",
    "thing that looks like ", "levitating ", "blood-drinking ", "all-consuming ",
    "unending ", "dastardly ", "rocket-powered ", "nano-", "glass ", "crystal ",
    "furious ", "flamigerous ", "synthetic ", "extensive ", "lunar ", "memetic ",
    "morbid ", "elite ", "misbehaving ", "puny ", "impish ", "mini-", "adult ",
    "young ", "stubby ", "oversized ", "elongated ", "strong ", "harsh ", 
    "[CENSORED] ", "troublesome ", "gruesome ", "cold-hearted ", "unfriendly ",
    "fungal ", "muscular ", "impossing ", "loathsome ", "hazardous ", "antagonistic ",
    "special ", "combative ", "malicious ", "avernian ", "soulless ", "chtonic ",
    "reckless ", "ardent ", "stoic ", "callous ", "cruel ", "unsympathetic ",
    "disaffected ", "impatient ", "severe ", "feral ", "wild ", "merciless ",
    "though ", "misleading ", "cackling ", "groundbreaking ", "midnight ", 
    "grinning ", "demon-like ", "draconic ", "shamanistic ", "barbed ", "cyber-",
    "violent ", "slithering ", "spellcasting ", "runic ", "dramatic ", "rabid "   
]

// Generate a random monster name
export function getRandMonster() {
    return adjectives[Math.floor(Math.random() *  adjectives.length)] + 
        monsters[Math.floor(Math.random() *  monsters.length)];
}
