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

// ==========================================
// 【重要】署名用の秘密鍵（0xから始まらないHEX文字列）
// 実際のサーバー環境では、環境変数から読み込むなどの安全な管理を行ってください。
// ==========================================
$adminPrivateKey = getenv('ADMIN_PRIVATE_KEY') ?: 'YOUR_PRIVATE_KEY_HERE';

$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON']);
    exit;
}

$user = $input['user'] ?? '';
$treasureIds = $input['treasureIds'] ?? [];
$requestId = $input['requestId'] ?? '';

if (!$user || !is_array($treasureIds) || !$requestId) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing parameters']);
    exit;
}

function encodeAbiAddress($address) {
    return str_pad(strtolower(str_replace('0x', '', $address)), 64, '0', STR_PAD_LEFT);
}

function encodeAbiUint256($val) {
    // Note: This simple implementation only supports integer values that fit within PHP's maximum integer limit.
    return str_pad(dechex((int)$val), 64, '0', STR_PAD_LEFT);
}

function encodeAbiString($string) {
    $len = strlen($string);
    $lenHex = str_pad(dechex($len), 64, '0', STR_PAD_LEFT);
    $dataHex = bin2hex($string);
    $dataHex = str_pad($dataHex, ceil($len / 32) * 64, '0', STR_PAD_RIGHT);
    return $lenHex . $dataHex;
}

try {
    // 1. Ethereum ABI Encoding ( abi.encode(address,uint256[],string) )
    $addressHex = encodeAbiAddress($user);

    // Offsets
    // Variables: address (32), uint256[] (32, dynamic offset), string (32, dynamic offset) -> Total base size = 96 bytes (0x60)
    $offsetArray = 96;
    $offsetArrayHex = encodeAbiUint256($offsetArray);

    // String offset = array offset + array size (32 bytes for length + 32 bytes for each element)
    $offsetString = $offsetArray + 32 + (32 * count($treasureIds));
    $offsetStringHex = encodeAbiUint256($offsetString);

    // Array data
    $arrayLenHex = encodeAbiUint256(count($treasureIds));
    $elementsHex = '';
    foreach ($treasureIds as $id) {
        $elementsHex .= encodeAbiUint256($id);
    }

    // String data
    $stringDataHex = encodeAbiString($requestId);

    // Combine
    $encodedHex = $addressHex . $offsetArrayHex . $offsetStringHex . $arrayLenHex . $elementsHex . $stringDataHex;
    
    // 2. エンコードしたデータのKeccak256ハッシュを取得 (messageHash)
    $messageHash = Keccak::hash(hex2bin($encodedHex), 256);

    // 3. EIP-191プレフィックスを付与してEthereum署名用ハッシュを生成 (ethSignedMessageHash)
    $prefix = "\x19Ethereum Signed Message:\n32";
    $ethSignedMessageHash = Keccak::hash($prefix . hex2bin($messageHash), 256);

    // 4. secp256k1の秘密鍵で署名 (r, s, vを作成)
    $ec = new EC('secp256k1');
    $key = $ec->keyFromPrivate($adminPrivateKey);
    $signature = $key->sign($ethSignedMessageHash, ['canonical' => true]);

    // r, s を64文字のHEX値に0埋め、vを計算 (recoveryParam + 27)
    $r = str_pad($signature->r->toString(16), 64, '0', STR_PAD_LEFT);
    $s = str_pad($signature->s->toString(16), 64, '0', STR_PAD_LEFT);
    $v = dechex($signature->recoveryParam + 27);

    // 0x...というフォーマットに変換
    $signatureHex = '0x' . $r . $s . $v;

    echo json_encode([
        'signature' => $signatureHex,
        'requestId' => $requestId,
        'messageHash' => '0x' . $messageHash
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
