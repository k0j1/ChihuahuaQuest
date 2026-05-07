import { Treasure } from "../types";

const UNIQUE_TREASURES = [
  // --- ガラクタ・日用品 (Junk / Common) ---
  { name: "欠けたルーン石", description: "力が失われた石。", value: 10, icon: "GiRuneStone" },
  { name: "古びた鍵", description: "どこの扉を開けるのだろう。", value: 15, icon: "GiKey" },
  { name: "サビたナイフ", description: "もはや使えない。", value: 12, icon: "GiBowieKnife" },
  { name: "ただの木の実", description: "食べられない木の実。", value: 5, icon: "GiAcorn" },
  { name: "泥だらけの靴", description: "誰かの長靴。", value: 8, icon: "GiLeatherBoot" },
  { name: "ボロボロの鎖", description: "何かに繋がれていた。", value: 10, icon: "GiChainedHeart" },
  { name: "謎の歯車", description: "古代機械の部品。", value: 20, icon: "GiCog" },
  { name: "割れた杯", description: "かつては綺麗だった杯。", value: 12, icon: "GiChaliceDrops" },
  { name: "すすけたガラス玉", description: "ほんのり光っている気がする。", value: 15, icon: "GiCrystalBall" },
  { name: "古い地図の切れ端", description: "一部だけでは意味がない。", value: 25, icon: "GiTreasureMap" },
  // 11-20  
  { name: "ただの石ころ", description: "どこにでもある石。", value: 2, icon: "GiStoneBlock" },
  { name: "奇妙な根っこ", description: "魔法薬の材料になるかも。", value: 8, icon: "GiSparkles" },
  { name: "かすかな光の粉", description: "妖精の粉の搾りカス。", value: 18, icon: "GiSparkles" },
  { name: "真鍮の指輪", description: "安っぽい指輪。", value: 30, icon: "GiRing" },
  { name: "曲がった釘", description: "建築に使われていた。", value: 5, icon: "GiNails" },
  { name: "枯れた薬草", description: "効果はなさそう。", value: 4, icon: "GiGrass" },
  { name: "魔導書の破れ紙", description: "解読できない文字。", value: 20, icon: "GiSparkles" },
  { name: "壊れた方位磁針", description: "北を指さない。", value: 25, icon: "GiCompass" },
  { name: "鉄くず", description: "溶かせば何かに使える。", value: 10, icon: "GiMetalBar" },
  { name: "ひび割れた瓶", description: "何も入れられない。", value: 8, icon: "GiBrokenBottle" },
  // 21-30
  { name: "動物の骨", description: "何か獣の骨らしい。", value: 15, icon: "GiSparkles" },
  { name: "銅貨", description: "見慣れない国の硬貨。", value: 40, icon: "GiSparkles" },
  { name: "銀貨", description: "少し価値のある銀貨。", value: 100, icon: "GiCoins" },
  { name: "金貨", description: "輝きを失っていない金貨。", value: 500, icon: "GiTwoCoins" },
  { name: "黒い羽", description: "カラスとは違う不気味な羽。", value: 25, icon: "GiCrowDive" },
  { name: "トロールの角", description: "意外と高く売れる。", value: 120, icon: "GiBullHorns" },
  { name: "オークの牙", description: "装飾品になる。", value: 80, icon: "GiTusksFlag" },
  { name: "ゴブリンの耳", description: "討伐の証。", value: 60, icon: "GiGoblinHead" },
  { name: "スライムの水滴", description: "ひんやりしている。", value: 45, icon: "GiSlime" },
  { name: "コウモリの翼", description: "錬金術に使える。", value: 50, icon: "GiBatWing" },
  // 31-40
  { name: "小さな水晶", description: "わずかに魔力を帯びている。", value: 150, icon: "GiCrystalize" },
  { name: "魔獣の皮", description: "丈夫な革。", value: 90, icon: "GiAnimalHide" },
  { name: "大きなアメジスト", description: "美しい紫の宝石。", value: 300, icon: "GiAmethyst" },
  { name: "トパーズ", description: "黄色く輝く宝石。", value: 250, icon: "GiGemPendant" },
  { name: "サファイア", description: "深い青の宝石。", value: 500, icon: "GiSparkles" },
  { name: "エメラルド", description: "美しい緑の宝石。", value: 550, icon: "GiEmerald" },
  { name: "ルビー", description: "情熱的な赤の宝石。", value: 600, icon: "GiSparkles" },
  { name: "ダイヤモンド", description: "最高級の輝き。", value: 1500, icon: "GiDiamondHard" },
  { name: "黒曜石", description: "鋭い断面を持つ火山ガラス。", value: 180, icon: "GiSparkles" },
  { name: "ミスリル鉱石", description: "軽くて丈夫な幻の金属。", value: 800, icon: "GiSparkles" },
  // 41-50
  { name: "オリハルコン鉱石", description: "最も硬いとされる伝説の金属。", value: 1200, icon: "GiSparkles" },
  { name: "アダマンタイト", description: "神々が創り出したと言われる鉱石。", value: 1500, icon: "GiMetalScales" },
  { name: "銀の延べ棒", description: "ずっしりと重い銀。", value: 600, icon: "GiMetalBar" },
  { name: "金の延べ棒", description: "まばゆい光を放つ黄金。", value: 1500, icon: "GiGoldBar" },
  { name: "プラチナ貨", description: "かつての王国の高額通貨。", value: 800, icon: "GiCoins" },
  { name: "古代の金貨袋", description: "ずっしりと重い袋。", value: 1000, icon: "GiMoneyStack" },
  { name: "精霊のランプ", description: "ほのかに温かい。", value: 450, icon: "GiSparkles" },
  { name: "魔法の薬瓶", description: "怪しげな液体が入っている。", value: 220, icon: "GiHealthPotion" },
  { name: "天使の羽根", description: "とても軽く、純白の羽根。", value: 500, icon: "GiSparkles" },
  { name: "龍のウロコ", description: "鉄よりも硬いと言われている。", value: 800, icon: "GiDragonSpiral" },
  // 51-60
  { name: "星の砂", description: "夜空のように瞬く不思議な砂。", value: 350, icon: "GiStarsStack" },
  { name: "古代ルーン石", description: "謎の文字が刻まれた石板。", value: 600, icon: "GiRuneStone" },
  { name: "綺麗な貝殻", description: "海の音が聞こえる。", value: 80, icon: "GiScallop" },
  { name: "古代の土偶", description: "奇妙な形をした土器。", value: 250, icon: "GiGolemHead" },
  { name: "謎の石版", description: "解読不可能な古代文字が刻まれている。", value: 400, icon: "GiStoneTablet" },
  { name: "アンモナイトの化石", description: "太古のロマン。", value: 300, icon: "GiAmmoniteFossil" },
  { name: "錬金術師の石", description: "妖しく赤く光る未知の鉱石。", value: 900, icon: "GiSparkles" },
  { name: "隕石の欠片", description: "宇宙からの贈り物。", value: 1000, icon: "GiSparkles" },
  { name: "琥珀（虫入り）", description: "太古の秘密が閉じ込められた宝石。", value: 450, icon: "GiAmberMosquito" },
  { name: "黄金のスカラベ", description: "古代エジプトの装飾品。", value: 850, icon: "GiScarabBeetle" },
  // 61-70
  { name: "サファイアのブローチ", description: "深い青色が美しい装飾品。", value: 700, icon: "GiJewelCrown" },
  { name: "真珠のネックレス", description: "泥にまみれているが本物だ。", value: 650, icon: "GiPearlNecklace" },
  { name: "ダイヤの指輪", description: "とても美しい輝き。", value: 1200, icon: "GiDiamondRing" },
  { name: "金の王冠", description: "失われた王国の証。", value: 2000, icon: "GiCrown" },
  { name: "懐中時計", description: "針は止まっている。", value: 500, icon: "GiPocketWatch" },
  { name: "金の杯", description: "水を飲むには豪華すぎる。", value: 800, icon: "GiChaliceDrops" },
  { name: "ガラスの靴", description: "透き通った靴。", value: 500, icon: "GiHighHeel" },
  { name: "エルフの弓", description: "精巧な装飾が施されている。", value: 600, icon: "GiBowArrow" },
  { name: "モアイ像", description: "なぜこんなところにミニモアイが？", value: 500, icon: "GiMoai" },
  { name: "魔法のランプ", description: "こすっても魔人は出てこない。", value: 700, icon: "GiSparkles" },
  // 71-80
  { name: "招き猫", description: "ご利益がありそうだ。", value: 400, icon: "GiCat" },
  { name: "太陽の紋章", description: "熱を帯びている。", value: 550, icon: "GiSun" },
  { name: "月の首飾り", description: "暗闇で光る。", value: 550, icon: "GiSparkles" },
  { name: "海賊の宝箱", description: "開けるのに鍵が必要だ。", value: 1500, icon: "GiOpenTreasureChest" },
  { name: "勇者の剣", description: "かつて魔王を討ったとされる。", value: 1200, icon: "GiBroadsword" },
  { name: "聖騎士の盾", description: "あらゆる邪気を弾く。", value: 1000, icon: "GiTemplarShield" },
  { name: "大魔導士の杖", description: "強大な魔力を秘める。", value: 1100, icon: "GiSparkles" },
  { name: "フェニックスの尾", description: "命を呼び覚ます。", value: 1500, icon: "GiSparkles" },
  { name: "賢者の石", description: "あらゆる物質を黄金に変える。", value: 5000, icon: "GiSparkles" },
  { name: "星の羅針盤", description: "運命の向かう先を示す。", value: 950, icon: "GiAstrolabe" },
  // 81-90
  { name: "白銀のティアラ", description: "王女の忘れ物。", value: 1000, icon: "GiTiara" },
  { name: "死霊術士の頭骨", description: "不吉なオーラを放つ。", value: 800, icon: "GiSparkles" },
  { name: "妖魔の笛", description: "吹くと魔物を呼び寄せる。", value: 400, icon: "GiFlute" },
  { name: "大地のクリスタル", description: "自然の力が満ちている。", value: 1800, icon: "GiSparkles" },
  { name: "火炎のルビー", description: "触れると火傷しそうだ。", value: 1200, icon: "GiFireGem" },
  { name: "氷結のサファイア", description: "周囲の気温を下げる。", value: 1200, icon: "GiIceCube" },
  { name: "迅雷のトパーズ", description: "微小な雷を発している。", value: 1200, icon: "GiLightningTear" },
  { name: "神聖なる聖杯", description: "どんな傷も癒やす水を湧き出す。", value: 3000, icon: "GiHolyGrail" },
  { name: "次元の鍵", description: "別の世界への扉を開く。", value: 2500, icon: "GiKey" },
  { name: "世界樹の葉", description: "奇跡の治癒力を持つ。", value: 1500, icon: "GiLeafSwirl" },
  // 91-100
  { name: "ユニコーンの角", description: "あらゆる毒を浄化する。", value: 1200, icon: "GiHornInternal" },
  { name: "ドラゴンの卵", description: "少し温かい。", value: 4000, icon: "GiSparkles" },
  { name: "王家の印章", description: "絶大な権力を示す。", value: 1500, icon: "GiWaxSeal" },
  { name: "空飛ぶ絨毯", description: "今はただの古い絨毯。", value: 800, icon: "GiSparkles" },
  { name: "禁断の魔導書", description: "開いてはならない。", value: 2000, icon: "GiSpellBook" },
  { name: "光の剣", description: "暗闇を切り裂く。", value: 2500, icon: "GiGlowingArtifact" },
  { name: "闇の盾", description: "光を飲み込む。", value: 2200, icon: "GiSpikedShield" },
  { name: "伝説のメダル", description: "選ばれし勇者の証。", value: 1000, icon: "GiMedal" },
  { name: "聖龍の涙", description: "究極の宝石。", value: 8000, icon: "GiWaterDrop" },
  { name: "女神の指輪", description: "すべてのステータスが上がる。", value: 5000, icon: "GiDiamondRing" },
];

