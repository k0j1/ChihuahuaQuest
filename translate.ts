import fs from "fs";

let content = fs.readFileSync('services/geminiService.ts', 'utf8');

const tMap: Record<string, { nameEn: string, descEn: string }> = {
  // UNIQUE
  "欠けたルーン石": { nameEn: "Chipped Runestone", descEn: "A stone that has lost its power." },
  "古びた鍵": { nameEn: "Old Key", descEn: "What door does this open?" },
  "サビたナイフ": { nameEn: "Rusty Knife", descEn: "No longer usable." },
  "ただの木の実": { nameEn: "Just a Nut", descEn: "An inedible nut." },
  "泥だらけの靴": { nameEn: "Muddy Boots", descEn: "Someone's rubber boots." },
  "ボロボロの鎖": { nameEn: "Tattered Chain", descEn: "Used to bind something." },
  "謎の歯車": { nameEn: "Mysterious Cog", descEn: "Part of an ancient machine." },
  "割れた杯": { nameEn: "Broken Chalice", descEn: "A chalice that was once beautiful." },
  "すすけたガラス玉": { nameEn: "Sooty Glass Ball", descEn: "Glows faintly." },
  "古い地図の切れ端": { nameEn: "Old Map Fragment", descEn: "Useless on its own." },
  "ただの石ころ": { nameEn: "Just a Pebble", descEn: "A common pebble." },
  "奇妙な根っこ": { nameEn: "Strange Root", descEn: "Might be an ingredient for potions." },
  "かすかな光の粉": { nameEn: "Faint Light Powder", descEn: "Leftover dust from a fairy." },
  "真鍮の指輪": { nameEn: "Brass Ring", descEn: "A cheap ring." },
  "曲がった釘": { nameEn: "Bent Nail", descEn: "Used for construction." },
  "枯れた薬草": { nameEn: "Withered Herb", descEn: "Doesn't seem effective." },
  "魔導書の破れ紙": { nameEn: "Torn Grimoire Page", descEn: "Undecipherable text." },
  "壊れた方位磁針": { nameEn: "Broken Compass", descEn: "Doesn't point North." },
  "鉄くず": { nameEn: "Scrap Iron", descEn: "Can be melted down for use." },
  "割れた瓶": { nameEn: "Broken Bottle", descEn: "Can't hold anything inside." },
  "動物の骨": { nameEn: "Animal Bone", descEn: "Seems to be a beast's bone." },
  "銅貨": { nameEn: "Copper Coin", descEn: "Coin from an unfamiliar country." },
  "銀貨": { nameEn: "Silver Coin", descEn: "A somewhat valuable silver coin." },
  "金貨": { nameEn: "Gold Coin", descEn: "A gold coin that hasn't lost its shine." },
  "黒い羽": { nameEn: "Black Feather", descEn: "An eerie feather, not from a crow." },
  "トロールの角": { nameEn: "Troll Horn", descEn: "Sells for surprisingly high." },
  "オークの牙": { nameEn: "Orc Fang", descEn: "Can be used as an ornament." },
  "ゴブリンの耳": { nameEn: "Goblin Ear", descEn: "Proof of subjugation." },
  "スライムの水滴": { nameEn: "Slime Drop", descEn: "Feels chilly." },
  "コウモリの翼": { nameEn: "Bat Wing", descEn: "Usable in alchemy." },
  "小さな水晶": { nameEn: "Small Crystal", descEn: "Slightly imbued with magic." },
  "魔獣の皮": { nameEn: "Beast Pelt", descEn: "Sturdy leather." },
  "大きなアメジスト": { nameEn: "Large Amethyst", descEn: "A beautiful purple gem." },
  "トパーズ": { nameEn: "Topaz", descEn: "A gleaming yellow gem." },
  "サファイア": { nameEn: "Sapphire", descEn: "A deep blue gem." },
  "エメラルド": { nameEn: "Emerald", descEn: "A beautiful green gem." },
  "ルビー": { nameEn: "Ruby", descEn: "A passionate red gem." },
  "ダイヤモンド": { nameEn: "Diamond", descEn: "The finest brilliance." },
  "黒曜石": { nameEn: "Obsidian", descEn: "Volcanic glass with a sharp edge." },
  "ミスリル鉱石": { nameEn: "Mithril Ore", descEn: "A phantom metal, light and durable." },
  "オリハルコン鉱石": { nameEn: "Orichalcum Ore", descEn: "Legendary metal said to be the hardest." },
  "アダマンタイト": { nameEn: "Adamantite", descEn: "Ore said to be created by gods." },
  "銀の延べ棒": { nameEn: "Silver Ingot", descEn: "A heavy silver ingot." },
  "金の延べ棒": { nameEn: "Gold Ingot", descEn: "A gold ingot shimmering brightly." },
  "プラチナ貨": { nameEn: "Platinum Coin", descEn: "High-denomination currency of a lost kingdom." },
  "古代の金貨袋": { nameEn: "Ancient Coin Bag", descEn: "A heavy bag full of coins." },
  "精霊のランプ": { nameEn: "Spirit Lamp", descEn: "Faintly warm." },
  "魔法の薬瓶": { nameEn: "Magic Potion Bottle", descEn: "Contains a suspicious liquid." },
  "天使の羽根": { nameEn: "Angel Feather", descEn: "An extremely light, pure white feather." },
  "龍のウロコ": { nameEn: "Dragon Scale", descEn: "Said to be harder than iron." },
  "星の砂": { nameEn: "Star Sand", descEn: "Mysterious sand twinkling like the night sky." },
  "古代ルーン石": { nameEn: "Ancient Runestone", descEn: "A stone tablet inscribed with mysterious runes." },
  "綺麗な貝殻": { nameEn: "Pretty Shell", descEn: "You can hear the ocean's sound." },
  "古代の土偶": { nameEn: "Ancient Clay Figure", descEn: "A weirdly shaped earthenware." },
  "謎の石版": { nameEn: "Mysterious Tablet", descEn: "Inscribed with unreadable ancient letters." },
  "アンモナイトの化石": { nameEn: "Ammonite Fossil", descEn: "A romance of prehistoric times." },
  "錬金術師の石": { nameEn: "Alchemist's Stone", descEn: "An unknown ore glowing eerily red." },
  "隕石の欠片": { nameEn: "Meteorite Fragment", descEn: "A gift from space." },
  "琥珀（虫入り）": { nameEn: "Amber (with bug)", descEn: "A gem trapping prehistoric secrets." },
  "黄金のスカラベ": { nameEn: "Golden Scarab", descEn: "An ornament from Ancient Egypt." },
  "サファイアのブローチ": { nameEn: "Sapphire Brooch", descEn: "An ornament with beautiful deep blue." },
  "真珠のネックレス": { nameEn: "Pearl Necklace", descEn: "Muddy, but genuine." },
  "ダイヤの指輪": { nameEn: "Diamond Ring", descEn: "A very beautiful brilliance." },
  "金の王冠": { nameEn: "Golden Crown", descEn: "Proof of a lost kingdom." },
  "懐中時計": { nameEn: "Pocket Watch", descEn: "The hands are stopped." },
  "金の杯": { nameEn: "Golden Chalice", descEn: "Too luxurious just to drink water." },
  "ガラスの靴": { nameEn: "Glass Slipper", descEn: "A clear, transparent shoe." },
  "エルフの弓": { nameEn: "Elven Bow", descEn: "Adorned with exquisite decorations." },
  "モアイ像": { nameEn: "Moai Statue", descEn: "Why is there a mini Moai here?" },
  "魔法のランプ": { nameEn: "Magic Lamp", descEn: "No genie comes out even if rubbed." },
  "招き猫": { nameEn: "Maneki-neko", descEn: "Seems to bring good luck." },
  "太陽の紋章": { nameEn: "Sun Crest", descEn: "Emitting heat." },
  "月の首飾り": { nameEn: "Moon Necklace", descEn: "Glows in the dark." },
  "海賊の宝箱": { nameEn: "Pirate's Chest", descEn: "Requires a key to open." },
  "勇者の剣": { nameEn: "Hero's Sword", descEn: "Said to have defeated the Demon King." },
  "聖騎士の盾": { nameEn: "Paladin's Shield", descEn: "Repels all evil." },
  "大魔導士の杖": { nameEn: "Archmage's Staff", descEn: "Holds immense magical power." },
  "フェニックスの尾": { nameEn: "Phoenix Down", descEn: "Awakens life." },
  "賢者の石": { nameEn: "Philosopher's Stone", descEn: "Turns all matter into gold." },
  "星の羅針盤": { nameEn: "Star Compass", descEn: "Shows the destination of destiny." },
  "白銀のティアラ": { nameEn: "Silver Tiara", descEn: "A princess's forgotten item." },
  "死霊術士の頭骨": { nameEn: "Necromancer's Skull", descEn: "Radiates an ominous aura." },
  "妖魔の笛": { nameEn: "Phantom Flute", descEn: "Attracts monsters when played." },
  "大地のクリスタル": { nameEn: "Earth Crystal", descEn: "Filled with the power of nature." },
  "火炎のルビー": { nameEn: "Flame Ruby", descEn: "Looks like it will burn you if touched." },
  "氷結のサファイア": { nameEn: "Freezing Sapphire", descEn: "Lowers the surrounding temperature." },
  "迅雷のトパーズ": { nameEn: "Thunder Topaz", descEn: "Emits small bolts of lightning." },
  "神聖なる聖杯": { nameEn: "Holy Grail", descEn: "Spills water that heals any wound." },
  "次元の鍵": { nameEn: "Dimensional Key", descEn: "Opens a door to another world." },
  "世界樹の葉": { nameEn: "Yggdrasil Leaf", descEn: "Possesses miraculous healing power." },
  "ユニコーンの角": { nameEn: "Unicorn Horn", descEn: "Purifies all poisons." },
  "ドラゴンの卵": { nameEn: "Dragon Egg", descEn: "A little warm." },
  "王家の印章": { nameEn: "Royal Seal", descEn: "Shows immense authority." },
  "空飛ぶ絨毯": { nameEn: "Flying Carpet", descEn: "Just an old carpet for now." },
  "禁断の魔導書": { nameEn: "Forbidden Grimoire", descEn: "Must not be opened." },
  "光の剣": { nameEn: "Sword of Light", descEn: "Cleaves through the darkness." },
  "闇の盾": { nameEn: "Shield of Darkness", descEn: "Swallows the light." },
  "伝説のメダル": { nameEn: "Legendary Medal", descEn: "Proof of a chosen hero." },
  "聖龍の涙": { nameEn: "Sacred Dragon's Tear", descEn: "The ultimate gem." },
  "女神の指輪": { nameEn: "Goddess Ring", descEn: "Boosts all stats." },

  // BASE
  "ショートソード": { nameEn: "Short Sword", descEn: "A basic sword." },
  "ロングソード": { nameEn: "Long Sword", descEn: "A sword with a long reach." },
  "ダガー": { nameEn: "Dagger", descEn: "A short blade." },
  "バックラー": { nameEn: "Buckler", descEn: "A small shield." },
  "カイトシールド": { nameEn: "Kite Shield", descEn: "A knight's shield." },
  "ウッドボウ": { nameEn: "Wood Bow", descEn: "A wooden bow." },
  "クロスボウ": { nameEn: "Crossbow", descEn: "A powerful bowstring." },
  "スタッフ": { nameEn: "Staff", descEn: "A wizard's staff." },
  "ワンド": { nameEn: "Wand", descEn: "Gathers magical power." },
  "メイス": { nameEn: "Mace", descEn: "A blunt weapon." },
  "スピア": { nameEn: "Spear", descEn: "A thrusting polearm." },
  "ハルバード": { nameEn: "Halberd", descEn: "A poleaxe." },
  "レザーアーマー": { nameEn: "Leather Armor", descEn: "Armor made of leather." },
  "チェインメイル": { nameEn: "Chain Mail", descEn: "Linked chain armor." },
  "プレートアーマー": { nameEn: "Plate Armor", descEn: "Iron armor." },
  "アイアンヘルム": { nameEn: "Iron Helm", descEn: "An iron helmet." },
  "ガントレット": { nameEn: "Gauntlet", descEn: "Arm guards." },
  "マント": { nameEn: "Mantle", descEn: "Catches the wind." },
  "ブーツ": { nameEn: "Boots", descEn: "Traveler's boots." },
  "ポーション": { nameEn: "Potion", descEn: "Healing medicine." },
  "エーテル": { nameEn: "Ether", descEn: "Mana recovery medicine." },
  "エリクサー": { nameEn: "Elixir", descEn: "A panacea." },
  "魔導書": { nameEn: "Grimoire", descEn: "A book of magic." },
  "古文書": { nameEn: "Ancient Text", descEn: "An old record." },
  "アミュレット": { nameEn: "Amulet", descEn: "A protective charm." },
  "リング": { nameEn: "Ring", descEn: "A wearable band." },
  "ネックレス": { nameEn: "Necklace", descEn: "Neck ornament." },
  "ピアス": { nameEn: "Earring", descEn: "Ear ornament." },
  "魔石": { nameEn: "Magic Stone", descEn: "A stone concealing magic." },
  "ルーンストーン": { nameEn: "Runestone", descEn: "A stone carved with letters." },
  "クリスタル": { nameEn: "Crystal", descEn: "A clear quartz." },
  "鉄鉱石": { nameEn: "Iron Ore", descEn: "Raw material for iron." },
  "銀鉱石": { nameEn: "Silver Ore", descEn: "Raw material for silver." },
  "金鉱石": { nameEn: "Gold Ore", descEn: "Raw material for gold." },
  "宝箱": { nameEn: "Treasure Chest", descEn: "The box itself." },
  "金貨袋": { nameEn: "Coin Bag", descEn: "Contains money." },
  "王冠": { nameEn: "Crown", descEn: "Proof of a king." },
  "ティアラ": { nameEn: "Tiara", descEn: "Proof of a princess." },
  "聖杯": { nameEn: "Holy Grail", descEn: "Chalice for sacred rituals." },
  "鍵": { nameEn: "Key", descEn: "Opens doors." },
  "コンパス": { nameEn: "Compass", descEn: "Shows directions." },
  "望遠鏡": { nameEn: "Telescope", descEn: "Looks far away." },
  "ランタン": { nameEn: "Lantern", descEn: "Illuminates darkness." },
  "スカル": { nameEn: "Skull", descEn: "A bonehead." },
  "牙": { nameEn: "Fang", descEn: "A beast's fang." },
  "鱗": { nameEn: "Scale", descEn: "A dragon's scale." },
};

