<?php
/**
 * SES project-enquiry endpoint (selective PHP on cPanel-style hosting).
 *
 * Delivery note: PHP mail() returning true means the local mail transport
 * accepted the message for processing; it does NOT confirm final delivery.
 * See docs/HANDOVER.md for required live-host mailbox and DNS verification.
 */

declare(strict_types=1);

const RECIPIENT = 'corporate@sibanyeengineering.com';
const MAIL_FROM = 'no-reply@sibanyeengineering.com';
const SUBJECT_PREFIX = '[Website enquiry]';
const RATE_WINDOW_SECONDS = 30;
const RATE_RETENTION_SECONDS = 3600;
const RATE_MAX_ENTRIES = 500;
// Above the document root on cPanel (next to public_html), not web-readable.
const RATE_FILE = __DIR__ . '/../../.enquiry-ratecheck';

header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: strict-origin-when-cross-origin');
header('Cache-Control: no-store');

function respond(bool $ok, string $message, bool $asJson): void
{
    if ($asJson) {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(
            ['ok' => $ok, 'message' => $message],
            JSON_UNESCAPED_SLASHES | JSON_INVALID_UTF8_SUBSTITUTE
        );
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

/**
 * Atomic file-based rate limit for shared hosting.
 *
 * The exclusive lock covers the complete read/check/prune/write operation.
 * A hashed IP key avoids storing raw IP addresses in the state file. If the
 * state file cannot be opened, locked, read or written, fail closed rather
 * than silently disabling rate limiting.
 *
 * @return 'allowed'|'limited'|'unavailable'
 */
function rateLimitStatus(string $ip): string
{
    $handle = @fopen(RATE_FILE, 'c+');
    if ($handle === false) {
        error_log('SES enquiry: rate-limit state could not be opened.');
        return 'unavailable';
    }

    if (!flock($handle, LOCK_EX)) {
        fclose($handle);
        error_log('SES enquiry: rate-limit state could not be locked.');
        return 'unavailable';
    }

    $status = 'unavailable';
    $now = time();
    $ipKey = hash('sha256', $ip);

    rewind($handle);
    $contents = stream_get_contents($handle);
    if ($contents === false) {
        error_log('SES enquiry: rate-limit state could not be read.');
    } else {
        $entries = [];

        foreach (explode("\n", $contents) as $line) {
            if ($line === '') {
                continue;
            }

            $parts = explode('|', $line, 2);
            if (count($parts) !== 2 || !ctype_digit($parts[0])) {
                continue;
            }

            $timestamp = (int) $parts[0];
            $key = $parts[1];

            // Only retain valid, recent entries in the current hashed format.
            if ($timestamp > $now - RATE_RETENTION_SECONDS
                && preg_match('/^[a-f0-9]{64}$/', $key) === 1) {
                $entries[] = [$timestamp, $key];
            }
        }

        $limited = false;
        foreach ($entries as [$timestamp, $key]) {
            if ($key === $ipKey && $timestamp > $now - RATE_WINDOW_SECONDS) {
                $limited = true;
                break;
            }
        }

        if ($limited) {
            $status = 'limited';
        } else {
            $entries[] = [$now, $ipKey];
            $entries = array_slice($entries, -RATE_MAX_ENTRIES);
            $payload = implode(
                "\n",
                array_map(
                    static fn (array $entry): string => $entry[0] . '|' . $entry[1],
                    $entries
                )
            ) . "\n";

            if (ftruncate($handle, 0) && rewind($handle) !== false) {
                $written = fwrite($handle, $payload);
                if ($written === strlen($payload) && fflush($handle)) {
                    // Restrict the file to the account owner where supported.
                    @chmod(RATE_FILE, 0600);
                    $status = 'allowed';
                } else {
                    error_log('SES enquiry: rate-limit state could not be written completely.');
                }
            } else {
                error_log('SES enquiry: rate-limit state could not be reset.');
            }
        }
    }

    flock($handle, LOCK_UN);
    fclose($handle);

    return $status;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST', true, 405);
    respond(false, 'Method not allowed.', true);
}

$asJson = str_contains($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json');

// Honeypot — bots that fill it never reach the mailbox.
if (clean((string) ($_POST['website_url'] ?? '')) !== '') {
    respond(true, 'Thank you.', $asJson); // pretend success, drop silently
}

$ip = (string) ($_SERVER['REMOTE_ADDR'] ?? 'unknown');
$rateStatus = rateLimitStatus($ip);

if ($rateStatus === 'limited') {
    http_response_code(429);
    respond(false, 'Please wait a moment before submitting again.', $asJson);
}

if ($rateStatus === 'unavailable') {
    http_response_code(503);
    respond(false, 'The enquiry form is temporarily unavailable. Please email corporate@sibanyeengineering.com or contact us on WhatsApp.', $asJson);
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
    . "Reference: pending\n"
    . "Name: {$name}\n"
    . "Organisation: {$organisation}\n"
    . "Email: {$email}\n"
    . "Phone: {$phone}\n"
    . "Sector of interest: {$sector}\n"
    . "IP: {$ip}\n\n"
    . "Message:\n{$message}\n";

try {
    $reference = strtoupper(bin2hex(random_bytes(6)));
} catch (Throwable $e) {
    $reference = strtoupper(dechex(time()) . dechex(mt_rand(0, 0x7fffffff)));
}
$body = str_replace('Reference: pending', 'Reference: ' . $reference, $body);

// Use a domain mailbox as the From and envelope sender. cPanel may require
// MAIL_FROM to exist and be permitted for the account's PHP mail transport.
$headers = [
    'From: SES Website <' . MAIL_FROM . '>',
    'Reply-To: ' . $email,
    'X-Mailer: SES-enquiry',
    'X-SES-Reference: ' . $reference,
    'Content-Type: text/plain; charset=utf-8',
];

$sent = @mail(
    RECIPIENT,
    $subject,
    $body,
    implode("\r\n", $headers),
    '-f' . MAIL_FROM
);

if ($sent) {
    // This records local transport acceptance only, not inbox delivery.
    error_log('SES enquiry [' . $reference . ']: mail() accepted by local transport; final delivery unconfirmed.');
    respond(
        true,
        'Thank you — your enquiry has been submitted. If you do not receive a response, please email corporate@sibanyeengineering.com and quote reference ' . $reference . '.',
        $asJson
    );
}

error_log('SES enquiry [' . $reference . ']: mail() returned false; recipient=' . RECIPIENT . '.');
http_response_code(500);
respond(
    false,
    'Sorry, the enquiry could not be handed to the mail service. Please email corporate@sibanyeengineering.com or use WhatsApp. Reference: ' . $reference,
    $asJson
);
