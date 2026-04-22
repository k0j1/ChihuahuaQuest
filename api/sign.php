<?php
/**
 * 報酬獲得用の署名を生成するAPI
 * 
 * [スマートコントラクト側の検証ロジック例]
 * bytes32 messageHash = keccak256(abi.encode(user, treasureIds, requestId));
 * bytes32 ethSignedMessageHash = MessageHashUtils.toEthSignedMessageHash(messageHash);
 * address signer = ECDSA.recover(ethSignedMessageHash, signature);
 * require(signer == serverSignerAddress, "Invalid Signature");
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // 本番環境ではフロントエンドのドメインに絞ることを推奨
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

require __DIR__ . '/vendor/autoload.php';

// .envファイルを読み込んで環境変数にセットする簡易関数
function loadEnv($path) {
    if (!file_exists($path)) return;
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        list($name, $value) = explode('=', $line, 2);
        putenv(sprintf('%s=%s', trim($name), trim($value)));
    }
}
loadEnv(__DIR__ . '/.env');

use kornrunner\Keccak;
use Elliptic\EC;

// ... (Keep header logic)

$adminPrivateKey = getenv('ADMIN_PRIVATE_KEY') ?: 'YOUR_PRIVATE_KEY_HERE';
$contractAddress = getenv('CONTRACT_ADDRESS') ?: '';

$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON']);
    exit;
}

$user = $input['user'] ?? '';
$treasureIds = $input['treasureIds'] ?? [];
$nonce = $input['nonce'] ?? 0;

if (!$user || !is_array($treasureIds) || !isset($input['nonce']) || !$contractAddress) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing parameters or missing CONTRACT_ADDRESS']);
    exit;
}

// ABI packed encoding helpers
function packAddress($address) {
    return hex2bin(str_replace('0x', '', strtolower($address)));
}

function packUint256($val) {
    return hex2bin(str_pad(dechex((int)$val), 64, '0', STR_PAD_LEFT));
}

try {
    // 1. Ethereum ABI Packed Encoding ( abi.encodePacked(msg.sender, treasureIds, nonce, address(this)) )
    
    // msg.sender (20 bytes)
    $encoded = packAddress($user);
    
    // treasureIds (uint256[]) - packed as elements, 32 bytes each
    foreach ($treasureIds as $id) {
        $encoded .= packUint256($id);
    }
    
    // nonce (32 bytes)
    $encoded .= packUint256($nonce);
    
    // contract address (20 bytes)
    $encoded .= packAddress($contractAddress);
    
    // 2. Keccak256ハッシュを取得 (messageHash)
    $messageHash = Keccak::hash($encoded, 256);

    // 3. EIP-191プレフィックスを付与 (ethSignedMessageHash)
    $prefix = "\x19Ethereum Signed Message:\n32";
    $ethSignedMessageHash = Keccak::hash($prefix . hex2bin($messageHash), 256);

    // 4. 署名
    $ec = new EC('secp256k1');
    $key = $ec->keyFromPrivate($adminPrivateKey);
    $signature = $key->sign($ethSignedMessageHash, ['canonical' => true]);

    $r = str_pad($signature->r->toString(16), 64, '0', STR_PAD_LEFT);
    $s = str_pad($signature->s->toString(16), 64, '0', STR_PAD_LEFT);
    $v = dechex($signature->recoveryParam + 27);

    echo json_encode([
        'signature' => '0x' . $r . $s . $v,
        'nonce' => $nonce,
        'messageHash' => '0x' . $messageHash
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
