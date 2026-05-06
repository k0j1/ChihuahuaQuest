import { Treasure } from "../types";

// --- 既存のユニークお宝リスト (100種) ---
const UNIQUE_TREASURES = [
  // --- 骨・おやつ系 (Common) ---
  { name: "ただの骨", description: "何の変哲もない骨。カルシウムたっぷり。", value: 10, icon: "🦴" },
  { name: "干からびたジャーキー", description: "いつ埋めたか覚えていない熟成肉。", value: 15, icon: "🥩" },
  { name: "謎の魚の骨", description: "猫が埋めたのかもしれない。", value: 12, icon: "🐟" },
  { name: "チキンレッグの骨", description: "昨日の夕食の残りらしい。", value: 20, icon: "🍗" },
  { name: "ドッグビスケット", description: "少し湿気ているが、まだ食べられそうだ。", value: 25, icon: "🍪" },
  { name: "巨大な大腿骨", description: "これは恐竜の骨かもしれない…！", value: 300, icon: "🦕" },
  { name: "銀の骨", description: "ピカピカに磨かれた金属製の骨。", value: 150, icon: "🥈" },
  { name: "黄金の骨", description: "王様が愛犬に与えたとされる伝説の骨。", value: 800, icon: "🥇" },
  { name: "骨付きマンモス肉", description: "氷河期から保存されていた奇跡の肉。", value: 500, icon: "🍖" },
  { name: "食べかけのパン", description: "誰かが落とした朝食。", value: 5, icon: "🍞" },

  // --- おもちゃ系 (Common - Uncommon) ---
  { name: "テニスボール", description: "噛み心地が最高な黄色のボール。", value: 30, icon: "🎾" },
  { name: "穴あきフリスビー", description: "歴戦の猛者が噛み砕いた跡がある。", value: 40, icon: "🥏" },
  { name: "ゴムのアヒル", description: "押すと「ガー」と鳴く。", value: 45, icon: "🐤" },
  { name: "ねずみのおもちゃ", description: "猫用だが、チワワも意外と好き。", value: 35, icon: "🐁" },
  { name: "古びたぬいぐるみ", description: "片目が取れているクマ。", value: 50, icon: "🧸" },
  { name: "サッカーボール", description: "チワワには少し大きすぎる。", value: 60, icon: "⚽" },
  { name: "鳴るおもちゃ", description: "噛むと高音が出るホットドッグ型のおもちゃ。", value: 55, icon: "🌭" },
  { name: "ロープ", description: "引っ張り合いっこに最適。", value: 25, icon: "➰" },
  { name: "風船の残骸", description: "かつては空を飛んでいた。", value: 5, icon: "🎈" },
  { name: "木の棒", description: "公園で拾った、いい感じの棒。", value: 0, icon: "🪵" },

  // --- 日用品・ガラクタ (Junk) ---
  { name: "片方の靴下", description: "もう片方はどこへ行ったのだろう。", value: 10, icon: "🧦" },
  { name: "長靴", description: "雨の日に誰かが埋めたらしい。", value: 20, icon: "👢" },
  { name: "空き缶", description: "リサイクルに出すべきだ。", value: 5, icon: "🥫" },
  { name: "スニーカー", description: "紐がほどけている。", value: 30, icon: "👟" },
  { name: "壊れたメガネ", description: "レンズが割れている。", value: 15, icon: "👓" },
  { name: "新聞紙", description: "日付は10年前のものだ。", value: 5, icon: "📰" },
  { name: "リモコン", description: "チャンネルを変える権限。", value: 40, icon: "📺" },
  { name: "トイレットペーパー", description: "芯だけではない、まだ使える！", value: 20, icon: "🧻" },
  { name: "空のペットボトル", description: "噛むとペコペコ音が鳴る。", value: 8, icon: "🧴" },
  { name: "鍵", description: "どこの鍵かは不明。", value: 50, icon: "🗝️" },

  // --- 貴重品・アクセサリー (Rare) ---
  { name: "真珠のネックレス", description: "泥にまみれているが本物だ。", value: 400, icon: "📿" },
  { name: "ダイヤの指輪", description: "プロポーズに失敗した誰かが埋めた？", value: 1000, icon: "💍" },
  { name: "金の王冠", description: "チワワキングがかぶっていたもの。", value: 1500, icon: "👑" },
  { name: "ルビー", description: "情熱的な赤色の宝石。", value: 600, icon: "💎" },
  { name: "懐中時計", description: "針は止まっている。", value: 250, icon: "🕰️" },
  { name: "金の杯", description: "水を飲むには豪華すぎる。", value: 500, icon: "🏆" },
  { name: "古代のコイン", description: "博物館級の価値があるかもしれない。", value: 350, icon: "🪙" },
  { name: "ガラスの靴", description: "サイズが合うのはシンデレラだけ。", value: 300, icon: "👠" },
  { name: "スマートフォン", description: "画面がバキバキに割れている。", value: 100, icon: "📱" },
  { name: "財布", description: "中身はポイントカードだけだった。", value: 80, icon: "👛" },

  // --- 自然物・鉱石 (Nature/Ores) ---
  { name: "プラチナ貨", description: "かつての王国の通貨。", value: 300, icon: "🪙" },
  { name: "綺麗な貝殻", description: "海の音が聞こえる。", value: 40, icon: "🐚" },
  { name: "古代の土偶", description: "奇妙な形をした土器。", value: 150, icon: "🏺" },
  { name: "謎の石版", description: "解読不可能な古代文字が刻まれている。", value: 250, icon: "🪨" },
  { name: "化石", description: "アンモナイトのようだ。", value: 200, icon: "🐌" },
  { name: "錬金術師の石", description: "妖しく赤く光る未知の鉱石。", value: 660, icon: "💎" },
  { name: "隕石の欠片", description: "宇宙からの贈り物。", value: 800, icon: "☄️" },
  { name: "琥珀（虫入り）", description: "太古の虫が閉じ込められた宝石。", value: 320, icon: "🦟" },
  { name: "黄金のスカラベ", description: "古代エジプトの装飾品。", value: 550, icon: "🪲" },
  { name: "サファイアのブローチ", description: "深い青色が美しい装飾品。", value: 480, icon: "🪢" },

  // --- 魔法・神秘系 (Mystic/Magic) ---
  { name: "魔導書の切れ端", description: "失われた魔法が記されている。", value: 150, icon: "📜" },
  { name: "占いの水晶玉", description: "未来が見えるかもしれない。", value: 250, icon: "🔮" },
  { name: "妖精の粉", description: "キラキラと淡い光を放っている。", value: 300, icon: "✨" },
  { name: "エルフの弓", description: "精巧な装飾が施されている。", value: 450, icon: "🏹" },
  { name: "精霊のランプ", description: "ほのかに温かい。", value: 400, icon: "🪔" },
  { name: "魔法の薬瓶", description: "怪しげな液体が入っている。", value: 120, icon: "🧪" },
  { name: "天使の羽根", description: "とても軽く、純白の羽根。", value: 500, icon: "🪽" },
  { name: "龍のウロコ", description: "鉄よりも硬いと言われている。", value: 800, icon: "🐉" },
  { name: "星の砂", description: "夜空のように瞬く不思議な砂。", value: 350, icon: "🌌" },
  { name: "古代ルーン石", description: "謎の文字が刻まれた石板。", value: 200, icon: "🪨" },

  // --- 変なもの・ユニーク (Funny/Unique) ---
  { name: "モアイ像", description: "なぜこんなところにミニモアイが？", value: 500, icon: "🗿" },
  { name: "宇宙人の仮面", description: "我々は来ました。", value: 150, icon: "👽" },
  { name: "ラブレター", description: "読まずに埋めたようだ。", value: 0, icon: "💌" },
  { name: "テストの答案", description: "0点だったので隠蔽された。", value: 5, icon: "📝" },
  { name: "誰かの入れ歯", description: "おじいちゃんが探している。", value: 100, icon: "🦷" },
  { name: "魔法のランプ", description: "こすっても魔人は出てこない。", value: 600, icon: "🧞" },
  { name: "ビデオテープ", description: "再生デッキがない。", value: 30, icon: "📼" },
  { name: "フロッピーディスク", description: "保存アイコンの実物。", value: 50, icon: "💾" },
  { name: "ゲームコントローラー", description: "上上下下左右左右BA。", value: 120, icon: "🎮" },
  { name: "招き猫", description: "ここ掘れニャンニャン。", value: 300, icon: "🐱" },

  // --- 装備品っぽいもの (Gear) ---
  { name: "勇者の剣", description: "錆びているおもちゃの剣。", value: 80, icon: "🗡️" },
  { name: "木の盾", description: "鍋の蓋かもしれない。", value: 40, icon: "🛡️" },
  { name: "魔法の杖", description: "ただの枯れ枝にしか見えない。", value: 50, icon: "🪄" },
  { name: "ヘルメット", description: "安全第一。", value: 60, icon: "⛑️" },
  { name: "サングラス", description: "クールなチワワになれる。", value: 70, icon: "🕶️" },
  { name: "赤いリボン", description: "可愛さがアップする。", value: 30, icon: "🎀" },
  { name: "ネクタイ", description: "ビジネスチワワ。", value: 40, icon: "👔" },
  { name: "リュック", description: "おやつがたくさん入る。", value: 90, icon: "🎒" },
  { name: "マント", description: "スーパーチワワ参上。", value: 100, icon: "🧛" },
  { name: "ボクシンググローブ", description: "最強を目指して。", value: 110, icon: "🥊" },

  // --- 楽器 (Music) ---
  { name: "トランペット", description: "肺活量が足りない。", value: 150, icon: "🎺" },
  { name: "ギター", description: "ロックな魂。", value: 180, icon: "🎸" },
  { name: "バイオリン", description: "優雅な音色がしそう。", value: 250, icon: "🎻" },
  { name: "マイク", description: "遠吠え用。", value: 60, icon: "🎤" },
  { name: "太鼓", description: "ドンドン叩こう。", value: 70, icon: "🥁" },

  // --- 乗り物 (Vehicles) ---
  { name: "ミニカー", description: "赤いスポーツカー。", value: 50, icon: "🏎️" },
  { name: "三輪車", description: "ペダルに足が届かない。", value: 80, icon: "🚲" },
  { name: "ロケットのおもちゃ", description: "月まで行けそう。", value: 120, icon: "🚀" },
  { name: "ＵＦＯ", description: "未確認飛行物体。", value: 999, icon: "🛸" },
  { name: "スケートボード", description: "バランス感覚が必要。", value: 60, icon: "🛹" },

  // --- 季節もの (Seasonal) ---
  { name: "クリスマスツリー", description: "季節外れの飾り。", value: 100, icon: "🎄" },
  { name: "カボチャのランタン", description: "ハロウィンの残り。", value: 40, icon: "🎃" },
  { name: "お年玉袋", description: "中身が入っている！！", value: 500, icon: "🧧" },
  { name: "こいのぼり", description: "屋根より低い。", value: 60, icon: "🎏" },
  { name: "雪だるま", description: "なぜ溶けていないのか不思議だ。", value: 0, icon: "⛄" },
  
  // --- 新規追加 (Added based on user request) ---
  { name: "金の延べ棒", description: "重くて運ぶのが大変だ。", value: 1200, icon: "🧱" },
  { name: "おもちゃの兵隊", description: "誰かが遊んでいたようだ。", value: 40, icon: "💂" },
  { name: "古びたコイン袋", description: "中身は空っぽだった。", value: 20, icon: "💰" },
  { name: "地球儀", description: "世界は広い。", value: 150, icon: "🌍" },
  { name: "宝箱", description: "中からさらに骨が出てきた。", value: 800, icon: "🧰" }
];

