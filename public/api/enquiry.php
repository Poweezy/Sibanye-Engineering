<?php
/**
 * SES project-enquiry endpoint (selective PHP on cPanel-style hosting).
 * See docs/DECISIONS.md ADR-012. Recipient is configurable below —
 * the production mailbox is pending SES (docs/content-open-items.md item 6).
 *
 * Accepts standard form POSTs (progressive enhancement) and returns JSON when
 * the request is made with fetch (Accept: application/json).
 */

declare(strict_types=1);

const RECIPIENT = 'info@sibanyeengineering.com';
const SUBJECT_PREFIX = '[Website enquiry]';
const RATE_WINDOW_SECONDS = 30;
// Rate-limit state lives ABOVE the document root (the cPanel home directory
// in production; the repo root locally): it survives static redeploys and is
// never web-readable regardless of server software. See docs/DECISIONS.md ADR-016.
const RATE_FILE = __DIR__ . '/../../.enquiry-ratecheck';

header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: strict-origin-when-cross-origin');

function respond(bool $ok, string $message, bool $asJson): void
{
    if ($asJson) {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['ok' => $ok, 'message' => $message]);
    } else {
        $qs = $ok ? '?sent=1' : '?sent=0';
        header('Location: /contact/' . $qs . '#enquiry', true, 303);
    }
    exit;
}

function clean(string $value): string
{
    // Strip control characters (header injection) and collapse whitespace.
    $value = preg_replace('/[\x00-\x1F\x7F]/u', ' ', $value) ?? '';
    return trim(preg_replace('/\s+/u', ' ', $value) ?? '');
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST', true, 405);
    respond(false, 'Method not allowed.', true);
}

$asJson = str_contains($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json');

// Basic rate limit: one submission per IP per window.
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$now = time();
$last = @file_get_contents(RATE_FILE);
$entries = $last === false ? [] : array_filter(explode("\n", $last), static fn ($l) => $l !== '');
$entries = array_values(array_filter($entries, static function ($line) use ($now) {
    [$t] = explode('|', $line, 2);
    return (int) $t > $now - 3600;
}));
foreach ($entries as $line) {
    [$t, $who] = explode('|', $line, 2);
    if ($who === $ip && (int) $t > $now - RATE_WINDOW_SECONDS) {
        http_response_code(429);
        respond(false, 'Please wait a moment before submitting again.', $asJson);
    }
}
$entries[] = $now . '|' . $ip;
@file_put_contents(RATE_FILE, implode("\n", array_slice($entries, -500)) . "\n", LOCK_EX);

// Honeypot — bots that fill it never reach the mailbox.
if (clean((string) ($_POST['website_url'] ?? '')) !== '') {
    respond(true, 'Thank you.', $asJson); // pretend success, drop silently
}

$name = mb_substr(clean((string) ($_POST['name'] ?? '')), 0, 120);
$email = mb_substr(clean((string) ($_POST['email'] ?? '')), 0, 160);
$organisation = mb_substr(clean((string) ($_POST['organisation'] ?? '')), 0, 160);
$phone = mb_substr(clean((string) ($_POST['phone'] ?? '')), 0, 40);
$sector = mb_substr(clean((string) ($_POST['sector'] ?? '')), 0, 80);
$message = trim((string) ($_POST['message'] ?? ''));
$message = mb_substr($message, 0, 4000);

$errors = [];
if ($name === '' || mb_strlen($name) < 2) {
    $errors[] = 'Please provide your name.';
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Please provide a valid email address.';
}
if (mb_strlen($message) < 20) {
    $errors[] = 'Please describe your project in at least 20 characters.';
}
if ($errors !== []) {
    http_response_code(422);
    respond(false, implode(' ', $errors), $asJson);
}

$subject = SUBJECT_PREFIX . ' ' . $name . ($organisation !== '' ? ' (' . $organisation . ')' : '');
$body = "New project enquiry from the SES website.\n\n"
    . "Name: {$name}\n"
    . "Organisation: {$organisation}\n"
    . "Email: {$email}\n"
    . "Phone: {$phone}\n"
    . "Sector of interest: {$sector}\n"
    . "IP: {$ip}\n\n"
    . "Message:\n{$message}\n";

// mail() envelope sender should be a real mailbox on the hosting domain.
// SPF/DKIM/DMARC setup is documented in docs/HANDOVER.md §3.
$headers = [
    'From: SES Website <no-reply@sibanyeengineering.com>',
    'Reply-To: ' . $name . ' <' . $email . '>',
    'X-Mailer: SES-enquiry',
    'Content-Type: text/plain; charset=utf-8',
];

$sent = @mail(RECIPIENT, $subject, $body, implode("\r\n", $headers));

if ($sent) {
    respond(true, 'Thank you — your enquiry has been sent. We will be in touch shortly.', $asJson);
}

http_response_code(500);
error_log('SES enquiry: mail() failed for ' . $email);
respond(false, 'Sorry — the message could not be sent right now. Please email info@sibanyeengineering.com or use WhatsApp.', $asJson);
