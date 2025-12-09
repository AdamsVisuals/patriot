<?php
/**
 * Luxury Safari Planning Form - PHPMailer Backend
 * Save this as: send_safari_request.php
 */

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set JSON header
header('Content-Type: application/json');

// Check if request is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

// Validate required fields
$requiredFields = ['full_name', 'email', 'phone', 'country_interest', 'safari_circuit', 'travel_dates', 'people_count', 'budget'];
foreach ($requiredFields as $field) {
    if (empty($input[$field])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Missing required field: ' . $field]);
        exit;
    }
}

// Sanitize input
$full_name = filter_var($input['full_name'], FILTER_SANITIZE_STRING);
$email = filter_var($input['email'], FILTER_SANITIZE_EMAIL);
$phone = filter_var($input['phone'], FILTER_SANITIZE_STRING);
$country_interest = filter_var($input['country_interest'], FILTER_SANITIZE_STRING);
$safari_circuit = filter_var($input['safari_circuit'], FILTER_SANITIZE_STRING);
$travel_dates = filter_var($input['travel_dates'], FILTER_SANITIZE_STRING);
$people_count = filter_var($input['people_count'], FILTER_SANITIZE_STRING);
$budget = filter_var($input['budget'], FILTER_SANITIZE_STRING);
$message = isset($input['message']) ? filter_var($input['message'], FILTER_SANITIZE_STRING) : '';

// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid email address']);
    exit;
}

// Load PHPMailer
require '../PHPMailer-master/src/PHPMailer.php';
require '../PHPMailer-master/src/SMTP.php';
require '../PHPMailer-master/src/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

// Create PHPMailer instance
$mail = new PHPMailer(true);