const PREFIXES = [
  { name: "ボロボロの", valueMod: 0.5, desc: "かなり使い込まれた" },
  { name: "サビついた", valueMod: 0.6, desc: "長い年月経過した" },
  { name: "普通の", valueMod: 1.0, desc: "どこにでもありそうな" },
  { name: "上質な", valueMod: 1.2, desc: "ちょっと高級な" },
  { name: "魔法の", valueMod: 1.5, desc: "魔力を帯びた" },
  { name: "呪われた", valueMod: 0.8, desc: "不吉なオーラを放つ" },
  { name: "ミスリル製", valueMod: 5.0, desc: "銀色に輝く" },
  { name: "伝説の", valueMod: 20.0, desc: "神話に名高い" },
];

const BASE_ITEMS = [
    { name: "ショートソード", icon: "GiBroadsword", baseVal: 50, desc: "基本的な剣。" },
    { name: "ロングソード", icon: "GiBroadsword", baseVal: 80, desc: "リーチの長い剣。" },
    { name: "ダガー", icon: "GiDaggerRose", baseVal: 30, desc: "短剣。" },
    { name: "バックラー", icon: "GiRoundShield", baseVal: 40, desc: "小さな盾。" },
    { name: "カイトシールド", icon: "GiSparkles", baseVal: 90, desc: "騎士の盾。" },
    { name: "ウッドボウ", icon: "GiBowArrow", baseVal: 50, desc: "木の弓。" },
    { name: "クロスボウ", icon: "GiCrossbow", baseVal: 120, desc: "強力な弦。" },
    { name: "スタッフ", icon: "GiWoodStick", baseVal: 60, desc: "魔法使いの杖。" },
    { name: "ワンド", icon: "GiFairyWand", baseVal: 100, desc: "魔力を集める。" },
    { name: "メイス", icon: "GiMaceHead", baseVal: 70, desc: "打撃武器。" },
    { name: "スピア", icon: "GiSparkles", baseVal: 70, desc: "槍。" },
    { name: "ハルバード", icon: "GiHalberd", baseVal: 110, desc: "斧槍。" },
    { name: "レザーアーマー", icon: "GiLeatherArmor", baseVal: 80, desc: "革の鎧。" },
    { name: "チェインメイル", icon: "GiChainMail", baseVal: 150, desc: "鎖帷子。" },
    { name: "プレートアーマー", icon: "GiBreastplate", baseVal: 300, desc: "鉄の鎧。" },
    { name: "アイアンヘルム", icon: "GiVisoredHelm", baseVal: 90, desc: "鉄の兜。" },
    { name: "ガントレット", icon: "GiGauntlet", baseVal: 60, desc: "腕当て。" },
    { name: "マント", icon: "GiCapeArmor", baseVal: 50, desc: "風をはらむ。" },
    { name: "ブーツ", icon: "GiBoots", baseVal: 40, desc: "旅の靴。" },
    { name: "ポーション", icon: "GiSparkles", baseVal: 20, desc: "回復薬。" },
    { name: "エーテル", icon: "GiMagicPotion", baseVal: 50, desc: "魔力回復薬。" },
    { name: "エリクサー", icon: "GiSparkles", baseVal: 500, desc: "万能薬。" },
    { name: "魔導書", icon: "GiSpellBook", baseVal: 200, desc: "魔法の書。" },
    { name: "古文書", icon: "GiScrollUnfurled", baseVal: 150, desc: "古い記録。" },
    { name: "アミュレット", icon: "GiSparkles", baseVal: 250, desc: "護符。" },
    { name: "リング", icon: "GiRing", baseVal: 180, desc: "指輪。" },
    { name: "ネックレス", icon: "GiEmeraldNecklace", baseVal: 200, desc: "首飾り。" },
    { name: "ピアス", icon: "GiPearlEarring", baseVal: 100, desc: "耳飾り。" },
    { name: "ルビー", icon: "GiSparkles", baseVal: 400, desc: "赤い宝石。" },
    { name: "サファイア", icon: "GiSparkles", baseVal: 400, desc: "青い宝石。" },
    { name: "エメラルド", icon: "GiEmerald", baseVal: 400, desc: "緑の宝石。" },
    { name: "ダイヤモンド", icon: "GiDiamondHard", baseVal: 1000, desc: "透明な宝石。" },
    { name: "魔石", icon: "GiGemPendant", baseVal: 300, desc: "魔力を秘めた石。" },
    { name: "ルーンストーン", icon: "GiRuneStone", baseVal: 250, desc: "文字が刻まれた石。" },
    { name: "クリスタル", icon: "GiSparkles", baseVal: 350, desc: "水晶。" },
    { name: "鉄鉱石", icon: "GiRock", baseVal: 30, desc: "鉄の原料。" },
    { name: "銀鉱石", icon: "GiStoneBlock", baseVal: 80, desc: "銀の原料。" },
    { name: "金鉱石", icon: "GiGoldShell", baseVal: 200, desc: "金の原料。" },
    { name: "宝箱", icon: "GiOpenTreasureChest", baseVal: 500, desc: "箱自体。" },
    { name: "金貨袋", icon: "GiMoneyStack", baseVal: 300, desc: "お金が入っている。" },
    { name: "王冠", icon: "GiCrown", baseVal: 800, desc: "王の証。" },
    { name: "ティアラ", icon: "GiTiara", baseVal: 600, desc: "王女の証。" },
    { name: "聖杯", icon: "GiChaliceDrops", baseVal: 1000, desc: "神聖な儀式の杯。" },
    { name: "鍵", icon: "GiKey", baseVal: 100, desc: "扉を開く。" },
    { name: "コンパス", icon: "GiCompass", baseVal: 80, desc: "方角を示す。" },
    { name: "望遠鏡", icon: "GiSpyglass", baseVal: 120, desc: "遠くを見る。" },
    { name: "ランタン", icon: "GiLanternFlame", baseVal: 60, desc: "暗闇を照らす。" },
    { name: "スカル", icon: "GiSparkles", baseVal: 40, desc: "骨。" },
    { name: "牙", icon: "GiSparkles", baseVal: 30, desc: "獣の牙。" },
    { name: "鱗", icon: "GiDragonSpiral", baseVal: 50, desc: "竜の鱗。" }
];

const GENERATED_TREASURES = [];
BASE_ITEMS.forEach(item => {
    PREFIXES.forEach(prefix => {
        GENERATED_TREASURES.push({
            name: `${prefix.name}${item.name}`,
            description: `${prefix.desc}${item.desc}`,
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
