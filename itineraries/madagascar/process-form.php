<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Include PHPMailer
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../../PHPMailer-master/src/Exception.php';
require '../../PHPMailer-master/src/PHPMailer.php';
require '../../PHPMailer-master/src/SMTP.php';

// Configuration
$config = [
    'company_name' => 'Patriot Tours & Safaris Ltd',
    'company_email' => 'info@patriot-tours.com',
    'admin_email' => 'info@patriot-tours.com',
    'smtp' => [
        'host' => 'smtp.hostinger.com',
        'username' => 'info@patriot-tours.com',
        'password' => '##Patriot!2025',
        'port' => 587,
        'encryption' => 'tls'
    ]
];

function sendEmail($config, $subject, $body, $recipient = null) {
    $mail = new PHPMailer(true);
    
    try {
        // Server settings
        $mail->isSMTP();
        $mail->Host = $config['smtp']['host'];
        $mail->SMTPAuth = true;
        $mail->Username = $config['smtp']['username'];
        $mail->Password = $config['smtp']['password'];
        $mail->SMTPSecure = $config['smtp']['encryption'];
        $mail->Port = $config['smtp']['port'];
        
        // Recipients
        $mail->setFrom($config['company_email'], $config['company_name']);
        $mail->addAddress($recipient ?: $config['admin_email']);
        
        // Content
        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body = $body;
        $mail->AltBody = strip_tags($body);
        
        $mail->send();
        return true;
    } catch (Exception $e) {
        error_log("Mailer Error: {$mail->ErrorInfo}");
        return false;
    }
}

function createBookingEmail($data, $config) {
    $subject = "New Safari Booking Request - {$config['company_name']}";
    
    $body = "
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .header { background: #1a1a1a; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .field { margin-bottom: 10px; }
            .field-label { font-weight: bold; color: #1a1a1a; }
            .footer { background: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #666; }
        </style>
    </head>
    <body>
        <div class='header'>
            <h2>New Safari Booking Request</h2>
        </div>
        <div class='content'>
            <div class='field'><span class='field-label'>Name:</span> {$data['full_name']}</div>
            <div class='field'><span class='field-label'>Email:</span> {$data['email']}</div>
            <div class='field'><span class='field-label'>Phone:</span> {$data['phone']}</div>
            <div class='field'><span class='field-label'>Group Size:</span> {$data['group_size']} people</div>
            <div class='field'><span class='field-label'>Package:</span> {$data['package_type']}</div>
            <div class='field'><span class='field-label'>Dates:</span> {$data['start_date']} to {$data['end_date']}</div>
            <div class='field'><span class='field-label'>Special Requests:</span> " . ($data['special_requests'] ?: 'None') . "</div>
        </div>
        <div class='footer'>
            <p>This email was sent from your website contact form.</p>
        </div>
    </body>
    </html>
    ";
    
    return ['subject' => $subject, 'body' => $body];
}

function createContactEmail($data, $config) {
    $subject = "New Safari Expert Consultation Request - {$config['company_name']}";
    
    $interests = isset($data['interests']) ? implode(', ', (array)$data['interests']) : 'Not specified';
    
    $body = "
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .header { background: #1a1a1a; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .field { margin-bottom: 10px; }
            .field-label { font-weight: bold; color: #1a1a1a; }
            .footer { background: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #666; }
        </style>
    </head>
    <body>
        <div class='header'>
            <h2>New Safari Expert Consultation Request</h2>
        </div>
        <div class='content'>
            <div class='field'><span class='field-label'>Name:</span> {$data['full_name']}</div>
            <div class='field'><span class='field-label'>Email:</span> {$data['email']}</div>
            <div class='field'><span class='field-label'>Phone:</span> {$data['phone']}</div>
            <div class='field'><span class='field-label'>Country:</span> {$data['country']}</div>
            <div class='field'><span class='field-label'>Travelers:</span> {$data['travelers']}</div>
            <div class='field'><span class='field-label'>Budget:</span> {$data['budget']}</div>
            <div class='field'><span class='field-label'>Travel Date:</span> " . ($data['travel_date'] ?: 'Flexible') . "</div>
            <div class='field'><span class='field-label'>Duration:</span> {$data['duration']}</div>
            <div class='field'><span class='field-label'>Interests:</span> {$interests}</div>
            <div class='field'><span class='field-label'>Message:</span> {$data['message']}</div>
        </div>
        <div class='footer'>
            <p>This email was sent from your website contact form.</p>
        </div>
    </body>
    </html>
    ";
    
    return ['subject' => $subject, 'body' => $body];
}

// Main processing
try {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input || !isset($input['type'])) {
        throw new Exception('Invalid request data');
    }
    
    $type = $input['type'];
    $data = $input['data'];
    
    // Validate required fields based on type
    if ($type === 'booking') {
        $required = ['full_name', 'email', 'phone', 'group_size', 'package_type', 'start_date', 'end_date'];
    } else {
        $required = ['full_name', 'email', 'phone', 'country', 'message'];
    }
    
    foreach ($required as $field) {
        if (empty($data[$field])) {
            throw new Exception("Missing required field: {$field}");
        }
    }
    
    // Create email content
    if ($type === 'booking') {
        $emailData = createBookingEmail($data, $config);
    } else {
        $emailData = createContactEmail($data, $config);
    }
    
    // Send email to admin
    $emailSent = sendEmail($config, $emailData['subject'], $emailData['body']);
    
    if ($emailSent) {
        // Send confirmation to customer
        $confirmationSubject = "Thank you for your {$config['company_name']} inquiry";
        $confirmationBody = "
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .header { background: #1a1a1a; color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; }
                .footer { background: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #666; }
            </style>
        </head>
        <body>
            <div class='header'>
                <h2>Thank You for Your Inquiry</h2>
            </div>
            <div class='content'>
                <p>Dear {$data['full_name']},</p>
                <p>Thank you for contacting {$config['company_name']}. We have received your {$type} request and one of our safari experts will contact you within 24 hours.</p>
                <p>We look forward to helping you plan your dream African safari adventure!</p>
            </div>
            <div class='footer'>
                <p>{$config['company_name']}<br>
                Email: {$config['company_email']}</p>
            </div>
        </body>
        </html>
        ";
        
        sendEmail($config, $confirmationSubject, $confirmationBody, $data['email']);
        
        echo json_encode([
            'success' => true,
            'message' => 'Form submitted successfully'
        ]);
    } else {
        throw new Exception('Failed to send email');
    }
    
} catch (Exception $e) {
    error_log("Form Processing Error: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>