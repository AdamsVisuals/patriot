<?php
require 'PHPMailer-master/src/PHPMailer.php';
require 'PHPMailer-master/src/SMTP.php';
require 'PHPMailer-master/src/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get JSON data from request body
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Validate required fields
    $required = ['fullName', 'email', 'travelDates', 'duration', 'travelers'];
    foreach ($required as $field) {
        if (empty($input[$field])) {
            echo json_encode(['success' => false, 'message' => "Please fill in all required fields."]);
            exit;
        }
    }

    try {
        $mail = new PHPMailer(true);

        // Server settings
        $mail->isSMTP();
        $mail->Host = 'smtp.hostinger.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'info@patriot-tours.com';
        $mail->Password = '##Patriot!2025'; // Replace with actual password
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port = 465;

        // Recipients
        $mail->setFrom('info@patriot-tours.com', 'Patriot Tours Safari Planner');
        $mail->addAddress('info@patriot-tours.com', 'Patriot Tours');
        $mail->addReplyTo($input['email'], $input['fullName']);

        // Content
        $mail->isHTML(true);
        $mail->Subject = 'New Safari Plan Request - ' . $input['fullName'];
        
        // Build email body
        $emailBody = "
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .header { background: #1a3a27; color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; }
                .section { margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-radius: 5px; }
                .label { font-weight: bold; color: #1a3a27; }
            </style>
        </head>
        <body>
            <div class='header'>
                <h1>🦁 New Safari Plan Request</h1>
            </div>
            <div class='content'>
                <div class='section'>
                    <h2>Contact Information</h2>
                    <p><span class='label'>Name:</span> {$input['fullName']}</p>
                    <p><span class='label'>Email:</span> {$input['email']}</p>
                    <p><span class='label'>Phone:</span> " . ($input['phone'] ?? 'Not provided') . "</p>
                    <p><span class='label'>Country:</span> " . ($input['country'] ?? 'Not provided') . "</p>
                </div>
                
                <div class='section'>
                    <h2>Safari Preferences</h2>
                    <p><span class='label'>Travel Dates:</span> {$input['travelDates']}</p>
                    <p><span class='label'>Duration:</span> {$input['duration']} days</p>
                    <p><span class='label'>Travelers:</span> {$input['travelers']}</p>
                    <p><span class='label'>Accommodation:</span> " . ($input['accommodation'] ?? 'Not specified') . "</p>
                    <p><span class='label'>Budget:</span> " . ($input['budget'] ?? 'Not specified') . "</p>
                </div>
                
                <div class='section'>
                    <h2>Destinations & Interests</h2>
                    <p><span class='label'>Destinations:</span> " . (isset($input['destinations']) ? implode(', ', $input['destinations']) : 'Not specified') . "</p>
                    <p><span class='label'>Interests:</span> " . (isset($input['interests']) ? implode(', ', $input['interests']) : 'Not specified') . "</p>
                </div>
        ";

        if (!empty($input['comments'])) {
            $emailBody .= "
                <div class='section'>
                    <h2>Additional Comments</h2>
                    <p>{$input['comments']}</p>
                </div>
            ";
        }

        $emailBody .= "
            </div>
        </body>
        </html>
        ";

        $mail->Body = $emailBody;
        $mail->AltBody = $this->createPlainTextEmail($input);

        $mail->send();
        
        echo json_encode(['success' => true, 'message' => 'Safari plan submitted successfully!']);

    } catch (Exception $e) {
        error_log("Mailer Error: " . $e->getMessage());
        echo json_encode(['success' => false, 'message' => 'Failed to send email. Please try again later.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
}

function createPlainTextEmail($data) {
    $text = "NEW SAFARI PLAN REQUEST\n\n";
    $text .= "CONTACT INFORMATION\n";
    $text .= "Name: {$data['fullName']}\n";
    $text .= "Email: {$data['email']}\n";
    $text .= "Phone: " . ($data['phone'] ?? 'Not provided') . "\n";
    $text .= "Country: " . ($data['country'] ?? 'Not provided') . "\n\n";
    
    $text .= "SAFARI PREFERENCES\n";
    $text .= "Travel Dates: {$data['travelDates']}\n";
    $text .= "Duration: {$data['duration']} days\n";
    $text .= "Travelers: {$data['travelers']}\n";
    $text .= "Accommodation: " . ($data['accommodation'] ?? 'Not specified') . "\n";
    $text .= "Budget: " . ($data['budget'] ?? 'Not specified') . "\n\n";
    
    $text .= "DESTINATIONS & INTERESTS\n";
    $text .= "Destinations: " . (isset($data['destinations']) ? implode(', ', $data['destinations']) : 'Not specified') . "\n";
    $text .= "Interests: " . (isset($data['interests']) ? implode(', ', $data['interests']) : 'Not specified') . "\n\n";
    
    if (!empty($data['comments'])) {
        $text .= "ADDITIONAL COMMENTS\n";
        $text .= "{$data['comments']}\n";
    }
    
    return $text;
}
?>