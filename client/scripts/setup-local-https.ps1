#Requires -Version 7.0
$ErrorActionPreference = 'Stop'
if (-not $IsWindows) { throw 'Este script configura a confiança no Windows.' }

$certDirectory = Join-Path $PSScriptRoot '../.certs'
[void](New-Item -ItemType Directory -Force -Path $certDirectory)
$rootPath = Join-Path $certDirectory 'local-ca.pem'
$oldRoot = if (Test-Path -LiteralPath $rootPath) {
    [System.Security.Cryptography.X509Certificates.X509Certificate2]::CreateFromPemFile($rootPath)
}
$rootKey = [System.Security.Cryptography.RSA]::Create(3072)
$leafKey = [System.Security.Cryptography.RSA]::Create(2048)
$store = [System.Security.Cryptography.X509Certificates.X509Store]::new('Root', 'CurrentUser')
try {
    $hash = [System.Security.Cryptography.HashAlgorithmName]::SHA256
    $padding = [System.Security.Cryptography.RSASignaturePadding]::Pkcs1
    $rootRequest = [System.Security.Cryptography.X509Certificates.CertificateRequest]::new(
        'CN=Contato Seguro Local Development CA', $rootKey, $hash, $padding)
    $rootRequest.CertificateExtensions.Add(
        [System.Security.Cryptography.X509Certificates.X509BasicConstraintsExtension]::new($true, $false, 0, $true))
    $rootRequest.CertificateExtensions.Add(
        [System.Security.Cryptography.X509Certificates.X509KeyUsageExtension]::new(
            [System.Security.Cryptography.X509Certificates.X509KeyUsageFlags]::KeyCertSign, $true))
    $start = [DateTimeOffset]::Now.AddMinutes(-10)
    $rootCert = $rootRequest.CreateSelfSigned($start, $start.AddYears(2))

    $leafRequest = [System.Security.Cryptography.X509Certificates.CertificateRequest]::new(
        'CN=localhost', $leafKey, $hash, $padding)
    $san = [System.Security.Cryptography.X509Certificates.SubjectAlternativeNameBuilder]::new()
    $san.AddDnsName('localhost')
    $san.AddIpAddress([System.Net.IPAddress]::Loopback)
    $san.AddIpAddress([System.Net.IPAddress]::IPv6Loopback)
    $leafRequest.CertificateExtensions.Add($san.Build())
    $leafRequest.CertificateExtensions.Add(
        [System.Security.Cryptography.X509Certificates.X509BasicConstraintsExtension]::new($false, $false, 0, $true))
    $usages = [System.Security.Cryptography.OidCollection]::new()
    [void]$usages.Add([System.Security.Cryptography.Oid]::new('1.3.6.1.5.5.7.3.1'))
    $leafRequest.CertificateExtensions.Add(
        [System.Security.Cryptography.X509Certificates.X509EnhancedKeyUsageExtension]::new($usages, $false))
    $serial = [System.Security.Cryptography.RandomNumberGenerator]::GetBytes(16)
    $leafCert = $leafRequest.Create($rootCert, $start, $start.AddDays(365), $serial)

    $store.Open([System.Security.Cryptography.X509Certificates.OpenFlags]::ReadWrite)
    $store.Add($rootCert)
    [System.IO.File]::WriteAllText((Join-Path $certDirectory 'localhost.pem'), $leafCert.ExportCertificatePem())
    [System.IO.File]::WriteAllText((Join-Path $certDirectory 'localhost-key.pem'), $leafKey.ExportPkcs8PrivateKeyPem())
    [System.IO.File]::WriteAllText($rootPath, $rootCert.ExportCertificatePem())
    if ($oldRoot) { $store.Remove($oldRoot) }
    Write-Output 'HTTPS local configurado para localhost, 127.0.0.1 e ::1. Certificado válido por um ano.'
} finally {
    $store.Dispose()
    $rootKey.Dispose()
    $leafKey.Dispose()
    if ($oldRoot) { $oldRoot.Dispose() }
}
