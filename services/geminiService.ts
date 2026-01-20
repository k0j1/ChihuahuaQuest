import { Treasure } from "../types";

// 静的なお宝データリスト (約100種類)
const TREASURE_LIST: Omit<Treasure, 'id'>[] = [
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

  // --- 自然物 (Nature) ---
  { name: "四つ葉のクローバー", description: "幸運のしるし。", value: 77, icon: "🍀" },
  { name: "綺麗な貝殻", description: "海の音が聞こえる。", value: 40, icon: "🐚" },
  { name: "どんぐり", description: "リスが隠したものを横取り。", value: 5, icon: "🌰" },
  { name: "松ぼっくり", description: "形が整っている。", value: 10, icon: "🌲" },
  { name: "化石", description: "アンモナイトのようだ。", value: 200, icon: "🐌" },
  { name: "光るキノコ", description: "食べない方が良さそうだ。", value: 60, icon: "🍄" },
  { name: "隕石の欠片", description: "宇宙からの贈り物。", value: 800, icon: "☄️" },
  { name: "サソリの標本", description: "毒はない、たぶん。", value: 120, icon: "🦂" },
  { name: "カブトムシ", description: "まだ生きている！", value: 50, icon: "🪲" },
  { name: "バラの花", description: "情熱的な愛の証。", value: 30, icon: "🌹" },

  // --- 食べ物系 (Food) ---
  { name: "ハンバーガー", description: "少し砂がついているが気にしない。", value: 80, icon: "🍔" },
  { name: "ピザ", description: "チーズたっぷりの1ピース。", value: 70, icon: "🍕" },
  { name: "ドーナツ", description: "穴の開いた甘い誘惑。", value: 60, icon: "🍩" },
  { name: "おにぎり", description: "誰かのピクニックの忘れ物。", value: 40, icon: "🍙" },
  { name: "高級寿司", description: "なぜこんなところにトロが？", value: 300, icon: "🍣" },
  { name: "ソフトクリーム", description: "溶けていない、奇跡だ。", value: 50, icon: "🍦" },
  { name: "バースデーケーキ", description: "誰かの誕生日を祝おう。", value: 200, icon: "🎂" },
  { name: "いちご", description: "甘酸っぱい初恋の味。", value: 20, icon: "🍓" },
  { name: "メロン", description: "高級フルーツ。", value: 400, icon: "🍈" },
  { name: "エビフライ", description: "しっぽまで食べる派。", value: 90, icon: "🍤" },

  // --- 変なもの・ユニーク (Funny/Unique) ---
  { name: "モアイ像", description: "なぜこんなところにミニモアイが？", value: 500, icon: "🗿" },
  { name: "宇宙人の仮面", description: "我々は来ました。", value: 150, icon: "👽" },
  { name: "ラブレター", description: "読まずに埋めたようだ。", value: 0, icon: "💌" },
  { name: "テストの答案", description: "0点だったので隠蔽された。", value: -10, icon: "📝" },
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
  { name: "雪だるま", description: "なぜ溶けていないのか不思議だ。", value: 0, icon: "⛄" }
];

// 重み付けなどのロジックはなく、完全にランダムに選択する
export const generateTreasure = async (): Promise<Treasure> => {
  // 鑑定している演出のために少し待機時間を設ける
  await new Promise(resolve => setTimeout(resolve, 800));

  const randomIndex = Math.floor(Math.random() * TREASURE_LIST.length);
  const selectedTreasure = TREASURE_LIST[randomIndex];

  return {
    id: crypto.randomUUID(),
    ...selectedTreasure
  };
};