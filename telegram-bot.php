<?php
// Конфигурация
$BOT_TOKEN = '7593629530:AAFmDYtVRHtnLwoXRf_PAZRgzsddffG3rIc'; // Замените на токен вашего бота
$CHAT_ID = '562345561';     // Замените на ваш chat_id

// Получаем данные из POST запроса
$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'No data received']);
    exit;
}

// Извлекаем данные
$name = htmlspecialchars($data['name'] ?? '');
$phone = htmlspecialchars($data['phone'] ?? '');
$message = htmlspecialchars($data['message'] ?? '');
$page = htmlspecialchars($data['page'] ?? 'index.html');

// Определяем страницу для более информативного сообщения
$pageNames = [
    'index.html' => 'Главная страница',
    'antikor-dnishche-skrytye-polosti.html' => 'Антикор днища',
    'antikor-novye-bu-avto.html' => 'Антикор для новых/б/у авто'
];

$pageName = $pageNames[$page] ?? $page;

// Формируем сообщение
$text = "🎯 *Новая заявка с сайта!*\n\n";
$text .= "📄 *Страница:* " . $pageName . "\n";
$text .= "👤 *Имя:* " . $name . "\n";
$text .= "📞 *Телефон:* " . $phone . "\n";

if (!empty($message)) {
    $text .= "📝 *Сообщение:* " . $message . "\n";
}

$text .= "\n🕒 *Время:* " . date('d.m.Y H:i:s') . "\n";
$text .= "🌐 *IP:* " . ($_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? 'неизвестен');

// Отправляем запрос в Telegram
$url = "https://api.telegram.org/bot{$BOT_TOKEN}/sendMessage";

$postFields = [
    'chat_id' => $CHAT_ID,
    'text' => $text,
    'parse_mode' => 'Markdown',
    'disable_web_page_preview' => true
];

// Используем cURL для отправки
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $postFields);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

// Проверяем ответ
if ($httpCode === 200) {
    // Логируем успешную отправку (опционально)
    $logData = [
        'date' => date('Y-m-d H:i:s'),
        'name' => $name,
        'phone' => $phone,
        'page' => $page,
        'status' => 'success'
    ];
    
    file_put_contents('leads.log', json_encode($logData) . PHP_EOL, FILE_APPEND);
    
    // Отправляем ответ
    header('Content-Type: application/json');
    echo json_encode(['success' => true]);
} else {
    // Логируем ошибку
    $logData = [
        'date' => date('Y-m-d H:i:s'),
        'name' => $name,
        'phone' => $phone,
        'page' => $page,
        'status' => 'error',
        'error' => 'Telegram API error'
    ];
    
    file_put_contents('leads.log', json_encode($logData) . PHP_EOL, FILE_APPEND);
    
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Telegram API error']);
}
?>