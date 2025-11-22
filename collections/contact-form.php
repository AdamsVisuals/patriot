<?php
// Include PHPMailer using require
require '../PHPMailer-master/src/PHPMailer.php';
require '../PHPMailer-master/src/SMTP.php';
require '../PHPMailer-master/src/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Sanitization function
function sanitizeInput($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    return $data;
}

// Validation function for email
function isValidEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

// Validation function for phone (basic international format)
function isValidPhone($phone) {
    return preg_match('/^\+?[0-9\s\-\(\)]{10,}$/', $phone);
}

// Get the form type
$formType = isset($_POST['form_type']) ? sanitizeInput($_POST['form_type']) : 'general';

// Sanitize all POST data
$sanitizedData = [];
foreach ($_POST as $key => $value) {
    if (is_array($value)) {
        $sanitizedData[$key] = array_map('sanitizeInput', $value);
    } else {
        $sanitizedData[$key] = sanitizeInput($value);
    }
}

// Validate required fields based on form type
$requiredFields = [];
$validationErrors = [];

switch ($formType) {
    case 'question':
        $requiredFields = ['userName', 'userEmail', 'userQuestion'];
        break;
    case 'beach_expert':
        $requiredFields = ['expertName', 'expertEmail', 'expertPhone', 'expertDate', 'expertBeach'];
        break;
    case 'cultural_expert':
        $requiredFields = ['expertName', 'expertEmail', 'expertPhone', 'expertDate', 'expertInterest'];
        break;
    case 'family_expert':
        $requiredFields = ['expertName', 'expertEmail', 'expertPhone', 'expertDate', 'expertFamily'];
        break;
    case 'honeymoon_expert':
        $requiredFields = ['expertName', 'expertEmail', 'expertPhone', 'expertDate', 'expertDuration'];
        break;
    case 'trekking_expert':
        $requiredFields = ['expertName', 'expertEmail', 'expertPhone', 'expertDate', 'expertFitness'];
        break;
    default:
        $requiredFields = ['userName', 'userEmail', 'userQuestion'];
}

// Check required fields
foreach ($requiredFields as $field) {
    if (empty($sanitizedData[$field])) {
        $validationErrors[] = "The field '{$field}' is required.";
    }
}

// Validate email fields
if (isset($sanitizedData['userEmail']) && !isValidEmail($sanitizedData['userEmail'])) {
    $validationErrors[] = "Please provide a valid email address.";
}

if (isset($sanitizedData['expertEmail']) && !isValidEmail($sanitizedData['expertEmail'])) {
    $validationErrors[] = "Please provide a valid email address.";
}

// Validate phone if present
if (isset($sanitizedData['expertPhone']) && !isValidPhone($sanitizedData['expertPhone'])) {
    $validationErrors[] = "Please provide a valid phone number.";
}

// If there are validation errors, return them
if (!empty($validationErrors)) {
    http_response_code(400);
    echo json_encode([
        'success' => false, 
        'message' => 'Please correct the following errors:',
        'errors' => $validationErrors
    ]);
    exit;
}