const prefixesMap: Record<string, { nameEn: string, descEn: string }> = {
  "ボロボロの": { nameEn: "Battered ", descEn: "Well-used. " },
  "サビついた": { nameEn: "Rusty ", descEn: "Aged over time. " },
  "普通の": { nameEn: "Normal ", descEn: "Found anywhere. " },
  "上質な": { nameEn: "Fine ", descEn: "Slightly premium. " },
  "魔法の": { nameEn: "Magic ", descEn: "Imbued with magic. " },
  "呪われた": { nameEn: "Cursed ", descEn: "Emits an ominous aura. " },
  "ミスリル製": { nameEn: "Mithril ", descEn: "Shining silver. " },
  "伝説の": { nameEn: "Legendary ", descEn: "Famous in myths. " },
};

let outLines = [];
let lines = content.split('\n');

for (let line of lines) {
    if (line.includes('name: "') && line.includes('icon: ')) {
        const nameMatchUnique = line.match(/name:\s*"([^"]+)"/);
        if (nameMatchUnique && nameMatchUnique[1] && tMap[nameMatchUnique[1]]) {
            const data = tMap[nameMatchUnique[1]];
            line = line.replace(/name: "[^"]+"/, `name: "${nameMatchUnique[1]}", nameEn: "${data.nameEn}"`);
            
            const descRegex = /description:\s*"([^"]+)"/;
            const descMatch = line.match(descRegex);
            if (descMatch && descMatch[1]) {
                line = line.replace(descRegex, `description: "${descMatch[1]}", descriptionEn: "${data.descEn}"`);
            }
        }
    } else if (line.includes('baseVal: ') || line.includes('valueMod: ')) {
        const nameMatchBase = line.match(/name:\s*"([^"]+)"/);
        if (nameMatchBase && nameMatchBase[1]) {
            if (tMap[nameMatchBase[1]]) {
                const data = tMap[nameMatchBase[1]];
                line = line.replace(/name: "[^"]+"/, `name: "${nameMatchBase[1]}", nameEn: "${data.nameEn}"`);
                const descRegex = /desc:\s*"([^"]+)"/;
                const descMatch = line.match(descRegex);
                if (descMatch && descMatch[1]) {
                    line = line.replace(descRegex, `desc: "${descMatch[1]}", descEn: "${data.descEn}"`);
                }
            } else if (prefixesMap[nameMatchBase[1]]) {
                const data = prefixesMap[nameMatchBase[1]];
                line = line.replace(/name: "[^"]+"/, `name: "${nameMatchBase[1]}", nameEn: "${data.nameEn}"`);
                const descRegex = /desc:\s*"([^"]+)"/;
                const descMatch = line.match(descRegex);
                if (descMatch && descMatch[1]) {
                    line = line.replace(descRegex, `desc: "${descMatch[1]}", descEn: "${data.descEn}"`);
                }
            }
        }
    } else if (line.includes('name: `${prefix.name}${item.name}`')) {
        line = line + `\n            nameEn: \`\${prefix.nameEn}\${item.nameEn}\`,`;
    } else if (line.includes('description: `${prefix.desc}${item.desc}`')) {
        line = line + `\n            descriptionEn: \`\${prefix.descEn}\${item.descEn}\`,`;
    }
    outLines.push(line);
}

fs.writeFileSync('services/geminiService.ts', outLines.join('\n'));
console.log("Translations injected.");
