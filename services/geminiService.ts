import { Treasure } from "../types";

const UNIQUE_TREASURES = [
  // --- ガラクタ・日用品 (Junk / Common) ---
  { name: "欠けたルーン石", nameEn: "Chipped Runestone", description: "力が失われた石。", descriptionEn: "A stone that has lost its power.", value: 5, icon: "GiRuneStone" },
  { name: "古びた鍵", nameEn: "Old Key", description: "どこの扉を開けるのだろう。", descriptionEn: "What door does this open?", value: 10, icon: "GiKey" },
  { name: "サビたナイフ", nameEn: "Rusty Knife", description: "もはや使えない。", descriptionEn: "No longer usable.", value: 8, icon: "GiBowieKnife" },
  { name: "ただの木の実", nameEn: "Just a Nut", description: "食べられない木の実。", descriptionEn: "An inedible nut.", value: 2, icon: "GiAcorn" },
  { name: "泥だらけの靴", nameEn: "Muddy Boots", description: "誰かの長靴。", descriptionEn: "Someone's rubber boots.", value: 5, icon: "GiLeatherBoot" },
  { name: "ボロボロの鎖", nameEn: "Tattered Chain", description: "何かに繋がれていた。", descriptionEn: "Used to bind something.", value: 5, icon: "GiChainedShort" },
  { name: "謎の歯車", nameEn: "Mysterious Cog", description: "古代機械の部品。", descriptionEn: "Part of an ancient machine.", value: 40, icon: "GiCog" },
  { name: "割れた杯", nameEn: "Broken Chalice", description: "かつては綺麗だった杯。", descriptionEn: "A chalice that was once beautiful.", value: 10, icon: "GiChaliceDrops" },
  { name: "すすけたガラス玉", nameEn: "Sooty Glass Ball", description: "ほんのり光っている気がする。", descriptionEn: "Glows faintly.", value: 8, icon: "GiCrystalBall" },
  { name: "古い地図の切れ端", nameEn: "Old Map Fragment", description: "一部だけでは意味がない。", descriptionEn: "Useless on its own.", value: 50, icon: "GiTreasureMap" },
  // 11-20  
  { name: "ただの石ころ", nameEn: "Just a Pebble", description: "どこにでもある石。", descriptionEn: "A common pebble.", value: 1, icon: "GiStoneBlock" },
  { name: "奇妙な根っこ", nameEn: "Strange Root", description: "魔法薬の材料になるかも。", descriptionEn: "Might be an ingredient for potions.", value: 15, icon: "GiTreeRoots" },
  { name: "かすかな光の粉", nameEn: "Faint Light Powder", description: "妖精の粉の搾りカス。", descriptionEn: "Leftover dust from a fairy.", value: 30, icon: "GiSparkles" },
  { name: "真鍮の指輪", nameEn: "Brass Ring", description: "安っぽい指輪。", descriptionEn: "A cheap ring.", value: 50, icon: "GiRing" },
  { name: "曲がった釘", nameEn: "Bent Nail", description: "建築に使われていた。", descriptionEn: "Used for construction.", value: 2, icon: "GiNails" },
  { name: "枯れた薬草", nameEn: "Withered Herb", description: "効果はなさそう。", descriptionEn: "Doesn't seem effective.", value: 3, icon: "GiFallingLeaf" },
  { name: "魔導書の破れ紙", nameEn: "Torn Grimoire Page", description: "解読できない文字。", descriptionEn: "Undecipherable text.", value: 40, icon: "GiScrollUnfurled" },
  { name: "壊れた方位磁針", nameEn: "Broken Compass", description: "北を指さない。", descriptionEn: "Doesn't point North.", value: 15, icon: "GiCompass" },
  { name: "鉄くず", nameEn: "Scrap Iron", description: "溶かせば何かに使える。", descriptionEn: "Can be melted down for use.", value: 5, icon: "GiMetalBar" },
  { name: "割れた瓶", nameEn: "Broken Bottle", description: "何も入れられない。", descriptionEn: "Can't hold anything inside.", value: 2, icon: "GiBrokenBottle" },
  // 21-30
  { name: "動物の骨", nameEn: "Animal Bone", description: "何か獣の骨らしい。", descriptionEn: "Seems to be a beast's bone.", value: 8, icon: "GiFishbone" },
  { name: "銅貨", nameEn: "Copper Coin", description: "見慣れない国の硬貨。", descriptionEn: "Coin from an unfamiliar country.", value: 20, icon: "GiCoins" },
  { name: "銀貨", nameEn: "Silver Coin", description: "少し価値のある銀貨。", descriptionEn: "A somewhat valuable silver coin.", value: 100, icon: "GiCoins" },
  { name: "金貨", nameEn: "Gold Coin", description: "輝きを失っていない金貨。", descriptionEn: "A gold coin that hasn't lost its shine.", value: 1000, icon: "GiCoins" },
  { name: "黒い羽", nameEn: "Black Feather", description: "カラスとは違う不気味な羽。", descriptionEn: "An eerie feather, not from a crow.", value: 30, icon: "GiCrowDive" },
  { name: "トロールの角", nameEn: "Troll Horn", description: "意外と高く売れる。", descriptionEn: "Sells for surprisingly high.", value: 400, icon: "GiBullHorns" },
  { name: "オークの牙", nameEn: "Orc Fang", description: "装飾品になる。", descriptionEn: "Can be used as an ornament.", value: 200, icon: "GiTusksFlag" },
  { name: "ゴブリンの耳", nameEn: "Goblin Ear", description: "討伐の証。", descriptionEn: "Proof of subjugation.", value: 100, icon: "GiGoblinHead" },
  { name: "スライムの水滴", nameEn: "Slime Drop", description: "ひんやりしている。", descriptionEn: "Feels chilly.", value: 80, icon: "GiSlime" },
  { name: "コウモリの翼", nameEn: "Bat Wing", description: "錬金術に使える。", descriptionEn: "Usable in alchemy.", value: 120, icon: "GiBatWing" },
  // 31-40
  { name: "小さな水晶", nameEn: "Small Crystal", description: "わずかに魔力を帯びている。", descriptionEn: "Slightly imbued with magic.", value: 500, icon: "GiCrystalize" },
  { name: "魔獣の皮", nameEn: "Beast Pelt", description: "丈夫な革。", descriptionEn: "Sturdy leather.", value: 300, icon: "GiAnimalHide" },
  { name: "大きなアメジスト", nameEn: "Large Amethyst", description: "美しい紫の宝石。", descriptionEn: "A beautiful purple gem.", value: 1200, icon: "GiGemPendant" },
  { name: "トパーズ", nameEn: "Topaz", description: "黄色く輝く宝石。", descriptionEn: "A gleaming yellow gem.", value: 1000, icon: "GiGemPendant" },
  { name: "サファイア", nameEn: "Sapphire", description: "深い青の宝石。", descriptionEn: "A blue gem.", value: 2500, icon: "GiSapphire" },
  { name: "エメラルド", nameEn: "Emerald", description: "美しい緑の宝石。", descriptionEn: "A green gem.", value: 3000, icon: "GiEmerald" },
  { name: "ルビー", nameEn: "Ruby", description: "情熱的な赤の宝石。", descriptionEn: "A red gem.", value: 3500, icon: "GiRuby" },
  { name: "ダイヤモンド", nameEn: "Diamond", description: "最高級の輝き。", descriptionEn: "A transparent gem.", value: 8000, icon: "GiDiamondHard" },
  { name: "黒曜石", nameEn: "Obsidian", description: "鋭い断面を持つ火山ガラス。", descriptionEn: "Volcanic glass with a sharp edge.", value: 600, icon: "GiSparkles" },
  { name: "ミスリル鉱石", nameEn: "Mithril Ore", description: "軽くて丈夫な幻の金属。", descriptionEn: "A phantom metal, light and durable.", value: 4000, icon: "GiOreChunk" },
  // 41-50
  { name: "オリハルコン鉱石", nameEn: "Orichalcum Ore", description: "最も硬いとされる伝説の金属。", descriptionEn: "Legendary metal said to be the hardest.", value: 8000, icon: "GiOreChunk" },
  { name: "アダマンタイト", nameEn: "Adamantite", description: "神々が創り出したと言われる鉱石。", descriptionEn: "Ore said to be created by gods.", value: 12000, icon: "GiOreChunk" },
  { name: "銀の延べ棒", nameEn: "Silver Ingot", description: "ずっしりと重い銀。", descriptionEn: "A heavy silver ingot.", value: 3000, icon: "GiMetalBar" },
  { name: "金の延べ棒", nameEn: "Gold Ingot", description: "まばゆい光を放つ黄金。", descriptionEn: "A gold ingot shimmering brightly.", value: 10000, icon: "GiGoldBar" },
  { name: "プラチナ貨", nameEn: "Platinum Coin", description: "かつての王国の高額通貨。", descriptionEn: "High-denomination currency of a lost kingdom.", value: 5000, icon: "GiCoins" },
  { name: "古代の金貨袋", nameEn: "Ancient Coin Bag", description: "ずっしりと重い袋。", descriptionEn: "A heavy bag full of coins.", value: 6000, icon: "GiSwapBag" },
  { name: "精霊のランプ", nameEn: "Spirit Lamp", description: "ほのかに温かい。", descriptionEn: "Faintly warm.", value: 2000, icon: "GiMagicLamp" },
  { name: "魔法の薬瓶", nameEn: "Magic Potion Bottle", description: "怪しげな液体が入っている。", descriptionEn: "Contains a suspicious liquid.", value: 800, icon: "GiHealthPotion" },
  { name: "天使の羽根", nameEn: "Angel Feather", description: "とても軽く、純白の羽根。", descriptionEn: "An extremely light, pure white feather.", value: 3000, icon: "GiAngelWings" },
  { name: "龍のウロコ", nameEn: "Dragon Scale", description: "鉄よりも硬いと言われている。", descriptionEn: "Said to be harder than iron.", value: 5000, icon: "GiDragonSpiral" },
  // 51-60
  { name: "星の砂", nameEn: "Star Sand", description: "夜空のように瞬く不思議な砂。", descriptionEn: "Mysterious sand twinkling like the night sky.", value: 1500, icon: "GiStarsStack" },
  { name: "古代ルーン石", nameEn: "Ancient Runestone", description: "謎の文字が刻まれた石板。", descriptionEn: "A stone tablet inscribed with mysterious runes.", value: 2500, icon: "GiRuneStone" },
  { name: "綺麗な貝殻", nameEn: "Pretty Shell", description: "海の音が聞こえる。", descriptionEn: "You can hear the ocean's sound.", value: 80, icon: "GiScallop" },
  { name: "古代の土偶", nameEn: "Ancient Clay Figure", description: "奇妙な形をした土器。", descriptionEn: "A weirdly shaped earthenware.", value: 1000, icon: "GiGolemHead" },
  { name: "謎の石版", nameEn: "Mysterious Tablet", description: "解読不可能な古代文字が刻まれている。", descriptionEn: "Inscribed with unreadable ancient letters.", value: 2000, icon: "GiStoneTablet" },
  { name: "アンモナイトの化石", nameEn: "Ammonite Fossil", description: "太古のロマン。", descriptionEn: "A romance of prehistoric times.", value: 1500, icon: "GiAmmoniteFossil" },
  { name: "錬金術師の石", nameEn: "Alchemist's Stone", description: "妖しく赤く光る未知の鉱石。", descriptionEn: "An unknown ore glowing eerily red.", value: 6000, icon: "GiSparkles" },
  { name: "隕石の欠片", nameEn: "Meteorite Fragment", description: "宇宙からの贈り物。", descriptionEn: "A gift from space.", value: 4000, icon: "GiSparkles" },
  { name: "琥珀（虫入り）", nameEn: "Amber (with bug)", description: "太古の秘密が閉じ込められた宝石。", descriptionEn: "A gem trapping prehistoric secrets.", value: 2000, icon: "GiAmberMosquito" },
  { name: "黄金のスカラベ", nameEn: "Golden Scarab", description: "古代エジプトの装飾品。", descriptionEn: "An ornament from Ancient Egypt.", value: 4500, icon: "GiScarabBeetle" },
  // 61-70
  { name: "サファイアのブローチ", nameEn: "Sapphire Brooch", description: "深い青色が美しい装飾品。", descriptionEn: "An ornament with beautiful deep blue.", value: 3500, icon: "GiJewelCrown" },
  { name: "真珠のネックレス", nameEn: "Pearl Necklace", description: "泥にまみれているが本物だ。", descriptionEn: "Muddy, but genuine.", value: 2800, icon: "GiPearlNecklace" },
  { name: "ダイヤの指輪", nameEn: "Diamond Ring", description: "とても美しい輝き。", descriptionEn: "A very beautiful brilliance.", value: 6500, icon: "GiDiamondRing" },
  { name: "金の王冠", nameEn: "Golden Crown", description: "失われた王国の証。", descriptionEn: "Proof of a lost kingdom.", value: 15000, icon: "GiCrown" },
  { name: "懐中時計", nameEn: "Pocket Watch", description: "針は止まっている。", descriptionEn: "The hands are stopped.", value: 1500, icon: "GiPocketWatch" },
  { name: "金の杯", nameEn: "Golden Chalice", description: "水を飲むには豪華すぎる。", descriptionEn: "Too luxurious just to drink water.", value: 3500, icon: "GiChaliceDrops" },
  { name: "ガラスの靴", nameEn: "Glass Slipper", description: "透き通った靴。", descriptionEn: "A clear, transparent shoe.", value: 2500, icon: "GiHighHeel" },
  { name: "エルフの弓", nameEn: "Elven Bow", description: "精巧な装飾が施されている。", descriptionEn: "Adorned with exquisite decorations.", value: 4000, icon: "GiBowArrow" },
  { name: "モアイ像", nameEn: "Moai Statue", description: "なぜこんなところにミニモアイが？", descriptionEn: "Why is there a mini Moai here?", value: 2000, icon: "GiMoai" },
  { name: "魔法のランプ", nameEn: "Magic Lamp", description: "こすっても魔人は出てこない。", descriptionEn: "No genie comes out even if rubbed.", value: 4500, icon: "GiSparkles" },
  // 71-80
  { name: "招き猫", nameEn: "Maneki-neko", description: "ご利益がありそうだ。", descriptionEn: "Seems to bring good luck.", value: 1200, icon: "GiCat" },
  { name: "太陽の紋章", nameEn: "Sun Crest", description: "熱を帯びている。", descriptionEn: "Emitting heat.", value: 3000, icon: "GiSun" },
  { name: "月の首飾り", nameEn: "Moon Necklace", description: "暗闇で光る。", descriptionEn: "Glows in the dark.", value: 3000, icon: "GiSparkles" },
  { name: "海賊の宝箱", nameEn: "Pirate's Chest", description: "開けるのに鍵が必要だ。", descriptionEn: "Requires a key to open.", value: 8000, icon: "GiOpenTreasureChest" },
  { name: "勇者の剣", nameEn: "Hero's Sword", description: "かつて魔王を討ったとされる。", descriptionEn: "Said to have defeated the Demon King.", value: 12000, icon: "GiBroadsword" },
  { name: "聖騎士の盾", nameEn: "Paladin's Shield", description: "あらゆる邪気を弾く。", descriptionEn: "Repels all evil.", value: 10000, icon: "GiTemplarShield" },
  { name: "大魔導士の杖", nameEn: "Archmage's Staff", description: "強大な魔力を秘める。", descriptionEn: "Holds immense magical power.", value: 12000, icon: "GiSparkles" },
  { name: "フェニックスの尾", nameEn: "Phoenix Down", description: "命を呼び覚ます。", descriptionEn: "Awakens life.", value: 15000, icon: "GiSparkles" },
  { name: "賢者の石", nameEn: "Philosopher's Stone", description: "あらゆる物質を黄金に変える。", descriptionEn: "Turns all matter into gold.", value: 50000, icon: "GiSparkles" },
  { name: "星の羅針盤", nameEn: "Star Compass", description: "運命の向かう先を示す。", descriptionEn: "Shows the destination of destiny.", value: 6000, icon: "GiAstrolabe" },
  // 81-90
  { name: "白銀のティアラ", nameEn: "Silver Tiara", description: "王女の忘れ物。", descriptionEn: "A princess's forgotten item.", value: 8000, icon: "GiTiara" },
  { name: "死霊術士の頭骨", nameEn: "Necromancer's Skull", description: "不吉なオーラを放つ。", descriptionEn: "Radiates an ominous aura.", value: 4500, icon: "GiSparkles" },
  { name: "妖魔の笛", nameEn: "Phantom Flute", description: "吹くと魔物を呼び寄せる。", descriptionEn: "Attracts monsters when played.", value: 2500, icon: "GiFlute" },
  { name: "大地のクリスタル", nameEn: "Earth Crystal", description: "自然の力が満ちている。", descriptionEn: "Filled with the power of nature.", value: 8000, icon: "GiSparkles" },
  { name: "火炎のルビー", nameEn: "Flame Ruby", description: "触れると火傷しそうだ。", descriptionEn: "Looks like it will burn you if touched.", value: 7000, icon: "GiFireGem" },
  { name: "氷結のサファイア", nameEn: "Freezing Sapphire", description: "周囲の気温を下げる。", descriptionEn: "Lowers the surrounding temperature.", value: 7000, icon: "GiIceCube" },
  { name: "迅雷のトパーズ", nameEn: "Thunder Topaz", description: "微小な雷を発している。", descriptionEn: "Emits small bolts of lightning.", value: 7000, icon: "GiLightningTear" },
  { name: "神聖なる聖杯", nameEn: "Holy Grail", description: "どんな傷も癒やす水を湧き出す。", descriptionEn: "Spills water that heals any wound.", value: 25000, icon: "GiHolyGrail" },
  { name: "次元の鍵", nameEn: "Dimensional Key", description: "別の世界への扉を開く。", descriptionEn: "Opens a door to another world.", value: 30000, icon: "GiKey" },
  { name: "世界樹の葉", nameEn: "Yggdrasil Leaf", description: "奇跡の治癒力を持つ。", descriptionEn: "Possesses miraculous healing power.", value: 18000, icon: "GiLeafSwirl" },
  // 91-100
  { name: "ユニコーンの角", nameEn: "Unicorn Horn", description: "あらゆる毒を浄化する。", descriptionEn: "Purifies all poisons.", value: 12000, icon: "GiHornInternal" },
  { name: "ドラゴンの卵", nameEn: "Dragon Egg", description: "少し温かい。", descriptionEn: "A little warm.", value: 35000, icon: "GiSparkles" },
  { name: "王家の印章", nameEn: "Royal Seal", description: "絶大な権力を示す。", descriptionEn: "Shows immense authority.", value: 15000, icon: "GiWaxSeal" },
  { name: "空飛ぶ絨毯", nameEn: "Flying Carpet", description: "今はただの古い絨毯。", descriptionEn: "Just an old carpet for now.", value: 10000, icon: "GiSparkles" },
  { name: "禁断の魔導書", nameEn: "Forbidden Grimoire", description: "開いてはならない。", descriptionEn: "Must not be opened.", value: 20000, icon: "GiSpellBook" },
  { name: "光の剣", nameEn: "Sword of Light", description: "暗闇を切り裂く。", descriptionEn: "Cleaves through the darkness.", value: 30000, icon: "GiGlowingArtifact" },
  { name: "闇の盾", nameEn: "Shield of Darkness", description: "光を飲み込む。", descriptionEn: "Swallows the light.", value: 28000, icon: "GiSpikedShield" },
  { name: "伝説のメダル", nameEn: "Legendary Medal", description: "選ばれし勇者の証。", descriptionEn: "Proof of a chosen hero.", value: 40000, icon: "GiMedal" },
  { name: "聖龍の涙", nameEn: "Sacred Dragon's Tear", description: "究極の宝石。", descriptionEn: "The ultimate gem.", value: 80000, icon: "GiWaterDrop" },
  { name: "女神の指輪", nameEn: "Goddess Ring", description: "すべてのステータスが上がる。", descriptionEn: "Boosts all stats.", value: 100000, icon: "GiDiamondRing" },
];