// --- 自動生成用の設定 ---

// 接頭辞（状態やランク）
const PREFIXES = [
  { name: "ボロボロの", valueMod: 0.5, desc: "かなり使い込まれた" },
  { name: "普通の", valueMod: 1.0, desc: "どこにでもありそうな" },
  { name: "少し良い", valueMod: 1.2, desc: "ちょっと高級な" },
  { name: "硬い", valueMod: 1.5, desc: "噛みごたえのある" },
  { name: "大きな", valueMod: 2.0, desc: "存在感のある" },
  { name: "銀の", valueMod: 5.0, desc: "銀色に輝く" },
  { name: "金の", valueMod: 10.0, desc: "黄金に輝く" },
  { name: "伝説の", valueMod: 50.0, desc: "歴史に名を残す" },
];

// ベースアイテム（50種）
const BASE_ITEMS = [
    { name: "ホネ", icon: "🦴", baseVal: 10, desc: "骨。" },
    { name: "空き缶", icon: "🥫", baseVal: 15, desc: "サビついている。" },
    { name: "ガラクタ", icon: "🪛", baseVal: 12, desc: "使い道がわからない部品。" },
    { name: "歯車", icon: "⚙️", baseVal: 20, desc: "古い機械の一部。" },
    { name: "真鍮のコイン", icon: "🪙", baseVal: 30, desc: "くすんだ硬貨。" },
    { name: "水晶", icon: "🔮", baseVal: 140, desc: "透き通った石。" },
    { name: "レアメタル鉱石", icon: "🪨", baseVal: 250, desc: "工業的価値が高い。" },
    { name: "銀の延べ棒", icon: "🥈", baseVal: 400, desc: "ずっしりと重い銀。" },
    { name: "金の延べ棒", icon: "🧱", baseVal: 1200, desc: "まばゆい光を放つ黄金。" },
    { name: "プラチナインゴット", icon: "🤍", baseVal: 2000, desc: "希少価値が極めて高い金属。" },
    { name: "翡翠の勾玉", icon: "🟢", baseVal: 350, desc: "古の呪術具。" },
    { name: "ルビーの原石", icon: "🟥", baseVal: 450, desc: "未加工の宝石。" },
    { name: "サファイア", icon: "🟦", baseVal: 500, desc: "青く輝く宝石。" },
    { name: "エメラルド", icon: "🟩", baseVal: 550, desc: "緑の宝石。" },
    { name: "ダイヤモンド", icon: "💎", baseVal: 1500, desc: "最高硬度の輝き。" },
    { name: "指輪", icon: "💍", baseVal: 300, desc: "キラキラ。" },
    { name: "首飾り", icon: "📿", baseVal: 280, desc: "豪華な装飾。" },
    { name: "古代コイン", icon: "🪙", baseVal: 150, desc: "歴史的価値。" },
    { name: "お札", icon: "💵", baseVal: 80, desc: "旧紙幣。" },
    { name: "金塊", icon: "👑", baseVal: 900, desc: "純金の塊。" },
    { name: "宝石箱", icon: "🧰", baseVal: 800, desc: "宝物が詰まっている。" },
    { name: "剣", icon: "⚔️", baseVal: 200, desc: "武器。" },
    { name: "盾", icon: "🛡️", baseVal: 150, desc: "防具。" },
    { name: "杖", icon: "🪄", baseVal: 180, desc: "魔法。" },
    { name: "魔導書", icon: "📕", baseVal: 300, desc: "禁断の知識。" },
    { name: "古文書", icon: "📜", baseVal: 220, desc: "失われた歴史。" },
    { name: "アンモナイトの化石", icon: "🐌", baseVal: 130, desc: "太古のロマン。" },
    { name: "琥珀", icon: "🟠", baseVal: 140, desc: "樹脂の化石。" },
    { name: "真珠", icon: "⚪", baseVal: 200, desc: "海の宝。" },
    { name: "黒曜石", icon: "⬛", baseVal: 90, desc: "鋭い断面を持つ火山ガラス。" },
    { name: "隕石の欠片", icon: "☄️", baseVal: 400, desc: "星の欠片。" },
    { name: "金杯", icon: "🏆", baseVal: 600, desc: "王の杯。" },
    { name: "王冠", icon: "👑", baseVal: 1200, desc: "王の証。" },
    { name: "割れたお茶碗", icon: "🥣", baseVal: 5, desc: "ただのゴミ。" },
    { name: "空のペットボトル", icon: "🧴", baseVal: 2, desc: "リサイクルへ。" },
    { name: "古いクツ", icon: "👞", baseVal: 8, desc: "ボロボロの靴。" },
    { name: "謎の基盤", icon: "💻", baseVal: 50, desc: "機械のパーツ。" },
    { name: "錆びたカギ", icon: "🗝️", baseVal: 10, desc: "もう使えない。" },
    { name: "チタン鉱石", icon: "🪨", baseVal: 280, desc: "軽くて強い金属の元。" },
    { name: "ミスリル鉱石", icon: "✨", baseVal: 700, desc: "伝説の金属。" },
    { name: "オリハルコン鉱石", icon: "🔥", baseVal: 1000, desc: "幻の金属。" },
    { name: "大理石の破片", icon: "🏛️", baseVal: 40, desc: "美しい石材。" },
    { name: "アメジスト", icon: "🟪", baseVal: 300, desc: "紫の水晶。" },
    { name: "トパーズ", icon: "🟨", baseVal: 250, desc: "黄色の宝石。" },
    { name: "オパール", icon: "🌈", baseVal: 350, desc: "虹色に輝く石。" },
    { name: "壺", icon: "🏺", baseVal: 50, desc: "年代物の器。" },
    { name: "仮面", icon: "🎭", baseVal: 70, desc: "ミステリアスな顔当て。" },
    { name: "羅針盤", icon: "🧭", baseVal: 90, desc: "方角を示す道具。" },
    { name: "望遠鏡", icon: "🔭", baseVal: 120, desc: "遠くを見る道具。" },
    { name: "アンティーク鍵", icon: "🗝️", baseVal: 60, desc: "古い扉の鍵。" }
];

// 生成リストの作成 (50アイテム * 8プレフィックス = 400種)
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

// Assign IDs 1-N for the Picture Book
// 先頭100個はユニーク、以降は生成アイテム (合計500個)
export const TREASURE_REGISTRY: Omit<Treasure, 'id'>[] = [...UNIQUE_TREASURES, ...GENERATED_TREASURES].map((item, index) => ({
    ...item,
    catalogId: index + 1
}));

// 重み付けなどのロジックはなく、完全にランダムに選択する
export const generateTreasure = async (): Promise<Treasure> => {
  // 鑑定している演出のために少し待機時間を設ける
  await new Promise(resolve => setTimeout(resolve, 800));

  const randomIndex = Math.floor(Math.random() * TREASURE_REGISTRY.length);
  const selectedTreasure = TREASURE_REGISTRY[randomIndex];

  return {
    id: crypto.randomUUID(), // Unique instance ID
    ...selectedTreasure
  };
};