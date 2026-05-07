import { Treasure } from "../types";

const UNIQUE_TREASURES = [
  // --- ガラクタ・日用品 (Junk / Common) ---
  { name: "欠けたルーン石", description: "力が失われた石。", value: 10, icon: "Hex" },
  { name: "古びた鍵", description: "どこの扉を開けるのだろう。", value: 15, icon: "Key" },
  { name: "サビたナイフ", description: "もはや使えない。", value: 12, icon: "Sword" },
  { name: "ただの木の実", description: "食べられない木の実。", value: 5, icon: "Sprout" },
  { name: "泥だらけの靴", description: "誰かの長靴。", value: 8, icon: "Box" },
  { name: "ボロボロの鎖", description: "何かに繋がれていた。", value: 10, icon: "Circle" },
  { name: "謎の歯車", description: "古代機械の部品。", value: 20, icon: "Settings" },
  { name: "割れた杯", description: "かつては綺麗だった杯。", value: 12, icon: "Droplet" },
  { name: "すすけたガラス玉", description: "ほんのり光っている気がする。", value: 15, icon: "Circle" },
  { name: "古い地図の切れ端", description: "一部だけでは意味がない。", value: 25, icon: "Scroll" },
  // 11-20  
  { name: "ただの石ころ", description: "どこにでもある石。", value: 2, icon: "Hex" },
  { name: "奇妙な根っこ", description: "魔法薬の材料になるかも。", value: 8, icon: "Sprout" },
  { name: "かすかな光の粉", description: "妖精の粉の搾りカス。", value: 18, icon: "Sparkles" },
  { name: "真鍮の指輪", description: "安っぽい指輪。", value: 30, icon: "Circle" },
  { name: "曲がった釘", description: "建築に使われていた。", value: 5, icon: "Zap" },
  { name: "枯れた薬草", description: "効果はなさそう。", value: 4, icon: "Leaf" },
  { name: "魔導書の破れ紙", description: "解読できない文字。", value: 20, icon: "Scroll" },
  { name: "壊れた方位磁針", description: "北を指さない。", value: 25, icon: "Compass" },
  { name: "鉄くず", description: "溶かせば何かに使える。", value: 10, icon: "Square" },
  { name: "ひび割れた瓶", description: "何も入れられない。", value: 8, icon: "FlaskConical" },
  // 21-30
  { name: "動物の骨", description: "何か獣の骨らしい。", value: 15, icon: "Bone" },
  { name: "銅貨", description: "見慣れない国の硬貨。", value: 40, icon: "Coins" },
  { name: "銀貨", description: "少し価値のある銀貨。", value: 100, icon: "Coins" },
  { name: "金貨", description: "輝きを失っていない金貨。", value: 500, icon: "Coins" },
  { name: "黒い羽", description: "カラスとは違う不気味な羽。", value: 25, icon: "Feather" },
  { name: "トロールの角", description: "意外と高く売れる。", value: 120, icon: "Triangle" },
  { name: "オークの牙", description: "装飾品になる。", value: 80, icon: "Bone" },
  { name: "ゴブリンの耳", description: "討伐の証。", value: 60, icon: "Target" },
  { name: "スライムの水滴", description: "ひんやりしている。", value: 45, icon: "Droplet" },
  { name: "コウモリの翼", description: "錬金術に使える。", value: 50, icon: "Feather" },
  // 31-40
  { name: "小さな水晶", description: "わずかに魔力を帯びている。", value: 150, icon: "Gem" },
  { name: "魔獣の皮", description: "丈夫な革。", value: 90, icon: "Square" },
  { name: "大きなアメジスト", description: "美しい紫の宝石。", value: 300, icon: "Gem" },
  { name: "トパーズ", description: "黄色く輝く宝石。", value: 250, icon: "Gem" },
  { name: "サファイア", description: "深い青の宝石。", value: 500, icon: "Diamond" },
  { name: "エメラルド", description: "美しい緑の宝石。", value: 550, icon: "Diamond" },
  { name: "ルビー", description: "情熱的な赤の宝石。", value: 600, icon: "Diamond" },
  { name: "ダイヤモンド", description: "最高級の輝き。", value: 1500, icon: "Diamond" },
  { name: "黒曜石", description: "鋭い断面を持つ火山ガラス。", value: 180, icon: "Hex" },
  { name: "ミスリル鉱石", description: "軽くて丈夫な幻の金属。", value: 800, icon: "Square" },
  // 41-50
  { name: "オリハルコン鉱石", description: "最も硬いとされる伝説の金属。", value: 1200, icon: "Hex" },
  { name: "アダマンタイト", description: "神々が創り出したと言われる鉱石。", value: 1500, icon: "Triangle" },
  { name: "銀の延べ棒", description: "ずっしりと重い銀。", value: 600, icon: "Box" },
  { name: "金の延べ棒", description: "まばゆい光を放つ黄金。", value: 1500, icon: "Box" },
  { name: "プラチナ貨", description: "かつての王国の高額通貨。", value: 800, icon: "Coins" },
  { name: "古代の金貨袋", description: "ずっしりと重い袋。", value: 1000, icon: "PackageOpen" },
  { name: "精霊のランプ", description: "ほのかに温かい。", value: 450, icon: "Flame" },
  { name: "魔法の薬瓶", description: "怪しげな液体が入っている。", value: 220, icon: "FlaskConical" },
  { name: "天使の羽根", description: "とても軽く、純白の羽根。", value: 500, icon: "Feather" },
  { name: "龍のウロコ", description: "鉄よりも硬いと言われている。", value: 800, icon: "Shield" },
  // 51-60
  { name: "星の砂", description: "夜空のように瞬く不思議な砂。", value: 350, icon: "Sparkles" },
  { name: "古代ルーン石", description: "謎の文字が刻まれた石板。", value: 600, icon: "Scroll" },
  { name: "綺麗な貝殻", description: "海の音が聞こえる。", value: 80, icon: "Shell" },
  { name: "古代の土偶", description: "奇妙な形をした土器。", value: 250, icon: "Circle" },
  { name: "謎の石版", description: "解読不可能な古代文字が刻まれている。", value: 400, icon: "Scroll" },
  { name: "アンモナイトの化石", description: "太古のロマン。", value: 300, icon: "Circle" },
  { name: "錬金術師の石", description: "妖しく赤く光る未知の鉱石。", value: 900, icon: "Gem" },
  { name: "隕石の欠片", description: "宇宙からの贈り物。", value: 1000, icon: "Star" },
  { name: "琥珀（虫入り）", description: "太古の秘密が閉じ込められた宝石。", value: 450, icon: "Hex" },
  { name: "黄金のスカラベ", description: "古代エジプトの装飾品。", value: 850, icon: "Circle" },
  // 61-70
  { name: "サファイアのブローチ", description: "深い青色が美しい装飾品。", value: 700, icon: "Diamond" },
  { name: "真珠のネックレス", description: "泥にまみれているが本物だ。", value: 650, icon: "Circle" },
  { name: "ダイヤの指輪", description: "とても美しい輝き。", value: 1200, icon: "Diamond" },
  { name: "金の王冠", description: "失われた王国の証。", value: 2000, icon: "Crown" },
  { name: "懐中時計", description: "針は止まっている。", value: 500, icon: "Compass" },
  { name: "金の杯", description: "水を飲むには豪華すぎる。", value: 800, icon: "Droplet" },
  { name: "ガラスの靴", description: "透き通った靴。", value: 500, icon: "Star" },
  { name: "エルフの弓", description: "精巧な装飾が施されている。", value: 600, icon: "Crosshair" },
  { name: "モアイ像", description: "なぜこんなところにミニモアイが？", value: 500, icon: "Box" },
  { name: "魔法のランプ", description: "こすっても魔人は出てこない。", value: 700, icon: "Flame" },
  // 71-80
  { name: "招き猫", description: "ご利益がありそうだ。", value: 400, icon: "Circle" },
  { name: "太陽の紋章", description: "熱を帯びている。", value: 550, icon: "Sun" },
  { name: "月の首飾り", description: "暗闇で光る。", value: 550, icon: "Moon" },
  { name: "海賊の宝箱", description: "開けるのに鍵が必要だ。", value: 1500, icon: "PackageOpen" },
  { name: "勇者の剣", description: "かつて魔王を討ったとされる。", value: 1200, icon: "Sword" },
  { name: "聖騎士の盾", description: "あらゆる邪気を弾く。", value: 1000, icon: "Shield" },
  { name: "大魔導士の杖", description: "強大な魔力を秘める。", value: 1100, icon: "Wand2" },
  { name: "フェニックスの尾", description: "命を呼び覚ます。", value: 1500, icon: "Feather" },
  { name: "賢者の石", description: "あらゆる物質を黄金に変える。", value: 5000, icon: "Gem" },
  { name: "星の羅針盤", description: "運命の向かう先を示す。", value: 950, icon: "Compass" },
  // 81-90
  { name: "白銀のティアラ", description: "王女の忘れ物。", value: 1000, icon: "Crown" },
  { name: "死霊術士の頭骨", description: "不吉なオーラを放つ。", value: 800, icon: "Skull" },
  { name: "妖魔の笛", description: "吹くと魔物を呼び寄せる。", value: 400, icon: "Cross" },
  { name: "大地のクリスタル", description: "自然の力が満ちている。", value: 1800, icon: "Diamond" },
  { name: "火炎のルビー", description: "触れると火傷しそうだ。", value: 1200, icon: "Flame" },
  { name: "氷結のサファイア", description: "周囲の気温を下げる。", value: 1200, icon: "Snowflake" },
  { name: "迅雷のトパーズ", description: "微小な雷を発している。", value: 1200, icon: "Zap" },
  { name: "神聖なる聖杯", description: "どんな傷も癒やす水を湧き出す。", value: 3000, icon: "Droplet" },
  { name: "次元の鍵", description: "別の世界への扉を開く。", value: 2500, icon: "Key" },
  { name: "世界樹の葉", description: "奇跡の治癒力を持つ。", value: 1500, icon: "Leaf" },
  // 91-100
  { name: "ユニコーンの角", description: "あらゆる毒を浄化する。", value: 1200, icon: "Wand2" },
  { name: "ドラゴンの卵", description: "少し温かい。", value: 4000, icon: "Circle" },
  { name: "王家の印章", description: "絶大な権力を示す。", value: 1500, icon: "Hex" },
  { name: "空飛ぶ絨毯", description: "今はただの古い絨毯。", value: 800, icon: "Square" },
  { name: "禁断の魔導書", description: "開いてはならない。", value: 2000, icon: "Book" },
  { name: "光の剣", description: "暗闇を切り裂く。", value: 2500, icon: "Sword" },
  { name: "闇の盾", description: "光を飲み込む。", value: 2200, icon: "Shield" },
  { name: "伝説のメダル", description: "選ばれし勇者の証。", value: 1000, icon: "Medal" },
  { name: "聖龍の涙", description: "究極の宝石。", value: 8000, icon: "Droplet" },
  { name: "女神の指輪", description: "すべてのステータスが上がる。", value: 5000, icon: "Diamond" },
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
    { name: "ショートソード", icon: "Sword", baseVal: 50, desc: "基本的な剣。" },
    { name: "ロングソード", icon: "Sword", baseVal: 80, desc: "リーチの長い剣。" },
    { name: "ダガー", icon: "Sword", baseVal: 30, desc: "短剣。" },
    { name: "バックラー", icon: "Shield", baseVal: 40, desc: "小さな盾。" },
    { name: "カイトシールド", icon: "Shield", baseVal: 90, desc: "騎士の盾。" },
    { name: "ウッドボウ", icon: "Crosshair", baseVal: 50, desc: "木の弓。" },
    { name: "クロスボウ", icon: "Crosshair", baseVal: 120, desc: "強力な弦。" },
    { name: "スタッフ", icon: "Wand2", baseVal: 60, desc: "魔法使いの杖。" },
    { name: "ワンド", icon: "Wand2", baseVal: 100, desc: "魔力を集める。" },
    { name: "メイス", icon: "Hammer", baseVal: 70, desc: "打撃武器。" },
    { name: "スピア", icon: "Sword", baseVal: 70, desc: "槍。" },
    { name: "ハルバード", icon: "Sword", baseVal: 110, desc: "斧槍。" },
    { name: "レザーアーマー", icon: "Square", baseVal: 80, desc: "革の鎧。" },
    { name: "チェインメイル", icon: "Square", baseVal: 150, desc: "鎖帷子。" },
    { name: "プレートアーマー", icon: "Shield", baseVal: 300, desc: "鉄の鎧。" },
    { name: "アイアンヘルム", icon: "Circle", baseVal: 90, desc: "鉄の兜。" },
    { name: "ガントレット", icon: "Square", baseVal: 60, desc: "腕当て。" },
    { name: "マント", icon: "Wind", baseVal: 50, desc: "風をはらむ。" },
    { name: "ブーツ", icon: "Square", baseVal: 40, desc: "旅の靴。" },
    { name: "ポーション", icon: "FlaskConical", baseVal: 20, desc: "回復薬。" },
    { name: "エーテル", icon: "FlaskConical", baseVal: 50, desc: "魔力回復薬。" },
    { name: "エリクサー", icon: "FlaskConical", baseVal: 500, desc: "万能薬。" },
    { name: "魔導書", icon: "Book", baseVal: 200, desc: "魔法の書。" },
    { name: "古文書", icon: "Scroll", baseVal: 150, desc: "古い記録。" },
    { name: "アミュレット", icon: "Medal", baseVal: 250, desc: "護符。" },
    { name: "リング", icon: "Circle", baseVal: 180, desc: "指輪。" },
    { name: "ネックレス", icon: "Medal", baseVal: 200, desc: "首飾り。" },
    { name: "ピアス", icon: "Sparkles", baseVal: 100, desc: "耳飾り。" },
    { name: "ルビー", icon: "Diamond", baseVal: 400, desc: "赤い宝石。" },
    { name: "サファイア", icon: "Diamond", baseVal: 400, desc: "青い宝石。" },
    { name: "エメラルド", icon: "Diamond", baseVal: 400, desc: "緑の宝石。" },
    { name: "ダイヤモンド", icon: "Diamond", baseVal: 1000, desc: "透明な宝石。" },
    { name: "魔石", icon: "Gem", baseVal: 300, desc: "魔力を秘めた石。" },
    { name: "ルーンストーン", icon: "Hex", baseVal: 250, desc: "文字が刻まれた石。" },
    { name: "クリスタル", icon: "Gem", baseVal: 350, desc: "水晶。" },
    { name: "鉄鉱石", icon: "Triangle", baseVal: 30, desc: "鉄の原料。" },
    { name: "銀鉱石", icon: "Triangle", baseVal: 80, desc: "銀の原料。" },
    { name: "金鉱石", icon: "Triangle", baseVal: 200, desc: "金の原料。" },
    { name: "宝箱", icon: "PackageOpen", baseVal: 500, desc: "箱自体。" },
    { name: "金貨袋", icon: "Coins", baseVal: 300, desc: "お金が入っている。" },
    { name: "王冠", icon: "Crown", baseVal: 800, desc: "王の証。" },
    { name: "ティアラ", icon: "Crown", baseVal: 600, desc: "王女の証。" },
    { name: "聖杯", icon: "Droplet", baseVal: 1000, desc: "神聖な儀式の杯。" },
    { name: "鍵", icon: "Key", baseVal: 100, desc: "扉を開く。" },
    { name: "コンパス", icon: "Compass", baseVal: 80, desc: "方角を示す。" },
    { name: "望遠鏡", icon: "Telescope", baseVal: 120, desc: "遠くを見る。" },
    { name: "ランタン", icon: "Flame", baseVal: 60, desc: "暗闇を照らす。" },
    { name: "スカル", icon: "Skull", baseVal: 40, desc: "骨。" },
    { name: "牙", icon: "Bone", baseVal: 30, desc: "獣の牙。" },
    { name: "鱗", icon: "Shield", baseVal: 50, desc: "竜の鱗。" }
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