try {
    $mail = new PHPMailer(true);
    
    // Server settings
    $mail->isSMTP();
    $mail->Host = 'smtp.hostinger.com'; // Hostinger SMTP server
    $mail->SMTPAuth = true;
    $mail->Username = 'info@patriot-tours.com'; // Replace with your Hostinger email
    $mail->Password = '##Patriot!2025'; // Replace with your email password
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;
    
    // Recipients
    $mail->setFrom('noreply@patriot-tours.com', 'Patriot Tours & Safaris');
    $mail->addAddress('info@patriot-tours.com'); // Replace with your main email
    
    // Set reply-to based on form type
    if (isset($sanitizedData['userEmail'])) {
        $mail->addReplyTo($sanitizedData['userEmail'], $sanitizedData['userName'] ?? '');
    } elseif (isset($sanitizedData['expertEmail'])) {
        $mail->addReplyTo($sanitizedData['expertEmail'], $sanitizedData['expertName'] ?? '');
    }

    // Email content based on form type
    $subject = '';
    $body = '';
    
    switch ($formType) {
        case 'question':
            $subject = "New Question from {$sanitizedData['userName']}";
            $body = "
            <h2>New Question Submission</h2>
            <p><strong>Name:</strong> {$sanitizedData['userName']}</p>
            <p><strong>Email:</strong> {$sanitizedData['userEmail']}</p>
            <p><strong>Question:</strong></p>
            <p>{$sanitizedData['userQuestion']}</p>
            <hr>
            <p><small>Submitted from: " . $_SERVER['HTTP_REFERER'] . "</small></p>
            ";
            break;
            
        case 'beach_expert':
            $subject = "Beach Safari Inquiry from {$sanitizedData['expertName']}";
            $body = "
            <h2>Beach Safari Specialist Inquiry</h2>
            <p><strong>Name:</strong> {$sanitizedData['expertName']}</p>
            <p><strong>Email:</strong> {$sanitizedData['expertEmail']}</p>
            <p><strong>Phone:</strong> {$sanitizedData['expertPhone']}</p>
            <p><strong>Travel Dates:</strong> {$sanitizedData['expertDate']}</p>
            <p><strong>Beach Preference:</strong> {$sanitizedData['expertBeach']}</p>
            <p><strong>Additional Message:</strong></p>
            <p>" . ($sanitizedData['expertMessage'] ?? 'No additional message') . "</p>
            <hr>
            <p><small>Submitted from: " . $_SERVER['HTTP_REFERER'] . "</small></p>
            ";
            break;
            
        case 'cultural_expert':
            $subject = "Cultural Safari Inquiry from {$sanitizedData['expertName']}";
            $body = "
            <h2>Cultural Safari Specialist Inquiry</h2>
            <p><strong>Name:</strong> {$sanitizedData['expertName']}</p>
            <p><strong>Email:</strong> {$sanitizedData['expertEmail']}</p>
            <p><strong>Phone:</strong> {$sanitizedData['expertPhone']}</p>
            <p><strong>Travel Dates:</strong> {$sanitizedData['expertDate']}</p>
            <p><strong>Cultural Interest:</strong> {$sanitizedData['expertInterest']}</p>
            <p><strong>Additional Message:</strong></p>
            <p>" . ($sanitizedData['expertMessage'] ?? 'No additional message') . "</p>
            <hr>
            <p><small>Submitted from: " . $_SERVER['HTTP_REFERER'] . "</small></p>
            ";
            break;
            
        case 'family_expert':
            $subject = "Family Safari Inquiry from {$sanitizedData['expertName']}";
            $body = "
            <h2>Family Safari Expert Inquiry</h2>
            <p><strong>Name:</strong> {$sanitizedData['expertName']}</p>
            <p><strong>Email:</strong> {$sanitizedData['expertEmail']}</p>
            <p><strong>Phone:</strong> {$sanitizedData['expertPhone']}</p>
            <p><strong>Travel Date:</strong> {$sanitizedData['expertDate']}</p>
            <p><strong>Family Details:</strong> {$sanitizedData['expertFamily']}</p>
            <p><strong>Additional Message:</strong></p>
            <p>" . ($sanitizedData['expertMessage'] ?? 'No additional message') . "</p>
            <hr>
            <p><small>Submitted from: " . $_SERVER['HTTP_REFERER'] . "</small></p>
            ";
            break;
            
        case 'honeymoon_expert':
            $subject = "Honeymoon Safari Inquiry from {$sanitizedData['expertName']}";
            $body = "
            <h2>Honeymoon Specialist Inquiry</h2>
            <p><strong>Couple's Names:</strong> {$sanitizedData['expertName']}</p>
            <p><strong>Email:</strong> {$sanitizedData['expertEmail']}</p>
            <p><strong>Phone:</strong> {$sanitizedData['expertPhone']}</p>
            <p><strong>Honeymoon Dates:</strong> {$sanitizedData['expertDate']}</p>
            <p><strong>Trip Duration:</strong> {$sanitizedData['expertDuration']}</p>
            <p><strong>Dream Honeymoon Details:</strong></p>
            <p>" . ($sanitizedData['expertMessage'] ?? 'No additional details') . "</p>
            <hr>
            <p><small>Submitted from: " . $_SERVER['HTTP_REFERER'] . "</small></p>
            ";
            break;
            
        case 'trekking_expert':
            $subject = "Trekking Safari Inquiry from {$sanitizedData['expertName']}";
            $body = "
            <h2>Trekking Expert Inquiry</h2>
            <p><strong>Name:</strong> {$sanitizedData['expertName']}</p>
            <p><strong>Email:</strong> {$sanitizedData['expertEmail']}</p>
            <p><strong>Phone:</strong> {$sanitizedData['expertPhone']}</p>
            <p><strong>Trek Dates:</strong> {$sanitizedData['expertDate']}</p>
            <p><strong>Fitness Level:</strong> {$sanitizedData['expertFitness']}</p>
            <p><strong>Trekking Interests:</strong></p>
            <p>" . ($sanitizedData['expertMessage'] ?? 'No additional interests') . "</p>
            <hr>
            <p><small>Submitted from: " . $_SERVER['HTTP_REFERER'] . "</small></p>
            ";
            break;
    }
    
    $mail->isHTML(true);
    $mail->Subject = $subject;
    $mail->Body = $body;
    $mail->AltBody = strip_tags($body);
    
    $mail->send();
    
    echo json_encode([
        'success' => true, 
        'message' => 'Thank you for your message! We will get back to you within 24 hours.'
    ]);
    
} catch (Exception $e) {
    error_log("Mailer Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => 'Sorry, there was an error sending your message. Please try again later or contact us directly.'
    ]);
}
?>