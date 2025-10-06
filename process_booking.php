<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'path/to/PHPMailer/src/Exception.php';
require 'path/to/PHPMailer/src/PHPMailer.php';
require 'path/to/PHPMailer/src/SMTP.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data
    $name = htmlspecialchars($_POST['name']);
    $email = htmlspecialchars($_POST['email']);
    $phone = htmlspecialchars($_POST['full_phone']);
    $start_date = htmlspecialchars($_POST['start_date']);
    $end_date = htmlspecialchars($_POST['end_date']);
    $message = htmlspecialchars($_POST['message']);
    $country_code = htmlspecialchars($_POST['country_code']);

    // Validate data
    if (empty($name) || empty($email) || empty($phone)) {
        http_response_code(400);
        echo "Please fill in all required fields.";
        exit;
    }

    // Create email content
    $email_subject = "New Adventure Booking - Patriot Adventures";
    $email_body = "
    <h2>New Adventure Booking Request</h2>
    <p><strong>Name:</strong> $name</p>
    <p><strong>Email:</strong> $email</p>
    <p><strong>Phone:</strong> $phone (Country: $country_code)</p>
    <p><strong>Travel Dates:</strong> $start_date to $end_date</p>
    <p><strong>Special Requirements:</strong> " . ($message ? $message : 'None') . "</p>
    <hr>
    <p>This message was sent from your website booking form.</p>
    ";

    // Send email using PHPMailer
    $mail = new PHPMailer(true);

    try {
        // Server settings
        $mail->isSMTP();
        $mail->Host = 'your-smtp-host.com'; // Your SMTP server
        $mail->SMTPAuth = true;
        $mail->Username = 'your-email@domain.com'; // Your email
        $mail->Password = 'your-email-password'; // Your email password
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        // Recipients
        $mail->setFrom('noreply@yourdomain.com', 'Patriot Adventures');
        $mail->addAddress('bookings@yourdomain.com', 'Booking Department');
        $mail->addReplyTo($email, $name);

        // Content
        $mail->isHTML(true);
        $mail->Subject = $email_subject;
        $mail->Body = $email_body;

        $mail->send();
        echo "success";
    } catch (Exception $e) {
        http_response_code(500);
        echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
    }
} else {
    http_response_code(405);
    echo "Method not allowed";
}
?>