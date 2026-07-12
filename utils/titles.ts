import { TREASURE_REGISTRY } from '../services/geminiService';

export interface Title {
    id: string;
    nameEn: string;
    nameJa: string;
    conditionEn: string;
    conditionJa: string;
    isUnlocked: (inventory: Record<string, { count: number }>) => boolean;
    priority: number; 
}

export const TITLES: Title[] = [
    {
        id: "novice",
        nameEn: "Novice Digger",
        nameJa: "かけ出しの穴掘り",
        conditionEn: "Default title",
        conditionJa: "デフォルト",
        isUnlocked: () => true,
        priority: 0,
    },
    {
        id: "beginner",
        nameEn: "Treasure Hunter",
        nameJa: "トレジャーハンター",
        conditionEn: "Discover 10 unique treasures",
        conditionJa: "10種類の財宝を発見",
        isUnlocked: (inv) => Object.keys(inv).length >= 10,
        priority: 10,
    },
    {
        id: "expert",
        nameEn: "Expert Explorer",
        nameJa: "熟練の探検家",
        conditionEn: "Discover 50 unique treasures",
        conditionJa: "50種類の財宝を発見",
        isUnlocked: (inv) => Object.keys(inv).length >= 50,
        priority: 20,
    },
    {
        id: "master",
        nameEn: "Master of Relics",
        nameJa: "遺物の達人",
        conditionEn: "Discover 100 unique treasures",
        conditionJa: "100種類の財宝を発見",
        isUnlocked: (inv) => Object.keys(inv).length >= 100,
        priority: 30,
    },
    {
        id: "legend",
        nameEn: "Legendary Archaeologist",
        nameJa: "伝説の考古学者",
        conditionEn: "Discover all unique treasures",
        conditionJa: "すべての財宝を発見",
        isUnlocked: (inv) => Object.keys(inv).length >= TREASURE_REGISTRY.length,
        priority: 100,
    },
    {
        id: "gem_collector",
        nameEn: "Gem Collector",
        nameJa: "宝石コレクター",
        conditionEn: "Collect a Ruby, Sapphire, Emerald, and Diamond",
        conditionJa: "ルビー、サファイア、エメラルド、ダイヤモンドを収集",
        isUnlocked: (inv) => {
             const hasRuby = Object.keys(inv).some(id => TREASURE_REGISTRY.find(t => t.catalogId.toString() === id)?.name.includes("ルビー"));
             const hasSapphire = Object.keys(inv).some(id => TREASURE_REGISTRY.find(t => t.catalogId.toString() === id)?.name.includes("サファイア"));
             const hasEmerald = Object.keys(inv).some(id => TREASURE_REGISTRY.find(t => t.catalogId.toString() === id)?.name.includes("エメラルド"));
             const hasDiamond = Object.keys(inv).some(id => TREASURE_REGISTRY.find(t => t.catalogId.toString() === id)?.name.includes("ダイヤモンド"));
             return hasRuby && hasSapphire && hasEmerald && hasDiamond;
        },
        priority: 40,
    },
    {
        id: "sword_master",
        nameEn: "Sword Master",
        nameJa: "剣の達人",
        conditionEn: "Collect a Short Sword and Long Sword",
        conditionJa: "ショートソードとロングソードを収集",
        isUnlocked: (inv) => {
             const hasShort = Object.keys(inv).some(id => TREASURE_REGISTRY.find(t => t.catalogId.toString() === id)?.name.includes("ショートソード"));
             const hasLong = Object.keys(inv).some(id => TREASURE_REGISTRY.find(t => t.catalogId.toString() === id)?.name.includes("ロングソード"));
             return hasShort && hasLong;
        },
        priority: 35,
    },
    {
        id: "royalty",
        nameEn: "Royalty",
        nameJa: "王族の証",
        conditionEn: "Collect a Crown and Tiara",
        conditionJa: "王冠とティアラを収集",
        isUnlocked: (inv) => {
             const hasCrown = Object.keys(inv).some(id => TREASURE_REGISTRY.find(t => t.catalogId.toString() === id)?.name.includes("王冠"));
             const hasTiara = Object.keys(inv).some(id => TREASURE_REGISTRY.find(t => t.catalogId.toString() === id)?.name.includes("ティアラ"));
             return hasCrown && hasTiara;
        },
        priority: 45,
    },
    {
        id: "cursed",
        nameEn: "Cursed Soul",
        nameJa: "呪われし魂",
        conditionEn: "Collect 5 cursed items",
        conditionJa: "呪われたアイテムを5種類収集",
        isUnlocked: (inv) => {
             return Object.keys(inv).filter(id => TREASURE_REGISTRY.find(t => t.catalogId.toString() === id)?.name.includes("呪われた")).length >= 5;
        },
        priority: 50,
    },
    {
        id: "legendary_hunter",
        nameEn: "Mythical Hunter",
        nameJa: "神話の狩人",
        conditionEn: "Collect 3 legendary items",
        conditionJa: "伝説のアイテムを3種類収集",
        isUnlocked: (inv) => {
             return Object.keys(inv).filter(id => TREASURE_REGISTRY.find(t => t.catalogId.toString() === id)?.name.includes("伝説の")).length >= 3;
        },
        priority: 60,
    }
];

export const getHighestPriorityTitle = (inventory: Record<string, { count: number }>): Title => {
    const unlockedTitles = TITLES.filter(t => t.isUnlocked(inventory));
    return unlockedTitles.sort((a, b) => b.priority - a.priority)[0];
};

export const getUnlockedTitles = (inventory: Record<string, { count: number }>): Title[] => {
    return TITLES.filter(t => t.isUnlocked(inventory)).sort((a, b) => b.priority - a.priority);
};