try {
    // Server settings
    $mail->isSMTP();
    $mail->Host = 'smtp.hostinger.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'info@patriot-tours.com';
    $mail->Password = '##Patriot!2025';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;
    
    // Recipients
    $mail->setFrom('noreply@patriot-tours.com', 'Patriot Safari Planner');
    $mail->addAddress('info@patriot-tours.com', 'Safari Team'); // Primary recipient
    $mail->addReplyTo($email, $full_name);
    
    // Content
    $mail->isHTML(true);
    $mail->Subject = 'New Safari Inquiry: ' . $full_name;
    
    // Build email body
    $emailBody = "
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #000; color: #fff; padding: 20px; text-align: center; }
            .content { padding: 30px; background-color: #f9f9f9; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #000; margin-bottom: 5px; }
            .value { padding: 8px; background-color: #fff; border-left: 3px solid #D4AF37; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h1>✨ New Safari Inquiry</h1>
            </div>
            <div class='content'>
                <div class='field'>
                    <div class='label'>Client Name</div>
                    <div class='value'>$full_name</div>
                </div>
                <div class='field'>
                    <div class='label'>Email Address</div>
                    <div class='value'>$email</div>
                </div>
                <div class='field'>
                    <div class='label'>Phone Number</div>
                    <div class='value'>$phone</div>
                </div>
                <div class='field'>
                    <div class='label'>Country of Interest</div>
                    <div class='value'>$country_interest</div>
                </div>
                <div class='field'>
                    <div class='label'>Safari Circuit</div>
                    <div class='value'>$safari_circuit</div>
                </div>
                <div class='field'>
                    <div class='label'>Travel Dates</div>
                    <div class='value'>$travel_dates</div>
                </div>
                <div class='field'>
                    <div class='label'>Number of People</div>
                    <div class='value'>$people_count</div>
                </div>
                <div class='field'>
                    <div class='label'>Budget Range</div>
                    <div class='value'>$$budget USD</div>
                </div>
                <div class='field'>
                    <div class='label'>Special Requests & Message</div>
                    <div class='value'>" . nl2br(htmlspecialchars($message)) . "</div>
                </div>
            </div>
            <div class='footer'>
                <p>This inquiry was submitted via the Safari Planner Form on " . date('F j, Y \a\t g:i a') . "</p>
                <p>Please respond within 24 hours for premium service.</p>
            </div>
        </div>
    </body>
    </html>
    ";
    
    $mail->Body = $emailBody;
    
    // Plain text alternative
    $mail->AltBody = "New Safari Inquiry\n\n" .
                     "Name: $full_name\n" .
                     "Email: $email\n" .
                     "Phone: $phone\n" .
                     "Country: $country_interest\n" .
                     "Circuit: $safari_circuit\n" .
                     "Dates: $travel_dates\n" .
                     "People: $people_count\n" .
                     "Budget: $$budget USD\n" .
                     "Message: $message\n\n" .
                     "Submitted on: " . date('F j, Y \a\t g:i a');
    
    // Send email
    $mail->send();
    
    // Also send confirmation to client (optional)
    $confirmationMail = new PHPMailer(true);
    $confirmationMail->isSMTP();
    $confirmationMail->Host = 'smtp.hsotinger.com';
    $confirmationMail->SMTPAuth = true;
    $confirmationMail->Username = 'info@patriot-tours.com';
    $confirmationMail->Password = '##Patriot!2025';
    $confirmationMail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $confirmationMail->Port = 587;
    
    $confirmationMail->setFrom('noreply@patriot-tours.com', 'Patriot Safari Planner');
    $confirmationMail->addAddress($email, $full_name);
    $confirmationMail->Subject = 'Your Safari Inquiry - Received';
    
    $confirmationBody = "
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #000; color: #D4AF37; padding: 30px; text-align: center; }
            .content { padding: 30px; background-color: #f9f9f9; }
            .thank-you { font-size: 18px; margin-bottom: 20px; }
            .next-steps { margin-top: 30px; padding: 20px; background-color: #fff; border-left: 4px solid #D4AF37; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h2>Thank You for Your Safari Inquiry</h2>
            </div>
            <div class='content'>
                <p class='thank-you'>Dear $full_name,</p>
                <p>Thank you for your interest in our safari experiences. We have received your inquiry and our safari specialists are already reviewing it.</p>
                
                <div class='next-steps'>
                    <h3>📋 What Happens Next:</h3>
                    <ol>
                        <li>Our luxury travel expert will contact you within <strong>24 hours</strong></li>
                        <li>We'll discuss your preferences in detail</li>
                        <li>We'll create a personalized safari itinerary</li>
                        <li>You'll receive exclusive access to premium lodges and experiences</li>
                    </ol>
                </div>
                
                <p><strong>Your Inquiry Details:</strong></p>
                <ul>
                    <li><strong>Destination:</strong> $country_interest - $safari_circuit</li>
                    <li><strong>Travel Dates:</strong> $travel_dates</li>
                    <li><strong>Group Size:</strong> $people_count people</li>
                    <li><strong>Budget:</strong> $$budget USD</li>
                </ul>
                
                <p>If you have any immediate questions, please don't hesitate to contact us directly at +1 (555) 123-4567.</p>
                
                <p>Warm regards,<br>
                The Luxury Safari Team</p>
            </div>
            <div class='footer'>
                <p>This is an automated message. Please do not reply to this email.</p>
                <p>Patriot Tours & Safaris Limited | East Africa's Premier Safari Experts</p>
            </div>
        </div>
    </body>
    </html>
    ";
    
    $confirmationMail->Body = $confirmationBody;
    $confirmationMail->AltBody = "Thank you for your safari inquiry. We'll contact you within 24 hours.";
    $confirmationMail->send();
    
    // Return success response
    echo json_encode([
        'success' => true,
        'message' => 'Safari inquiry submitted successfully. Check your email for confirmation.'
    ]);
    
} catch (Exception $e) {
    // Log error
    error_log('Email sending failed: ' . $e->getMessage());
    
    // Return error response
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Unable to send email. Please try again later or contact us directly.'
    ]);
}
?>