const PREFIXES = [
  { name: "ボロボロの", nameEn: "Battered ", valueMod: 0.1, desc: "かなり使い込まれた", descEn: "Well-used. " },
  { name: "サビついた", nameEn: "Rusty ", valueMod: 0.2, desc: "長い年月経過した", descEn: "Aged over time. " },
  { name: "普通の", nameEn: "Normal ", valueMod: 1, desc: "どこにでもありそうな", descEn: "Found anywhere. " },
  { name: "上質な", nameEn: "Fine ", valueMod: 3, desc: "ちょっと高級な", descEn: "Slightly premium. " },
  { name: "魔法の", nameEn: "Magic ", valueMod: 10, desc: "魔力を帯びた", descEn: "Imbued with magic. " },
  { name: "呪われた", nameEn: "Cursed ", valueMod: 0.5, desc: "不吉なオーラを放つ", descEn: "Emits an ominous aura. " },
  { name: "ミスリル製", nameEn: "Mithril ", valueMod: 50, desc: "銀色に輝く", descEn: "Shining silver. " },
  { name: "伝説の", nameEn: "Legendary ", valueMod: 200, desc: "神話に名高い", descEn: "Famous in myths. " },
];

const BASE_ITEMS = [
    { name: "ショートソード", nameEn: "Short Sword", icon: "GiBroadsword", baseVal: 200, desc: "基本的な剣。" },
    { name: "ロングソード", nameEn: "Long Sword", icon: "GiBroadsword", baseVal: 400, desc: "リーチの長い剣。" },
    { name: "ダガー", nameEn: "Dagger", icon: "GiDaggerRose", baseVal: 150, desc: "短剣。" },
    { name: "バックラー", nameEn: "Buckler", icon: "GiRoundShield", baseVal: 200, desc: "小さな盾。" },
    { name: "カイトシールド", nameEn: "Kite Shield", icon: "GiSparkles", baseVal: 500, desc: "騎士の盾。" },
    { name: "ウッドボウ", nameEn: "Wood Bow", icon: "GiBowArrow", baseVal: 200, desc: "木の弓。" },
    { name: "クロスボウ", nameEn: "Crossbow", icon: "GiCrossbow", baseVal: 600, desc: "強力な弦。" },
    { name: "スタッフ", nameEn: "Staff", icon: "GiWoodStick", baseVal: 300, desc: "魔法使いの杖。" },
    { name: "ワンド", nameEn: "Wand", icon: "GiFairyWand", baseVal: 500, desc: "魔力を集める。" },
    { name: "メイス", nameEn: "Mace", icon: "GiMaceHead", baseVal: 350, desc: "打撃武器。" },
    { name: "スピア", nameEn: "Spear", icon: "GiSparkles", baseVal: 350, desc: "槍。" },
    { name: "ハルバード", nameEn: "Halberd", icon: "GiHalberd", baseVal: 600, desc: "斧槍。" },
    { name: "レザーアーマー", nameEn: "Leather Armor", icon: "GiLeatherArmor", baseVal: 300, desc: "革の鎧。" },
    { name: "チェインメイル", nameEn: "Chain Mail", icon: "GiChainMail", baseVal: 800, desc: "鎖帷子。" },
    { name: "プレートアーマー", nameEn: "Plate Armor", icon: "GiBreastplate", baseVal: 2000, desc: "鉄の鎧。" },
    { name: "アイアンヘルム", nameEn: "Iron Helm", icon: "GiVisoredHelm", baseVal: 400, desc: "鉄の兜。" },
    { name: "ガントレット", nameEn: "Gauntlet", icon: "GiGauntlet", baseVal: 250, desc: "腕当て。" },
    { name: "マント", nameEn: "Mantle", icon: "GiCapeArmor", baseVal: 200, desc: "風をはらむ。" },
    { name: "ブーツ", nameEn: "Boots", icon: "GiBoots", baseVal: 200, desc: "旅の靴。" },
    { name: "ポーション", nameEn: "Potion", icon: "GiSparkles", baseVal: 50, desc: "回復薬。" },
    { name: "エーテル", nameEn: "Ether", icon: "GiMagicPotion", baseVal: 150, desc: "魔力回復薬。" },
    { name: "エリクサー", nameEn: "Elixir", icon: "GiSparkles", baseVal: 2000, desc: "万能薬。" },
    { name: "魔導書", nameEn: "Grimoire", icon: "GiSpellBook", baseVal: 1500, desc: "魔法の書。" },
    { name: "古文書", nameEn: "Ancient Text", icon: "GiScrollUnfurled", baseVal: 800, desc: "古い記録。" },
    { name: "アミュレット", nameEn: "Amulet", icon: "GiSparkles", baseVal: 1000, desc: "護符。" },
    { name: "リング", nameEn: "Ring", icon: "GiRing", baseVal: 800, desc: "指輪。" },
    { name: "ネックレス", nameEn: "Necklace", icon: "GiEmeraldNecklace", baseVal: 1000, desc: "首飾り。" },
    { name: "ピアス", nameEn: "Earring", icon: "GiPearlEarring", baseVal: 500, desc: "耳飾り。" },
    { name: "ルビー", nameEn: "Ruby", icon: "GiRuby", baseVal: 2000, desc: "赤い宝石。" },
    { name: "サファイア", nameEn: "Sapphire", icon: "GiSapphire", baseVal: 2000, desc: "青い宝石。" },
    { name: "エメラルド", nameEn: "Emerald", icon: "GiEmerald", baseVal: 2500, desc: "緑の宝石。" },
    { name: "ダイヤモンド", nameEn: "Diamond", icon: "GiDiamondHard", baseVal: 5000, desc: "透明な宝石。" },
    { name: "魔石", nameEn: "Magic Stone", icon: "GiGemPendant", baseVal: 1500, desc: "魔力を秘めた石。" },
    { name: "ルーンストーン", nameEn: "Runestone", icon: "GiRuneStone", baseVal: 1200, desc: "文字が刻まれた石。" },
    { name: "クリスタル", nameEn: "Crystal", icon: "GiSparkles", baseVal: 1800, desc: "水晶。" },
    { name: "鉄鉱石", nameEn: "Iron Ore", icon: "GiRock", baseVal: 100, desc: "鉄の原料。" },
    { name: "銀鉱石", nameEn: "Silver Ore", icon: "GiStoneBlock", baseVal: 400, desc: "銀の原料。" },
    { name: "金鉱石", nameEn: "Gold Ore", icon: "GiGoldShell", baseVal: 1500, desc: "金の原料。" },
    { name: "宝箱", nameEn: "Treasure Chest", icon: "GiOpenTreasureChest", baseVal: 2000, desc: "箱自体。" },
    { name: "金貨袋", nameEn: "Coin Bag", icon: "GiMoneyStack", baseVal: 1200, desc: "お金が入っている。" },
    { name: "王冠", nameEn: "Crown", icon: "GiCrown", baseVal: 5000, desc: "王の証。" },
    { name: "ティアラ", nameEn: "Tiara", icon: "GiTiara", baseVal: 3000, desc: "王女の証。" },
    { name: "聖杯", nameEn: "Holy Grail", icon: "GiChaliceDrops", baseVal: 8000, desc: "神聖な儀式の杯。" },
    { name: "鍵", nameEn: "Key", icon: "GiKey", baseVal: 500, desc: "扉を開く。" },
    { name: "コンパス", nameEn: "Compass", icon: "GiCompass", baseVal: 400, desc: "方角を示す。" },
    { name: "望遠鏡", nameEn: "Telescope", icon: "GiSpyglass", baseVal: 600, desc: "遠くを見る。" },
    { name: "ランタン", nameEn: "Lantern", icon: "GiLanternFlame", baseVal: 250, desc: "暗闇を照らす。" },
    { name: "スカル", nameEn: "Skull", icon: "GiSparkles", baseVal: 150, desc: "骨。" },
    { name: "牙", nameEn: "Fang", icon: "GiSparkles", baseVal: 100, desc: "獣の牙。" },
    { name: "鱗", nameEn: "Scale", icon: "GiDragonSpiral", baseVal: 200, desc: "竜の鱗。" }
];

const GENERATED_TREASURES = [];
BASE_ITEMS.forEach(item => {
    PREFIXES.forEach(prefix => {
        GENERATED_TREASURES.push({
            name: `${prefix.name}${item.name}`,
            nameEn: `${prefix.nameEn}${item.nameEn}`,
            description: `${prefix.desc}${item.desc}`,
            descriptionEn: `${prefix.descEn}${item.descEn}`,
            value: Math.floor(item.baseVal * prefix.valueMod),
            icon: item.icon
        });
    });
});

export const TREASURE_REGISTRY: Omit<Treasure, 'id'>[] = [...UNIQUE_TREASURES, ...GENERATED_TREASURES].map((item, index) => ({
    ...item,
    catalogId: index + 1
}));

export const generateTreasure = async (): Promise<Treasure> => {
  await new Promise(resolve => setTimeout(resolve, 800));

  const randomIndex = Math.floor(Math.random() * TREASURE_REGISTRY.length);
  const selectedTreasure = TREASURE_REGISTRY[randomIndex];

  return {
    id: crypto.randomUUID(), 
    ...selectedTreasure
  };
};
