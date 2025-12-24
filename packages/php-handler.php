<?php
// waitlist-handler.php
header('Content-Type: application/json');

// Check if it's a POST request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
    exit;
}

$userEmail = filter_var($_POST['email'] ?? '', FILTER_SANITIZE_EMAIL);

if (!filter_var($userEmail, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email address provided.']);
    exit;
}

// Include PHPMailer
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Adjust the path based on how you installed PHPMailer
// If using Composer:
require 'vendor/autoload.php';
// If manually downloaded, require the files directly:
require '../PHPMailer/src/Exception.php';
require '../PHPMailer/src/PHPMailer.php';
require '../PHPMailer/src/SMTP.php';

try {
    $mail = new PHPMailer(true);
    
    // ===== CONFIGURE FOR HOSTINGER SMTP =====
    // REPLACE THESE VALUES WITH YOUR ACTUAL HOSTINGER EMAIL CREDENTIALS
    $mail->isSMTP();
    $mail->Host       = 'smtp.hostinger.com'; // Hostinger's SMTP server[citation:1]
    $mail->SMTPAuth   = true;
    $mail->Username   = 'info@patriot-tours.com'; // Your full Hostinger email
    $mail->Password   = '##Patriot!2025'; // Password for that email account[citation:1]
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; // Use TLS encryption[citation:1]
    $mail->Port       = 587; // Standard port for STARTTLS[citation:1]
    
    // ===== EMAIL 1: Notification to Patriot Tours (info@...) =====
    $mail->setFrom('info@patriot-tours.com', 'Patriot Tours & Safaris'); // Sender
    $mail->addAddress('info@patriot-tours.com'); // Recipient
    $mail->addReplyTo($userEmail); // Allow replying to the user
    
    $mail->Subject = 'New Seychelles Waitlist Signup!';
    $mail->isHTML(true);
    $mail->Body = "
        <h2>New Waitlist Signup for Seychelles</h2>
        <p><strong>User Email:</strong> {$userEmail}</p>
        <p><strong>Signup Time:</strong> " . date('Y-m-d H:i:s') . "</p>
        <p>This person is interested in Seychelles packages and should receive updates.</p>
    ";
    $mail->AltBody = "New Seychelles Waitlist Signup:\nUser Email: {$userEmail}\nTime: " . date('Y-m-d H:i:s');
    
    $mail->send();
    
    // ===== EMAIL 2: Confirmation to the User =====
    $mail->clearAddresses(); // Clear previous recipients
    $mail->clearReplyTos();
    
    $mail->setFrom('info@patriot-tours.com', 'Patriot Tours & Safaris');
    $mail->addAddress($userEmail); // Send to the user
    $mail->addReplyTo('info@patriot-tours.com', 'Customer Service');
    
    $mail->Subject = 'Welcome to the Seychelles Paradise Waitlist!';
    $mail->isHTML(true);
    $mail->Body = "
        <div style='font-family: Poppins, sans-serif; max-width: 600px; margin: 0 auto;'>
            <img src='https://patriot-tours.com/images/p-logo-2.png' alt='Patriot Tours' style='max-width: 200px; margin-bottom: 20px;'>
            <h1 style='color: #d4af37; font-family: Playfair Display, serif;'>Welcome to Paradise! 🌴</h1>
            <p>Thank you for joining the Seychelles waitlist. You're now first in line to discover our exclusive island packages.</p>
            <div style='background: #f8f8f8; padding: 20px; border-left: 4px solid #d4af37; margin: 20px 0;'>
                <h3 style='margin-top: 0;'>Your Exclusive Benefit:</h3>
                <p style='font-size: 1.2em;'><strong>You'll receive <span style='color: #d4af37;'>10% off</span> your first Seychelles booking when we launch!</strong></p>
            </div>
            <p>We'll notify you as soon as our Seychelles collection goes live with:</p>
            <ul>
                <li>First access to luxury resort packages</li>
                <li>Exclusive pre-launch offers</li>
                <li>Indian Ocean travel tips and insights</li>
            </ul>
            <p>In the meantime, explore our other destinations at <a href='https://patriot-tours.com'>www.yourdomain.com</a></p>
            <hr>
            <p style='font-size: 0.9em; color: #666;'>
                Patriot Tours & Safaris Ltd<br>
                Crafting Extraordinary African Experiences<br>
                <small>You're receiving this email because you signed up for Seychelles updates.</small>
            </p>
        </div>
    ";
    $mail->AltBody = "Welcome to the Seychelles waitlist!\n\nThank you for joining. You'll be the first to know when our Seychelles paradise packages launch.\n\nEXCLUSIVE OFFER: You'll receive 10% off your first Seychelles booking when we launch!\n\nWe'll notify you with first access to luxury resorts, exclusive offers, and travel tips.\n\nPatriot Tours & Safaris Ltd\nwww.yourdomain.com";
    
    $mail->send();
    
    // Return success response
    echo json_encode(['success' => true, 'message' => 'Thank you! Please check your email for confirmation.']);
    
} catch (Exception $e) {
    // Log the error for debugging
    error_log("PHPMailer Error: " . $mail->ErrorInfo);
    echo json_encode(['success' => false, 'message' => 'Sorry, we could not process your request at this time.']);
}
?>