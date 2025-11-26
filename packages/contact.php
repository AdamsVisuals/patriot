<?php
// contact.php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid input']);
    exit;
}

// Sanitize input data
function sanitizeInput($data) {
    if (is_array($data)) {
        return array_map('sanitizeInput', $data);
    }
    return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
}

$sanitizedData = sanitizeInput($input);

// Validate required fields
$required = ['first_name', 'last_name', 'email', 'phone', 'country', 'message'];
foreach ($required as $field) {
    if (empty($sanitizedData[$field])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => "Missing required field: $field"]);
        exit;
    }
}

// Validate email
if (!filter_var($sanitizedData['email'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid email address']);
    exit;
}

try {
    // Load PHPMailer
    require 'PHPMailer-master/src/PHPMailer.php';
    require 'PHPMailer-master/src/SMTP.php';
    require 'PHPMailer-master/src/Exception.php';
    
    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\SMTP;
    use PHPMailer\PHPMailer\Exception;
    
    $mail = new PHPMailer(true);
    
    // Server settings (store these securely - using environment variables in production)
    $smtp_host = getenv('SMTP_HOST') ?: 'server310.web-hosting.com';
    $smtp_username = getenv('SMTP_USERNAME') ?: 'noreply@yourdomain.com';
    $smtp_password = getenv('SMTP_PASSWORD') ?: 'your_secure_password';
    $smtp_port = getenv('SMTP_PORT') ?: 465;
    
    // SMTP configuration
    $mail->isSMTP();
    $mail->Host = $smtp_host;
    $mail->SMTPAuth = true;
    $mail->Username = $smtp_username;
    $mail->Password = $smtp_password;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port = $smtp_port;
    
    // Recipients
    $mail->setFrom($smtp_username, 'Tanzania Safari Experts');
    $mail->addAddress('bookings@yourdomain.com', 'Safari Bookings');
    $mail->addReplyTo($sanitizedData['email'], $sanitizedData['first_name'] . ' ' . $sanitizedData['last_name']);
    
    // Content
    $mail->isHTML(true);
    $mail->Subject = 'New Safari Inquiry - ' . $sanitizedData['first_name'] . ' ' . $sanitizedData['last_name'];
    
    // Build email body
    $emailBody = "
    <h2>New Safari Inquiry</h2>
    <table style='width: 100%; border-collapse: collapse;'>
        <tr>
            <td style='padding: 10px; border: 1px solid #ddd; background: #f9f9f9;'><strong>Name:</strong></td>
            <td style='padding: 10px; border: 1px solid #ddd;'>{$sanitizedData['first_name']} {$sanitizedData['last_name']}</td>
        </tr>
        <tr>
            <td style='padding: 10px; border: 1px solid #ddd; background: #f9f9f9;'><strong>Email:</strong></td>
            <td style='padding: 10px; border: 1px solid #ddd;'>{$sanitizedData['email']}</td>
        </tr>
        <tr>
            <td style='padding: 10px; border: 1px solid #ddd; background: #f9f9f9;'><strong>Phone:</strong></td>
            <td style='padding: 10px; border: 1px solid #ddd;'>{$sanitizedData['phone']}</td>
        </tr>
        <tr>
            <td style='padding: 10px; border: 1px solid #ddd; background: #f9f9f9;'><strong>Country:</strong></td>
            <td style='padding: 10px; border: 1px solid #ddd;'>{$sanitizedData['country']}</td>
        </tr>
    ";
    
    if (!empty($sanitizedData['travel_date'])) {
        $emailBody .= "
        <tr>
            <td style='padding: 10px; border: 1px solid #ddd; background: #f9f9f9;'><strong>Travel Date:</strong></td>
            <td style='padding: 10px; border: 1px solid #ddd;'>{$sanitizedData['travel_date']}</td>
        </tr>
        ";
    }
    
    if (!empty($sanitizedData['travelers'])) {
        $emailBody .= "
        <tr>
            <td style='padding: 10px; border: 1px solid #ddd; background: #f9f9f9;'><strong>Travelers:</strong></td>
            <td style='padding: 10px; border: 1px solid #ddd;'>{$sanitizedData['travelers']}</td>
        </tr>
        ";
    }
    
    if (!empty($sanitizedData['interests'])) {
        $interests = is_array($sanitizedData['interests']) ? implode(', ', $sanitizedData['interests']) : $sanitizedData['interests'];
        $emailBody .= "
        <tr>
            <td style='padding: 10px; border: 1px solid #ddd; background: #f9f9f9;'><strong>Interests:</strong></td>
            <td style='padding: 10px; border: 1px solid #ddd;'>{$interests}</td>
        </tr>
        ";
    }
    
    if (!empty($sanitizedData['budget'])) {
        $emailBody .= "
        <tr>
            <td style='padding: 10px; border: 1px solid #ddd; background: #f9f9f9;'><strong>Budget:</strong></td>
            <td style='padding: 10px; border: 1px solid #ddd;'>{$sanitizedData['budget']}</td>
        </tr>
        ";
    }
    
    $emailBody .= "
        <tr>
            <td style='padding: 10px; border: 1px solid #ddd; background: #f9f9f9; vertical-align: top;'><strong>Message:</strong></td>
            <td style='padding: 10px; border: 1px solid #ddd;'>{$sanitizedData['message']}</td>
        </tr>
    </table>
    ";
    
    $mail->Body = $emailBody;
    $mail->AltBody = strip_tags($emailBody);
    
    $mail->send();
    
    echo json_encode(['success' => true, 'message' => 'Message sent successfully']);
    
} catch (Exception $e) {
    error_log("Email sending failed: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to send message. Please try again later.']);
}
?>