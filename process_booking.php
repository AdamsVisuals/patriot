<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer-master/src/Exception.php';
require 'PHPMailer-master/src/PHPMailer.php';
require 'PHPMailer-master/src/SMTP.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

// Sanitize input data
$name = filter_var($_POST['name'], FILTER_SANITIZE_STRING);
$email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
$phone = filter_var($_POST['phone'], FILTER_SANITIZE_STRING);
$start_date = filter_var($_POST['start_date'], FILTER_SANITIZE_STRING);
$end_date = filter_var($_POST['end_date'], FILTER_SANITIZE_STRING);
$message = filter_var($_POST['message'], FILTER_SANITIZE_STRING);

// Validate required fields
if (empty($name) || empty($email) || empty($phone) || empty($start_date) || empty($end_date)) {
    echo json_encode(['success' => false, 'message' => 'Please fill in all required fields']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Please provide a valid email address']);
    exit;
}

try {
    $mail = new PHPMailer(true);
    
    // Hostinger SMTP Configuration
    $mail->isSMTP();
    $mail->Host = 'smtp.hostinger.com';  // Hostinger SMTP server
    $mail->SMTPAuth = true;
    $mail->Username = 'info@patriot-tours.com';  // Your Hostinger email
    $mail->Password = '##Patriot!2025';        // Your email password
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; // TLS encryption
    $mail->Port = 587;  // Hostinger SMTP port
    
    // Sender and recipient
    $mail->setFrom('info@patriot-tours.com', 'Patriot Tours & Safaris');
    $mail->addAddress('info@patriot-tours.com');  // Where bookings should be sent
    $mail->addReplyTo($email, $name);
    
    // Email content
    $mail->isHTML(true);
    $mail->Subject = 'New Booking Request - Patriot Tours & Safaris';
    
    $emailBody = "
    <h2>New Booking Request</h2>
    <p><strong>Name:</strong> {$name}</p>
    <p><strong>Email:</strong> {$email}</p>
    <p><strong>Phone:</strong> {$phone}</p>
    <p><strong>Trip Dates:</strong> {$start_date} to {$end_date}</p>
    <p><strong>Special Requirements:</strong> " . ($message ?: 'None provided') . "</p>
    <p><em>This message was sent from the Patriot Tours & Safaris booking form.</em></p>
    ";
    
    $mail->Body = $emailBody;
    $mail->AltBody = strip_tags($emailBody);
    
    if ($mail->send()) {
        echo json_encode(['success' => true, 'message' => 'Thank you! Your booking request has been sent successfully. We will contact you soon.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Sorry, there was an error sending your message. Please try again later.']);
    }
    
} catch (Exception $e) {
    error_log("PHPMailer Error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Mailer Error: ' . $e->getMessage()]);
}
?>