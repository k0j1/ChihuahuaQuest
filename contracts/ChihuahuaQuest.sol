// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

/**
 * @title ChihuahuaQuest
 * @dev 財宝の記録と報酬の払い出しを管理するメインコントラクト
 * フロントエンドからトランザクションを送信し、バックエンドの署名で検証する
 */
contract ChihuahuaQuest is Ownable {
    using ECDSA for bytes32;

    IERC20 public chhToken;
    
    // 署名を行うバックエンドのウォレットアドレス
    address public backendSigner;

    // 財宝IDごとの報酬設定
    struct RewardConfig {
        uint256 chhAmount;
    }
    mapping(uint256 => RewardConfig) public treasureRewards;

    // プレイヤーが獲得した財宝のIDリスト（図鑑用）
    mapping(address => uint256[]) private playerTreasures;
    
    // プレイヤーが特定の財宝を獲得した回数
    mapping(address => mapping(uint256 => uint256)) public treasureCounts;

    // リプレイ攻撃（同じ署名を使い回す不正）を防止するためのnonce
    mapping(address => uint256) public nonces;

    // イベント定義
    event SessionCompleted(address indexed player, uint256 totalReward, uint256[] treasuresFound);
    event RewardConfigUpdated(uint256 indexed treasureId, uint256 chhAmount);

    /**
     * @param _chhTokenAddress 既存のCHHTokenのアドレス
     * @param _backendSigner 署名を行うバックエンドのアドレス
     */
    constructor(address _chhTokenAddress, address _backendSigner) Ownable(msg.sender) {
        chhToken = IERC20(_chhTokenAddress);
        backendSigner = _backendSigner;
    }

    /**
     * @dev 財宝IDごとの報酬額を設定・更新する（Ownerのみ）
     */
    function setTreasureReward(uint256 treasureId, uint256 chhAmount) external onlyOwner {
        treasureRewards[treasureId] = RewardConfig(chhAmount);
        emit RewardConfigUpdated(treasureId, chhAmount);
    }

    /**
     * @dev バックエンドの署名者アドレスを更新する（Ownerのみ）
     */
    function setBackendSigner(address _newSigner) external onlyOwner {
        backendSigner = _newSigner;
    }

    /**
     * @dev プレイヤー（フロントエンド）から呼び出される。バックエンドの署名を検証して報酬を付与する。
     * @param treasureIds 1回のプレイで獲得した財宝IDの配列
     * @param nonce プレイヤーの現在のnonce
     * @param signature バックエンドによって生成された署名
     */
    function recordGameSession(
        uint256[] calldata treasureIds,
        uint256 nonce,
        bytes calldata signature
    ) external {
        // 1. Nonceの検証（リプレイ攻撃防止）
        require(nonce == nonces[msg.sender], "Invalid nonce");

        // 2. 署名の検証
        // メッセージのハッシュ化 (送信者, 財宝ID, nonce, コントラクトアドレス を結合)
        bytes32 messageHash = keccak256(abi.encodePacked(msg.sender, treasureIds, nonce, address(this)));
        bytes32 ethSignedMessageHash = MessageHashUtils.toEthSignedMessageHash(messageHash);

        // 署名からアドレスを復元し、バックエンドのアドレスと一致するか確認
        address recoveredSigner = ECDSA.recover(ethSignedMessageHash, signature);
        require(recoveredSigner == backendSigner, "Invalid signature");

        // 3. Nonceの更新（使用済みにする）
        nonces[msg.sender]++;

        // 4. 財宝の記録と報酬の計算
        uint256 totalReward = 0;
        for (uint256 i = 0; i < treasureIds.length; i++) {
            uint256 tId = treasureIds[i];
            playerTreasures[msg.sender].push(tId);
            treasureCounts[msg.sender][tId] += 1;
            totalReward += treasureRewards[tId].chhAmount;
        }

        // 5. 報酬のCHHトークンをプレイヤーに転送
        if (totalReward > 0) {
            require(chhToken.transfer(msg.sender, totalReward), "Token transfer failed");
        }

        // 履歴としてイベントを発火
        emit SessionCompleted(msg.sender, totalReward, treasureIds);
    }

    /**
     * @dev プレイヤーがこれまでに獲得したすべての財宝IDの履歴を取得する
     * @param player プレイヤーのアドレス
     */
    function getPlayerTreasures(address player) external view returns (uint256[] memory) {
        return playerTreasures[player];
    }

    /**
     * @dev プレイヤーが特定の財宝をいくつ持っているか確認する
     * @param player プレイヤーのアドレス
     * @param treasureId 財宝のID
     */
    function getTreasureCount(address player, uint256 treasureId) external view returns (uint256) {
        return treasureCounts[player][treasureId];
    }
}
