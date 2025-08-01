# Sistema de Autenticación Backend para Score Milk
## Documentación Técnica Completa

**Autor:** Manus AI  
**Fecha:** 31 de julio de 2024  
**Versión:** 1.0  

---

## Tabla de Contenidos

1. [Introducción y Arquitectura General](#introducción-y-arquitectura-general)
2. [Requisitos del Sistema](#requisitos-del-sistema)
3. [Diseño de Base de Datos](#diseño-de-base-de-datos)
4. [API Endpoints y Especificaciones](#api-endpoints-y-especificaciones)
5. [Integración con Blockchain Tron](#integración-con-blockchain-tron)
6. [Seguridad y Autenticación](#seguridad-y-autenticación)
7. [Implementación del Servidor](#implementación-del-servidor)
8. [Configuración y Despliegue](#configuración-y-despliegue)
9. [Monitoreo y Mantenimiento](#monitoreo-y-mantenimiento)
10. [Consideraciones de Escalabilidad](#consideraciones-de-escalabilidad)

---

## Introducción y Arquitectura General

El sistema de autenticación para Score Milk representa una solución integral que combina la autenticación tradicional basada en credenciales con la innovadora integración de direcciones de criptomonedas TRX como identificadores únicos de usuario. Esta arquitectura híbrida permite a los usuarios registrarse y acceder a la plataforma utilizando tanto métodos convencionales como wallets de criptomonedas, proporcionando flexibilidad y adoptando las mejores prácticas de la industria Web3.

La arquitectura del sistema se basa en un enfoque de microservicios que separa claramente las responsabilidades entre la autenticación, la gestión de usuarios, y la integración con blockchain. El backend está diseñado para ser escalable, seguro y mantenible, utilizando tecnologías modernas que garantizan un rendimiento óptimo y una experiencia de usuario fluida.

### Componentes Principales del Sistema

El sistema está compuesto por varios componentes interconectados que trabajan en conjunto para proporcionar una experiencia de autenticación robusta y segura. El servidor de aplicaciones actúa como el núcleo central, manejando todas las solicitudes HTTP y coordinando las operaciones entre los diferentes servicios.

La base de datos relacional almacena toda la información de usuarios, sesiones y configuraciones, mientras que un sistema de caché Redis mejora el rendimiento para operaciones frecuentes como la validación de tokens y la verificación de sesiones activas. Un servicio especializado de integración con blockchain maneja todas las interacciones con la red Tron, incluyendo la validación de direcciones TRX y la verificación de transacciones.

El sistema de notificaciones gestiona el envío de emails de verificación, recuperación de contraseñas y alertas de seguridad, mientras que un servicio de logging centralizado registra todas las actividades importantes para auditoría y debugging. Finalmente, un sistema de monitoreo en tiempo real supervisa la salud del sistema y alerta sobre posibles problemas.

### Flujo de Datos y Comunicación

El flujo de datos en el sistema sigue un patrón bien definido que garantiza la integridad y seguridad de la información. Cuando un usuario intenta registrarse o iniciar sesión, la solicitud pasa primero por un middleware de validación que verifica la estructura y formato de los datos recibidos.

Para el registro con dirección TRX, el sistema valida primero el formato de la dirección utilizando las reglas específicas de Tron, luego verifica que la dirección no esté ya registrada en la base de datos. Si el usuario proporciona una dirección de wallet conectada, el sistema puede opcionalmente verificar que el usuario realmente controla esa dirección mediante la firma de un mensaje de desafío.

Durante el proceso de inicio de sesión, el sistema verifica las credenciales contra la base de datos, genera tokens JWT seguros, y establece sesiones que pueden ser monitoreadas y revocadas según sea necesario. Todas las operaciones críticas se registran en logs detallados que incluyen timestamps, direcciones IP, y metadatos relevantes para auditoría de seguridad.




## Requisitos del Sistema

### Requisitos Funcionales

El sistema de autenticación debe cumplir con una serie de requisitos funcionales específicos que garanticen una experiencia de usuario completa y segura. En primer lugar, debe permitir el registro de nuevos usuarios utilizando múltiples métodos: email y contraseña tradicional, direcciones TRX como identificador único, y autenticación social a través de proveedores como Google y Facebook.

El sistema debe validar automáticamente las direcciones TRX utilizando las reglas específicas del protocolo Tron, verificando que tengan el formato correcto (comenzando con 'T' y teniendo exactamente 34 caracteres) y que sean direcciones válidas según el algoritmo de checksum de Tron. Además, debe verificar la unicidad de las direcciones TRX en la base de datos para prevenir registros duplicados.

Para la gestión de contraseñas, el sistema debe implementar políticas de seguridad robustas que incluyan requisitos mínimos de complejidad, hashing seguro utilizando algoritmos como bcrypt o Argon2, y funcionalidades de recuperación de contraseña que no comprometan la seguridad del sistema. El sistema también debe soportar autenticación de dos factores (2FA) como una capa adicional de seguridad.

La funcionalidad de inicio de sesión debe soportar múltiples métodos: autenticación tradicional con email/username y contraseña, inicio de sesión directo con dirección TRX y contraseña, y autenticación sin contraseña utilizando wallets de criptomonedas conectadas. El sistema debe generar y gestionar tokens de sesión seguros que permitan el acceso a recursos protegidos.

### Requisitos No Funcionales

Los requisitos no funcionales son igualmente críticos para el éxito del sistema. En términos de rendimiento, el sistema debe ser capaz de manejar al menos 1,000 solicitudes de autenticación concurrentes con tiempos de respuesta inferiores a 200 milisegundos para operaciones de login y 500 milisegundos para operaciones de registro que incluyen validaciones de blockchain.

La disponibilidad del sistema debe ser del 99.9% o superior, lo que equivale a menos de 8.76 horas de tiempo de inactividad por año. Esto requiere una arquitectura redundante con failover automático y sistemas de backup que garanticen la continuidad del servicio incluso en caso de fallos de hardware o software.

La escalabilidad horizontal debe estar incorporada desde el diseño inicial, permitiendo que el sistema crezca agregando más servidores según sea necesario. El sistema debe ser capaz de escalar desde cientos de usuarios hasta millones sin degradación significativa del rendimiento, utilizando técnicas como load balancing, database sharding, y caching distribuido.

En términos de seguridad, el sistema debe cumplir con estándares internacionales como OWASP Top 10, implementar cifrado end-to-end para datos sensibles, y mantener logs de auditoría completos que permitan el rastreo de todas las actividades de autenticación. La protección contra ataques comunes como SQL injection, XSS, CSRF, y ataques de fuerza bruta debe estar implementada a nivel de aplicación y infraestructura.

### Requisitos de Integración

El sistema debe integrarse seamlessly con la blockchain de Tron para validar direcciones y, opcionalmente, verificar la propiedad de wallets. Esta integración requiere conexiones estables con nodos de Tron, manejo de timeouts y reintentos para operaciones de blockchain, y caching inteligente para minimizar las consultas a la red.

La integración con proveedores de autenticación social (Google, Facebook, Twitter) debe seguir los protocolos OAuth 2.0 y OpenID Connect, manejando apropiadamente los flujos de autorización, tokens de acceso, y sincronización de datos de perfil. El sistema debe ser capaz de vincular cuentas sociales con direcciones TRX existentes.

Para el envío de emails de verificación y notificaciones, el sistema debe integrarse con servicios de email confiables como SendGrid, Amazon SES, o Mailgun, implementando templates responsivos, tracking de entrega, y manejo de bounces y quejas de spam.

### Requisitos de Compliance y Regulatorios

Dado que Score Milk maneja criptomonedas y datos personales, el sistema debe cumplir con regulaciones relevantes como GDPR para usuarios europeos, CCPA para usuarios de California, y regulaciones locales de criptomonedas según la jurisdicción de operación.

El sistema debe implementar funcionalidades de "derecho al olvido" que permitan a los usuarios solicitar la eliminación completa de sus datos, manteniendo solo la información mínima requerida por ley para auditorías y compliance. También debe proporcionar funcionalidades de exportación de datos que permitan a los usuarios obtener copias completas de su información personal.

Para el manejo de criptomonedas, el sistema debe implementar controles KYC (Know Your Customer) y AML (Anti-Money Laundering) según sea requerido por las regulaciones locales, incluyendo verificación de identidad, monitoreo de transacciones sospechosas, y reporting a autoridades cuando sea necesario.


## Diseño de Base de Datos

### Esquema de Tablas Principales

El diseño de la base de datos para el sistema de autenticación de Score Milk está optimizado para manejar tanto usuarios tradicionales como usuarios que utilizan direcciones TRX como identificadores principales. La estructura relacional garantiza la integridad de los datos mientras proporciona la flexibilidad necesaria para futuras expansiones.

La tabla `users` actúa como la entidad central del sistema, almacenando información básica de cada usuario registrado. Esta tabla incluye campos para identificadores únicos, información de contacto, configuraciones de cuenta, y metadatos de auditoría. El diseño permite que un usuario pueda tener múltiples métodos de autenticación asociados, proporcionando flexibilidad en cómo los usuarios acceden a la plataforma.

```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    uuid VARCHAR(36) UNIQUE NOT NULL DEFAULT (UUID()),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    email_verified_at TIMESTAMP NULL,
    password_hash VARCHAR(255) NULL, -- NULL para usuarios que solo usan wallet
    trx_address VARCHAR(34) UNIQUE NOT NULL,
    trx_address_verified BOOLEAN DEFAULT FALSE,
    trx_address_verified_at TIMESTAMP NULL,
    profile_image_url VARCHAR(500) NULL,
    first_name VARCHAR(100) NULL,
    last_name VARCHAR(100) NULL,
    date_of_birth DATE NULL,
    country_code VARCHAR(2) NULL,
    timezone VARCHAR(50) DEFAULT 'UTC',
    language_code VARCHAR(5) DEFAULT 'es',
    account_status ENUM('active', 'suspended', 'pending_verification', 'deactivated') DEFAULT 'pending_verification',
    kyc_status ENUM('not_required', 'pending', 'approved', 'rejected') DEFAULT 'not_required',
    kyc_level INT DEFAULT 0,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    two_factor_secret VARCHAR(32) NULL,
    marketing_consent BOOLEAN DEFAULT FALSE,
    terms_accepted_at TIMESTAMP NOT NULL,
    privacy_policy_accepted_at TIMESTAMP NOT NULL,
    last_login_at TIMESTAMP NULL,
    last_login_ip VARCHAR(45) NULL,
    login_count INT DEFAULT 0,
    failed_login_attempts INT DEFAULT 0,
    locked_until TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    INDEX idx_email (email),
    INDEX idx_username (username),
    INDEX idx_trx_address (trx_address),
    INDEX idx_account_status (account_status),
    INDEX idx_created_at (created_at),
    INDEX idx_last_login (last_login_at)
);
```

La tabla `user_sessions` gestiona todas las sesiones activas de usuarios, permitiendo el control granular sobre el acceso y la capacidad de revocar sesiones específicas cuando sea necesario. Esta tabla es crucial para la seguridad del sistema, ya que permite rastrear y controlar todos los accesos activos.

```sql
CREATE TABLE user_sessions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    refresh_token VARCHAR(255) UNIQUE NOT NULL,
    device_fingerprint VARCHAR(255) NULL,
    user_agent TEXT NULL,
    ip_address VARCHAR(45) NOT NULL,
    country_code VARCHAR(2) NULL,
    city VARCHAR(100) NULL,
    is_mobile BOOLEAN DEFAULT FALSE,
    login_method ENUM('password', 'wallet', 'social', 'two_factor') NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    last_activity_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    revoked_at TIMESTAMP NULL,
    revoked_reason VARCHAR(255) NULL,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_sessions_user_id (user_id),
    INDEX idx_session_token (session_token),
    INDEX idx_expires_at (expires_at),
    INDEX idx_last_activity (last_activity_at)
);
```

### Tablas de Autenticación y Seguridad

Para manejar múltiples métodos de autenticación, el sistema incluye tablas especializadas que almacenan información específica de cada método. La tabla `social_accounts` gestiona las conexiones con proveedores de autenticación social, permitiendo que los usuarios vinculen múltiples cuentas sociales a su perfil principal.

```sql
CREATE TABLE social_accounts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    provider ENUM('google', 'facebook', 'twitter', 'discord') NOT NULL,
    provider_user_id VARCHAR(255) NOT NULL,
    provider_email VARCHAR(255) NULL,
    provider_username VARCHAR(255) NULL,
    provider_avatar_url VARCHAR(500) NULL,
    access_token TEXT NULL,
    refresh_token TEXT NULL,
    token_expires_at TIMESTAMP NULL,
    scopes TEXT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_provider_user (provider, provider_user_id),
    INDEX idx_social_user_id (user_id),
    INDEX idx_provider (provider)
);
```

La tabla `wallet_connections` almacena información sobre las conexiones de wallet de los usuarios, incluyendo metadatos sobre el tipo de wallet utilizado y el historial de conexiones. Esta información es valiosa para análisis de seguridad y experiencia de usuario.

```sql
CREATE TABLE wallet_connections (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    wallet_type ENUM('tronlink', 'metamask', 'walletconnect', 'ledger', 'other') NOT NULL,
    wallet_address VARCHAR(42) NOT NULL, -- Puede ser TRX o ETH address
    address_type ENUM('tron', 'ethereum') NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_signature TEXT NULL,
    verification_message VARCHAR(255) NULL,
    verified_at TIMESTAMP NULL,
    last_used_at TIMESTAMP NULL,
    connection_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_wallet_user_id (user_id),
    INDEX idx_wallet_address (wallet_address),
    INDEX idx_wallet_type (wallet_type)
);
```

### Tablas de Verificación y Recuperación

El sistema incluye tablas especializadas para manejar procesos de verificación de email, recuperación de contraseñas, y otros tokens temporales. Estas tablas implementan expiración automática y límites de uso para prevenir abusos.

```sql
CREATE TABLE verification_tokens (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    token_type ENUM('email_verification', 'password_reset', 'trx_verification', 'two_factor_setup') NOT NULL,
    email VARCHAR(255) NULL,
    trx_address VARCHAR(34) NULL,
    expires_at TIMESTAMP NOT NULL,
    used_at TIMESTAMP NULL,
    attempts INT DEFAULT 0,
    max_attempts INT DEFAULT 3,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_verification_token (token),
    INDEX idx_verification_user_id (user_id),
    INDEX idx_verification_type (token_type),
    INDEX idx_expires_at (expires_at)
);
```

### Tablas de Auditoría y Logging

Para cumplir con requisitos de compliance y seguridad, el sistema incluye tablas detalladas de auditoría que registran todas las actividades importantes relacionadas con la autenticación y gestión de cuentas.

```sql
CREATE TABLE audit_logs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NULL,
    session_id BIGINT NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50) NULL,
    resource_id VARCHAR(255) NULL,
    old_values JSON NULL,
    new_values JSON NULL,
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT NULL,
    success BOOLEAN NOT NULL,
    error_message TEXT NULL,
    metadata JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (session_id) REFERENCES user_sessions(id) ON DELETE SET NULL,
    INDEX idx_audit_user_id (user_id),
    INDEX idx_audit_action (action),
    INDEX idx_audit_created_at (created_at),
    INDEX idx_audit_success (success)
);
```

### Optimización y Rendimiento

El diseño de la base de datos incluye múltiples optimizaciones para garantizar un rendimiento óptimo incluso con grandes volúmenes de datos. Los índices están estratégicamente ubicados en columnas que se consultan frecuentemente, como direcciones de email, nombres de usuario, y direcciones TRX.

Para mejorar el rendimiento de consultas complejas, se implementan índices compuestos en combinaciones de columnas que se consultan juntas frecuentemente. Por ejemplo, un índice compuesto en `(account_status, created_at)` optimiza las consultas que buscan usuarios activos ordenados por fecha de registro.

La partición de tablas se implementa para tablas que crecen rápidamente como `audit_logs` y `user_sessions`. La partición por fecha permite que las consultas históricas sean más eficientes y facilita el archivado de datos antiguos.

```sql
-- Ejemplo de partición por fecha para audit_logs
ALTER TABLE audit_logs PARTITION BY RANGE (YEAR(created_at)) (
    PARTITION p2024 VALUES LESS THAN (2025),
    PARTITION p2025 VALUES LESS THAN (2026),
    PARTITION p2026 VALUES LESS THAN (2027),
    PARTITION p_future VALUES LESS THAN MAXVALUE
);
```

### Estrategias de Backup y Recuperación

El sistema implementa una estrategia de backup multi-nivel que incluye backups completos diarios, backups incrementales cada hora, y replicación en tiempo real a servidores secundarios. Los backups se almacenan en múltiples ubicaciones geográficas para garantizar la disponibilidad de datos incluso en caso de desastres naturales o fallos de infraestructura.

La recuperación point-in-time está habilitada para permitir la restauración de la base de datos a cualquier momento específico dentro de los últimos 30 días. Esto es crucial para recuperarse de errores de aplicación o corrupción de datos sin perder información valiosa.

Los procedimientos de recuperación están completamente documentados y se prueban regularmente mediante simulacros de desastre que verifican que los backups son válidos y que los tiempos de recuperación cumplen con los objetivos de nivel de servicio establecidos.


## API Endpoints y Especificaciones

### Arquitectura de API RESTful

La API del sistema de autenticación sigue los principios REST (Representational State Transfer) y está diseñada para ser intuitiva, consistente y fácil de integrar. Todos los endpoints utilizan métodos HTTP estándar (GET, POST, PUT, DELETE) y devuelven respuestas en formato JSON con códigos de estado HTTP apropiados.

La API está versionada utilizando el esquema `/api/v1/` en la URL, lo que permite la evolución de la API sin romper la compatibilidad con clientes existentes. Cada endpoint está documentado con especificaciones OpenAPI 3.0 que incluyen ejemplos de solicitudes y respuestas, códigos de error posibles, y esquemas de validación de datos.

### Endpoints de Registro de Usuarios

El endpoint principal para el registro de nuevos usuarios acepta múltiples métodos de registro y valida todos los datos de entrada antes de crear la cuenta. La validación incluye verificación de formato de email, fortaleza de contraseña, y validez de direcciones TRX.

```http
POST /api/v1/auth/register
Content-Type: application/json

{
    "username": "string (3-50 chars, alphanumeric + underscore)",
    "email": "string (valid email format)",
    "password": "string (min 8 chars, complexity requirements)",
    "trxAddress": "string (valid TRX address format)",
    "acceptTerms": "boolean (required: true)",
    "ageVerification": "boolean (required: true)",
    "marketingConsent": "boolean (optional)",
    "referralCode": "string (optional)"
}
```

La respuesta exitosa incluye información básica del usuario creado y un token de verificación de email:

```json
{
    "success": true,
    "message": "Usuario registrado exitosamente",
    "data": {
        "userId": "uuid",
        "username": "string",
        "email": "string",
        "trxAddress": "string",
        "accountStatus": "pending_verification",
        "emailVerificationRequired": true,
        "emailVerificationSent": true
    },
    "timestamp": "2024-07-31T10:30:00Z"
}
```

Para casos de error, la API devuelve respuestas detalladas que ayudan al cliente a identificar y corregir problemas específicos:

```json
{
    "success": false,
    "error": {
        "code": "VALIDATION_ERROR",
        "message": "Datos de entrada inválidos",
        "details": {
            "username": ["Nombre de usuario ya existe"],
            "email": ["Formato de email inválido"],
            "trxAddress": ["Dirección TRX ya registrada"],
            "password": ["Contraseña debe tener al menos 8 caracteres"]
        }
    },
    "timestamp": "2024-07-31T10:30:00Z"
}
```

### Endpoints de Validación en Tiempo Real

Para mejorar la experiencia de usuario, la API proporciona endpoints de validación que permiten verificar la disponibilidad de usernames, emails, y direcciones TRX en tiempo real mientras el usuario completa el formulario de registro.

```http
GET /api/v1/auth/check-username?username=ejemplo_usuario
```

```json
{
    "available": true,
    "suggestions": ["ejemplo_usuario1", "ejemplo_usuario2"]
}
```

```http
GET /api/v1/auth/check-email?email=usuario@ejemplo.com
```

```json
{
    "available": false,
    "message": "Email ya registrado",
    "canRecover": true
}
```

```http
GET /api/v1/auth/check-trx-address?address=TRX9UhjnbzHpKKBhGGNdWF3NfQZhGGNdWF
```

```json
{
    "available": true,
    "valid": true,
    "addressInfo": {
        "network": "mainnet",
        "type": "standard"
    }
}
```

### Endpoints de Inicio de Sesión

El sistema soporta múltiples métodos de inicio de sesión a través de diferentes endpoints especializados. El endpoint principal maneja autenticación con email/username y contraseña:

```http
POST /api/v1/auth/login
Content-Type: application/json

{
    "identifier": "string (email, username, or TRX address)",
    "password": "string",
    "rememberMe": "boolean (optional, default: false)",
    "deviceFingerprint": "string (optional)",
    "captchaToken": "string (required after failed attempts)"
}
```

La respuesta exitosa incluye tokens de acceso y refresh, junto con información de la sesión:

```json
{
    "success": true,
    "data": {
        "accessToken": "jwt_token_string",
        "refreshToken": "refresh_token_string",
        "expiresIn": 3600,
        "tokenType": "Bearer",
        "user": {
            "id": "uuid",
            "username": "string",
            "email": "string",
            "trxAddress": "string",
            "profileImage": "url",
            "accountStatus": "active",
            "twoFactorEnabled": false,
            "lastLogin": "2024-07-31T10:30:00Z"
        },
        "session": {
            "id": "session_id",
            "deviceInfo": "device_string",
            "location": "city, country",
            "createdAt": "2024-07-31T10:30:00Z"
        }
    }
}
```

### Endpoints de Autenticación con Wallet

Para usuarios que prefieren autenticarse usando sus wallets de criptomonedas, el sistema proporciona endpoints especializados que implementan el flujo de firma de mensajes:

```http
POST /api/v1/auth/wallet/challenge
Content-Type: application/json

{
    "walletAddress": "string (TRX or ETH address)",
    "walletType": "string (tronlink, metamask, walletconnect)"
}
```

```json
{
    "success": true,
    "data": {
        "challenge": "string (message to sign)",
        "challengeId": "uuid",
        "expiresIn": 300
    }
}
```

```http
POST /api/v1/auth/wallet/verify
Content-Type: application/json

{
    "challengeId": "uuid",
    "signature": "string (signed message)",
    "walletAddress": "string",
    "publicKey": "string (optional)"
}
```

### Endpoints de Gestión de Sesiones

El sistema proporciona endpoints completos para la gestión de sesiones activas, permitiendo a los usuarios ver y controlar todos sus accesos activos:

```http
GET /api/v1/auth/sessions
Authorization: Bearer {access_token}
```

```json
{
    "success": true,
    "data": {
        "currentSession": {
            "id": "session_id",
            "deviceInfo": "device_string",
            "location": "city, country",
            "ipAddress": "192.168.1.1",
            "lastActivity": "2024-07-31T10:30:00Z",
            "isCurrent": true
        },
        "otherSessions": [
            {
                "id": "session_id_2",
                "deviceInfo": "mobile_device",
                "location": "other_city, country",
                "ipAddress": "192.168.1.2",
                "lastActivity": "2024-07-30T15:20:00Z",
                "isCurrent": false
            }
        ],
        "totalSessions": 2
    }
}
```

```http
DELETE /api/v1/auth/sessions/{session_id}
Authorization: Bearer {access_token}
```

```json
{
    "success": true,
    "message": "Sesión revocada exitosamente"
}
```

### Endpoints de Recuperación de Contraseña

El flujo de recuperación de contraseña está implementado a través de múltiples endpoints que manejan la solicitud, verificación, y restablecimiento de contraseñas:

```http
POST /api/v1/auth/forgot-password
Content-Type: application/json

{
    "identifier": "string (email or TRX address)"
}
```

```json
{
    "success": true,
    "message": "Instrucciones de recuperación enviadas",
    "data": {
        "emailSent": true,
        "expiresIn": 3600
    }
}
```

```http
POST /api/v1/auth/reset-password
Content-Type: application/json

{
    "token": "string (reset token from email)",
    "newPassword": "string",
    "confirmPassword": "string"
}
```

### Endpoints de Verificación de Email

La verificación de email es un proceso crítico que se maneja a través de endpoints especializados:

```http
GET /api/v1/auth/verify-email?token={verification_token}
```

```json
{
    "success": true,
    "message": "Email verificado exitosamente",
    "data": {
        "userId": "uuid",
        "emailVerified": true,
        "verifiedAt": "2024-07-31T10:30:00Z"
    }
}
```

```http
POST /api/v1/auth/resend-verification
Content-Type: application/json

{
    "email": "string"
}
```

### Endpoints de Autenticación de Dos Factores

Para usuarios que requieren seguridad adicional, el sistema soporta autenticación de dos factores (2FA) a través de aplicaciones TOTP:

```http
POST /api/v1/auth/2fa/setup
Authorization: Bearer {access_token}
```

```json
{
    "success": true,
    "data": {
        "secret": "base32_secret_string",
        "qrCode": "data:image/png;base64,qr_code_data",
        "backupCodes": ["code1", "code2", "code3", "code4", "code5"]
    }
}
```

```http
POST /api/v1/auth/2fa/verify-setup
Authorization: Bearer {access_token}
Content-Type: application/json

{
    "token": "string (6-digit TOTP code)",
    "password": "string (current password for confirmation)"
}
```

### Manejo de Errores y Códigos de Estado

La API implementa un sistema consistente de manejo de errores que utiliza códigos de estado HTTP estándar y proporciona información detallada sobre los errores en el cuerpo de la respuesta. Los códigos de error más comunes incluyen:

- `400 Bad Request`: Datos de entrada inválidos o malformados
- `401 Unauthorized`: Token de autenticación inválido o expirado
- `403 Forbidden`: Acceso denegado por permisos insuficientes
- `404 Not Found`: Recurso solicitado no encontrado
- `409 Conflict`: Conflicto con el estado actual del recurso (ej: email ya registrado)
- `422 Unprocessable Entity`: Datos válidos pero que no cumplen reglas de negocio
- `429 Too Many Requests`: Límite de rate limiting excedido
- `500 Internal Server Error`: Error interno del servidor

Cada respuesta de error incluye un código de error específico de la aplicación que permite a los clientes manejar diferentes tipos de errores de manera apropiada:

```json
{
    "success": false,
    "error": {
        "code": "RATE_LIMIT_EXCEEDED",
        "message": "Demasiados intentos de inicio de sesión",
        "details": {
            "retryAfter": 300,
            "maxAttempts": 5,
            "currentAttempts": 6
        }
    },
    "timestamp": "2024-07-31T10:30:00Z"
}
```


## Integración con Blockchain Tron

### Arquitectura de Integración Blockchain

La integración con la blockchain de Tron es un componente fundamental del sistema de autenticación de Score Milk, ya que permite utilizar direcciones TRX como identificadores únicos de usuario y habilita funcionalidades avanzadas como la verificación de propiedad de wallets y el monitoreo de transacciones. Esta integración está diseñada para ser robusta, eficiente y escalable, manejando las particularidades de la red Tron mientras proporciona una experiencia de usuario fluida.

El sistema utiliza una arquitectura de múltiples capas para interactuar with la blockchain de Tron. En la capa más baja, se establecen conexiones directas con nodos de Tron utilizando tanto nodos propios como servicios de terceros confiables como TronGrid. Esta redundancia garantiza alta disponibilidad incluso si algunos nodos experimentan problemas.

La capa de abstracción de blockchain encapsula todas las operaciones específicas de Tron, proporcionando una interfaz limpia y consistente para el resto de la aplicación. Esta capa maneja la validación de direcciones, la verificación de firmas, la consulta de balances, y el monitoreo de transacciones, abstrayendo la complejidad de la interacción directa con la blockchain.

### Validación de Direcciones TRX

La validación de direcciones TRX es un proceso crítico que debe ser tanto rápido como preciso. El sistema implementa múltiples niveles de validación para garantizar que solo direcciones válidas sean aceptadas en el registro de usuarios.

El primer nivel de validación es sintáctico y verifica que la dirección tenga el formato correcto. Las direcciones TRX válidas deben comenzar con la letra 'T', tener exactamente 34 caracteres, y utilizar solo caracteres del alfabeto Base58. Esta validación se puede realizar localmente sin necesidad de consultar la blockchain.

```javascript
function validateTrxAddressFormat(address) {
    // Verificar longitud y prefijo
    if (!address || address.length !== 34 || !address.startsWith('T')) {
        return false;
    }
    
    // Verificar caracteres Base58 válidos
    const base58Regex = /^[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]+$/;
    if (!base58Regex.test(address)) {
        return false;
    }
    
    return true;
}
```

El segundo nivel de validación utiliza el algoritmo de checksum específico de Tron para verificar que la dirección sea matemáticamente válida. Este proceso implica decodificar la dirección Base58, extraer el checksum, y verificar que coincida con el hash calculado de los datos de la dirección.

```javascript
function validateTrxAddressChecksum(address) {
    try {
        // Decodificar Base58
        const decoded = base58Decode(address);
        
        // Extraer payload y checksum
        const payload = decoded.slice(0, -4);
        const checksum = decoded.slice(-4);
        
        // Calcular checksum esperado
        const hash1 = sha256(payload);
        const hash2 = sha256(hash1);
        const expectedChecksum = hash2.slice(0, 4);
        
        // Comparar checksums
        return checksum.equals(expectedChecksum);
    } catch (error) {
        return false;
    }
}
```

El tercer nivel de validación, opcional pero recomendado para casos de alta seguridad, consulta la blockchain para verificar que la dirección existe y tiene actividad. Esta validación es más lenta pero proporciona la máxima confianza en la validez de la dirección.

### Verificación de Propiedad de Wallet

Para casos donde es necesario verificar que un usuario realmente controla una dirección TRX específica, el sistema implementa un protocolo de desafío-respuesta basado en firmas criptográficas. Este proceso es fundamental para prevenir el registro fraudulento con direcciones que no pertenecen al usuario.

El flujo de verificación comienza cuando el sistema genera un mensaje de desafío único que incluye información específica como timestamp, identificador de sesión, y datos del usuario. Este mensaje debe ser firmado por la clave privada correspondiente a la dirección TRX que se está verificando.

```javascript
function generateChallengeMessage(userAddress, sessionId) {
    const timestamp = Date.now();
    const nonce = generateRandomNonce();
    
    return {
        message: `Score Milk Authentication Challenge
Address: ${userAddress}
Session: ${sessionId}
Timestamp: ${timestamp}
Nonce: ${nonce}
Please sign this message to verify ownership of your wallet.`,
        timestamp,
        nonce,
        expiresAt: timestamp + (5 * 60 * 1000) // 5 minutos
    };
}
```

Una vez que el usuario firma el mensaje utilizando su wallet (TronLink, Ledger, etc.), el sistema verifica la firma utilizando la clave pública derivada de la dirección TRX. La verificación exitosa confirma que el usuario controla la clave privada correspondiente a la dirección.

```javascript
async function verifySignature(address, message, signature) {
    try {
        // Recuperar clave pública de la firma
        const publicKey = recoverPublicKeyFromSignature(message, signature);
        
        // Derivar dirección de la clave pública
        const derivedAddress = deriveAddressFromPublicKey(publicKey);
        
        // Verificar que la dirección derivada coincida
        return derivedAddress === address;
    } catch (error) {
        console.error('Error verifying signature:', error);
        return false;
    }
}
```

### Monitoreo de Transacciones

Para funcionalidades avanzadas como la detección automática de depósitos o la verificación de pagos, el sistema implementa un servicio de monitoreo de transacciones que observa la blockchain en busca de actividad relevante en direcciones de usuarios registrados.

El servicio de monitoreo utiliza una combinación de polling periódico y webhooks (cuando están disponibles) para detectar nuevas transacciones. Para optimizar el rendimiento, el sistema mantiene un índice local de direcciones que necesitan ser monitoreadas y utiliza técnicas de batching para consultar múltiples direcciones en una sola llamada a la API.

```javascript
class TronTransactionMonitor {
    constructor(tronWeb, database) {
        this.tronWeb = tronWeb;
        this.database = database;
        this.monitoredAddresses = new Set();
        this.lastProcessedBlock = 0;
    }
    
    async startMonitoring() {
        // Cargar direcciones a monitorear desde la base de datos
        await this.loadMonitoredAddresses();
        
        // Iniciar polling de nuevos bloques
        setInterval(() => {
            this.processNewBlocks();
        }, 3000); // Cada 3 segundos
    }
    
    async processNewBlocks() {
        try {
            const currentBlock = await this.tronWeb.trx.getCurrentBlock();
            const currentBlockNumber = currentBlock.block_header.raw_data.number;
            
            if (currentBlockNumber > this.lastProcessedBlock) {
                await this.processBlockRange(
                    this.lastProcessedBlock + 1,
                    currentBlockNumber
                );
                this.lastProcessedBlock = currentBlockNumber;
            }
        } catch (error) {
            console.error('Error processing blocks:', error);
        }
    }
    
    async processBlockRange(startBlock, endBlock) {
        for (let blockNumber = startBlock; blockNumber <= endBlock; blockNumber++) {
            const block = await this.tronWeb.trx.getBlock(blockNumber);
            
            if (block.transactions) {
                for (const transaction of block.transactions) {
                    await this.processTransaction(transaction, blockNumber);
                }
            }
        }
    }
    
    async processTransaction(transaction, blockNumber) {
        const txInfo = await this.tronWeb.trx.getTransactionInfo(transaction.txID);
        
        // Verificar si la transacción involucra direcciones monitoreadas
        const involvedAddresses = this.extractAddressesFromTransaction(transaction);
        
        for (const address of involvedAddresses) {
            if (this.monitoredAddresses.has(address)) {
                await this.handleRelevantTransaction(transaction, txInfo, address);
            }
        }
    }
}
```

### Gestión de Conexiones y Failover

La estabilidad de la conexión con la blockchain es crucial para el funcionamiento del sistema. El sistema implementa múltiples estrategias para garantizar alta disponibilidad y manejo robusto de errores.

El pool de conexiones mantiene múltiples conexiones activas con diferentes nodos de Tron, incluyendo nodos propios y servicios de terceros. El sistema monitorea constantemente la salud de cada conexión y automáticamente redirige el tráfico a nodos saludables cuando detecta problemas.

```javascript
class TronConnectionPool {
    constructor(nodeConfigs) {
        this.nodes = nodeConfigs.map(config => ({
            ...config,
            tronWeb: new TronWeb(config),
            healthy: true,
            lastCheck: Date.now(),
            errorCount: 0
        }));
        
        this.currentNodeIndex = 0;
        this.healthCheckInterval = 30000; // 30 segundos
        
        this.startHealthChecks();
    }
    
    async executeWithFailover(operation) {
        const maxRetries = this.nodes.length;
        let lastError;
        
        for (let attempt = 0; attempt < maxRetries; attempt++) {
            const node = this.getHealthyNode();
            
            if (!node) {
                throw new Error('No healthy nodes available');
            }
            
            try {
                return await operation(node.tronWeb);
            } catch (error) {
                lastError = error;
                this.markNodeUnhealthy(node);
                console.warn(`Node ${node.url} failed, trying next node:`, error.message);
            }
        }
        
        throw new Error(`All nodes failed. Last error: ${lastError.message}`);
    }
    
    getHealthyNode() {
        const healthyNodes = this.nodes.filter(node => node.healthy);
        
        if (healthyNodes.length === 0) {
            return null;
        }
        
        // Round-robin entre nodos saludables
        const node = healthyNodes[this.currentNodeIndex % healthyNodes.length];
        this.currentNodeIndex++;
        
        return node;
    }
    
    async startHealthChecks() {
        setInterval(async () => {
            for (const node of this.nodes) {
                try {
                    await node.tronWeb.trx.getCurrentBlock();
                    node.healthy = true;
                    node.errorCount = 0;
                } catch (error) {
                    node.errorCount++;
                    if (node.errorCount >= 3) {
                        node.healthy = false;
                    }
                }
                node.lastCheck = Date.now();
            }
        }, this.healthCheckInterval);
    }
}
```

### Optimización de Rendimiento

Para manejar grandes volúmenes de operaciones blockchain de manera eficiente, el sistema implementa múltiples optimizaciones de rendimiento. El caching inteligente almacena resultados de consultas frecuentes como validaciones de direcciones y información de transacciones, reduciendo significativamente la carga en los nodos de Tron.

El batching de operaciones agrupa múltiples consultas relacionadas en una sola llamada cuando es posible, minimizando la latencia de red y mejorando el throughput general del sistema. Para operaciones que no requieren datos en tiempo real, el sistema utiliza un patrón de eventual consistency que permite respuestas más rápidas mientras sincroniza los datos en segundo plano.

```javascript
class TronOperationBatcher {
    constructor(tronWeb, batchSize = 50, batchTimeout = 1000) {
        this.tronWeb = tronWeb;
        this.batchSize = batchSize;
        this.batchTimeout = batchTimeout;
        
        this.pendingOperations = [];
        this.batchTimer = null;
    }
    
    async addOperation(operation) {
        return new Promise((resolve, reject) => {
            this.pendingOperations.push({
                operation,
                resolve,
                reject,
                timestamp: Date.now()
            });
            
            if (this.pendingOperations.length >= this.batchSize) {
                this.processBatch();
            } else if (!this.batchTimer) {
                this.batchTimer = setTimeout(() => {
                    this.processBatch();
                }, this.batchTimeout);
            }
        });
    }
    
    async processBatch() {
        if (this.batchTimer) {
            clearTimeout(this.batchTimer);
            this.batchTimer = null;
        }
        
        const batch = this.pendingOperations.splice(0, this.batchSize);
        
        if (batch.length === 0) {
            return;
        }
        
        try {
            const results = await this.executeBatch(batch);
            
            batch.forEach((item, index) => {
                item.resolve(results[index]);
            });
        } catch (error) {
            batch.forEach(item => {
                item.reject(error);
            });
        }
    }
    
    async executeBatch(batch) {
        // Agrupar operaciones similares para optimizar
        const addressValidations = batch.filter(item => 
            item.operation.type === 'validateAddress'
        );
        
        const balanceQueries = batch.filter(item => 
            item.operation.type === 'getBalance'
        );
        
        const results = [];
        
        // Procesar validaciones de direcciones en paralelo
        if (addressValidations.length > 0) {
            const validationPromises = addressValidations.map(item =>
                this.validateAddress(item.operation.address)
            );
            const validationResults = await Promise.all(validationPromises);
            results.push(...validationResults);
        }
        
        // Procesar consultas de balance en paralelo
        if (balanceQueries.length > 0) {
            const balancePromises = balanceQueries.map(item =>
                this.getBalance(item.operation.address)
            );
            const balanceResults = await Promise.all(balancePromises);
            results.push(...balanceResults);
        }
        
        return results;
    }
}
```

### Seguridad en Operaciones Blockchain

La seguridad es paramount en todas las operaciones relacionadas con blockchain. El sistema implementa múltiples capas de seguridad para proteger contra ataques comunes y garantizar la integridad de las operaciones.

Todas las operaciones sensibles requieren múltiples confirmaciones y utilizan timeouts apropiados para prevenir ataques de replay. El sistema mantiene logs detallados de todas las operaciones blockchain para auditoría y detección de actividades sospechosas.

Para operaciones que involucran fondos o cambios de estado importantes, el sistema implementa un patrón de multi-signature que requiere aprobación de múltiples partes antes de ejecutar la operación. Esto proporciona una capa adicional de seguridad contra errores y ataques maliciosos.


## Implementación del Servidor

### Arquitectura del Servidor Backend

La implementación del servidor backend para el sistema de autenticación de Score Milk utiliza Node.js con Express.js como framework principal, proporcionando una base sólida y escalable para manejar todas las operaciones de autenticación y gestión de usuarios. La arquitectura sigue el patrón MVC (Model-View-Controller) adaptado para APIs RESTful, con una clara separación de responsabilidades entre las diferentes capas del sistema.

El servidor está estructurado en múltiples módulos especializados que manejan diferentes aspectos del sistema. El módulo de autenticación gestiona todos los procesos relacionados con login, registro, y verificación de usuarios. El módulo de blockchain maneja todas las interacciones con la red Tron, incluyendo validación de direcciones y verificación de firmas. El módulo de notificaciones gestiona el envío de emails y otras comunicaciones con los usuarios.

```javascript
// server.js - Punto de entrada principal del servidor
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const morgan = require('morgan');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const blockchainRoutes = require('./routes/blockchain');

const { errorHandler, notFoundHandler } = require('./middleware/errorHandlers');
const { authenticateToken } = require('./middleware/auth');
const { validateRequest } = require('./middleware/validation');

const app = express();

// Configuración de seguridad
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    }
}));

// Configuración de CORS
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // máximo 100 requests por ventana
    message: {
        error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Demasiadas solicitudes, intenta de nuevo más tarde'
        }
    },
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(limiter);

// Middleware de parsing y compresión
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
app.use(morgan('combined'));

// Rutas de la API
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', authenticateToken, userRoutes);
app.use('/api/v1/blockchain', blockchainRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: process.env.npm_package_version || '1.0.0'
    });
});

// Manejo de errores
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en puerto ${PORT}`);
});

module.exports = app;
```

### Controladores de Autenticación

Los controladores de autenticación implementan toda la lógica de negocio relacionada con el registro, inicio de sesión, y gestión de sesiones de usuarios. Cada controlador está diseñado para ser modular, testeable, y fácil de mantener.

```javascript
// controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const User = require('../models/User');
const UserSession = require('../models/UserSession');
const VerificationToken = require('../models/VerificationToken');
const TronService = require('../services/TronService');
const EmailService = require('../services/EmailService');
const AuditLogger = require('../services/AuditLogger');

class AuthController {
    async register(req, res, next) {
        try {
            const {
                username,
                email,
                password,
                trxAddress,
                acceptTerms,
                ageVerification,
                marketingConsent
            } = req.body;

            // Validaciones de entrada
            if (!acceptTerms || !ageVerification) {
                return res.status(400).json({
                    success: false,
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Debes aceptar los términos y confirmar tu edad'
                    }
                });
            }

            // Verificar disponibilidad de username
            const existingUsername = await User.findByUsername(username);
            if (existingUsername) {
                return res.status(409).json({
                    success: false,
                    error: {
                        code: 'USERNAME_EXISTS',
                        message: 'El nombre de usuario ya está en uso'
                    }
                });
            }

            // Verificar disponibilidad de email
            const existingEmail = await User.findByEmail(email);
            if (existingEmail) {
                return res.status(409).json({
                    success: false,
                    error: {
                        code: 'EMAIL_EXISTS',
                        message: 'El email ya está registrado'
                    }
                });
            }

            // Validar dirección TRX
            if (!TronService.validateAddress(trxAddress)) {
                return res.status(400).json({
                    success: false,
                    error: {
                        code: 'INVALID_TRX_ADDRESS',
                        message: 'Dirección TRX inválida'
                    }
                });
            }

            // Verificar disponibilidad de dirección TRX
            const existingTrxAddress = await User.findByTrxAddress(trxAddress);
            if (existingTrxAddress) {
                return res.status(409).json({
                    success: false,
                    error: {
                        code: 'TRX_ADDRESS_EXISTS',
                        message: 'La dirección TRX ya está registrada'
                    }
                });
            }

            // Hash de la contraseña
            const saltRounds = 12;
            const passwordHash = await bcrypt.hash(password, saltRounds);

            // Crear usuario
            const userData = {
                uuid: uuidv4(),
                username,
                email,
                passwordHash,
                trxAddress,
                marketingConsent,
                termsAcceptedAt: new Date(),
                privacyPolicyAcceptedAt: new Date(),
                accountStatus: 'pending_verification'
            };

            const user = await User.create(userData);

            // Generar token de verificación de email
            const verificationToken = await VerificationToken.create({
                userId: user.id,
                tokenType: 'email_verification',
                email: email,
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 horas
            });

            // Enviar email de verificación
            await EmailService.sendVerificationEmail(email, verificationToken.token, username);

            // Log de auditoría
            await AuditLogger.log({
                userId: user.id,
                action: 'USER_REGISTERED',
                ipAddress: req.ip,
                userAgent: req.get('User-Agent'),
                success: true,
                metadata: {
                    username,
                    email,
                    trxAddress,
                    registrationMethod: 'email_password'
                }
            });

            res.status(201).json({
                success: true,
                message: 'Usuario registrado exitosamente',
                data: {
                    userId: user.uuid,
                    username: user.username,
                    email: user.email,
                    trxAddress: user.trxAddress,
                    accountStatus: user.accountStatus,
                    emailVerificationRequired: true,
                    emailVerificationSent: true
                },
                timestamp: new Date().toISOString()
            });

        } catch (error) {
            next(error);
        }
    }

    async login(req, res, next) {
        try {
            const { identifier, password, rememberMe, deviceFingerprint } = req.body;

            // Buscar usuario por email, username o dirección TRX
            let user = await User.findByEmail(identifier) ||
                      await User.findByUsername(identifier) ||
                      await User.findByTrxAddress(identifier);

            if (!user) {
                await AuditLogger.log({
                    action: 'LOGIN_FAILED',
                    ipAddress: req.ip,
                    userAgent: req.get('User-Agent'),
                    success: false,
                    metadata: { identifier, reason: 'user_not_found' }
                });

                return res.status(401).json({
                    success: false,
                    error: {
                        code: 'INVALID_CREDENTIALS',
                        message: 'Credenciales inválidas'
                    }
                });
            }

            // Verificar si la cuenta está bloqueada
            if (user.lockedUntil && user.lockedUntil > new Date()) {
                return res.status(423).json({
                    success: false,
                    error: {
                        code: 'ACCOUNT_LOCKED',
                        message: 'Cuenta temporalmente bloqueada por múltiples intentos fallidos',
                        lockedUntil: user.lockedUntil
                    }
                });
            }

            // Verificar contraseña
            const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
            if (!isPasswordValid) {
                // Incrementar intentos fallidos
                await User.incrementFailedAttempts(user.id);

                await AuditLogger.log({
                    userId: user.id,
                    action: 'LOGIN_FAILED',
                    ipAddress: req.ip,
                    userAgent: req.get('User-Agent'),
                    success: false,
                    metadata: { identifier, reason: 'invalid_password' }
                });

                return res.status(401).json({
                    success: false,
                    error: {
                        code: 'INVALID_CREDENTIALS',
                        message: 'Credenciales inválidas'
                    }
                });
            }

            // Verificar estado de la cuenta
            if (user.accountStatus !== 'active') {
                return res.status(403).json({
                    success: false,
                    error: {
                        code: 'ACCOUNT_NOT_ACTIVE',
                        message: 'La cuenta no está activa',
                        accountStatus: user.accountStatus
                    }
                });
            }

            // Generar tokens
            const accessToken = jwt.sign(
                {
                    userId: user.uuid,
                    username: user.username,
                    trxAddress: user.trxAddress
                },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            const refreshToken = jwt.sign(
                { userId: user.uuid },
                process.env.JWT_REFRESH_SECRET,
                { expiresIn: rememberMe ? '30d' : '7d' }
            );

            // Crear sesión
            const sessionData = {
                userId: user.id,
                sessionToken: accessToken,
                refreshToken: refreshToken,
                deviceFingerprint,
                userAgent: req.get('User-Agent'),
                ipAddress: req.ip,
                loginMethod: 'password',
                expiresAt: new Date(Date.now() + (rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000))
            };

            const session = await UserSession.create(sessionData);

            // Actualizar información de login del usuario
            await User.updateLoginInfo(user.id, req.ip);

            // Log de auditoría
            await AuditLogger.log({
                userId: user.id,
                sessionId: session.id,
                action: 'LOGIN_SUCCESS',
                ipAddress: req.ip,
                userAgent: req.get('User-Agent'),
                success: true,
                metadata: {
                    loginMethod: 'password',
                    rememberMe,
                    deviceFingerprint
                }
            });

            res.json({
                success: true,
                data: {
                    accessToken,
                    refreshToken,
                    expiresIn: 3600,
                    tokenType: 'Bearer',
                    user: {
                        id: user.uuid,
                        username: user.username,
                        email: user.email,
                        trxAddress: user.trxAddress,
                        profileImage: user.profileImageUrl,
                        accountStatus: user.accountStatus,
                        twoFactorEnabled: user.twoFactorEnabled,
                        lastLogin: user.lastLoginAt
                    },
                    session: {
                        id: session.id,
                        deviceInfo: req.get('User-Agent'),
                        ipAddress: req.ip,
                        createdAt: session.createdAt
                    }
                }
            });

        } catch (error) {
            next(error);
        }
    }

    async logout(req, res, next) {
        try {
            const sessionToken = req.token;

            // Revocar sesión
            await UserSession.revoke(sessionToken, 'user_logout');

            // Log de auditoría
            await AuditLogger.log({
                userId: req.user.userId,
                action: 'LOGOUT',
                ipAddress: req.ip,
                userAgent: req.get('User-Agent'),
                success: true
            });

            res.json({
                success: true,
                message: 'Sesión cerrada exitosamente'
            });

        } catch (error) {
            next(error);
        }
    }

    async refreshToken(req, res, next) {
        try {
            const { refreshToken } = req.body;

            if (!refreshToken) {
                return res.status(400).json({
                    success: false,
                    error: {
                        code: 'MISSING_REFRESH_TOKEN',
                        message: 'Token de refresh requerido'
                    }
                });
            }

            // Verificar refresh token
            const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
            const session = await UserSession.findByRefreshToken(refreshToken);

            if (!session || session.revokedAt) {
                return res.status(401).json({
                    success: false,
                    error: {
                        code: 'INVALID_REFRESH_TOKEN',
                        message: 'Token de refresh inválido'
                    }
                });
            }

            // Verificar que la sesión no haya expirado
            if (session.expiresAt < new Date()) {
                await UserSession.revoke(refreshToken, 'token_expired');
                return res.status(401).json({
                    success: false,
                    error: {
                        code: 'REFRESH_TOKEN_EXPIRED',
                        message: 'Token de refresh expirado'
                    }
                });
            }

            const user = await User.findById(session.userId);
            if (!user || user.accountStatus !== 'active') {
                return res.status(401).json({
                    success: false,
                    error: {
                        code: 'USER_NOT_ACTIVE',
                        message: 'Usuario no activo'
                    }
                });
            }

            // Generar nuevo access token
            const newAccessToken = jwt.sign(
                {
                    userId: user.uuid,
                    username: user.username,
                    trxAddress: user.trxAddress
                },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            // Actualizar sesión
            await UserSession.updateToken(session.id, newAccessToken);

            res.json({
                success: true,
                data: {
                    accessToken: newAccessToken,
                    expiresIn: 3600,
                    tokenType: 'Bearer'
                }
            });

        } catch (error) {
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({
                    success: false,
                    error: {
                        code: 'INVALID_REFRESH_TOKEN',
                        message: 'Token de refresh inválido'
                    }
                });
            }
            next(error);
        }
    }
}

module.exports = new AuthController();
```

### Servicios Especializados

El sistema incluye varios servicios especializados que encapsulan lógica de negocio específica y proporcionan interfaces limpias para operaciones complejas.

```javascript
// services/TronService.js
const TronWeb = require('tronweb');
const crypto = require('crypto');

class TronService {
    constructor() {
        this.tronWeb = new TronWeb({
            fullHost: process.env.TRON_FULL_NODE || 'https://api.trongrid.io',
            headers: { 'TRON-PRO-API-KEY': process.env.TRON_API_KEY },
            privateKey: process.env.TRON_PRIVATE_KEY
        });
    }

    validateAddress(address) {
        try {
            return this.tronWeb.isAddress(address);
        } catch (error) {
            console.error('Error validating TRX address:', error);
            return false;
        }
    }

    async getAccountInfo(address) {
        try {
            const account = await this.tronWeb.trx.getAccount(address);
            return {
                address: address,
                balance: account.balance || 0,
                exists: !!account.address,
                createTime: account.create_time,
                lastOperationTime: account.latest_opration_time
            };
        } catch (error) {
            console.error('Error getting account info:', error);
            throw new Error('Failed to get account information');
        }
    }

    generateChallengeMessage(address, sessionId) {
        const timestamp = Date.now();
        const nonce = crypto.randomBytes(16).toString('hex');
        
        const message = `Score Milk Authentication Challenge
Address: ${address}
Session: ${sessionId}
Timestamp: ${timestamp}
Nonce: ${nonce}
Please sign this message to verify ownership of your wallet.`;

        return {
            message,
            timestamp,
            nonce,
            expiresAt: timestamp + (5 * 60 * 1000) // 5 minutos
        };
    }

    async verifySignature(address, message, signature) {
        try {
            const messageHash = this.tronWeb.sha3(message);
            const recoveredAddress = this.tronWeb.address.fromHex(
                this.tronWeb.address.toHex(
                    this.tronWeb.utils.crypto.ecRecover(messageHash, signature)
                )
            );
            
            return recoveredAddress === address;
        } catch (error) {
            console.error('Error verifying signature:', error);
            return false;
        }
    }

    async monitorAddress(address, callback) {
        // Implementar monitoreo de transacciones para una dirección específica
        const checkInterval = 30000; // 30 segundos
        
        let lastCheckedBlock = await this.tronWeb.trx.getCurrentBlock();
        
        const monitor = setInterval(async () => {
            try {
                const currentBlock = await this.tronWeb.trx.getCurrentBlock();
                const currentBlockNumber = currentBlock.block_header.raw_data.number;
                const lastBlockNumber = lastCheckedBlock.block_header.raw_data.number;
                
                if (currentBlockNumber > lastBlockNumber) {
                    // Verificar transacciones en bloques nuevos
                    for (let i = lastBlockNumber + 1; i <= currentBlockNumber; i++) {
                        const block = await this.tronWeb.trx.getBlock(i);
                        
                        if (block.transactions) {
                            for (const tx of block.transactions) {
                                if (this.transactionInvolvesAddress(tx, address)) {
                                    callback(tx, i);
                                }
                            }
                        }
                    }
                    
                    lastCheckedBlock = currentBlock;
                }
            } catch (error) {
                console.error('Error monitoring address:', error);
            }
        }, checkInterval);
        
        return monitor;
    }

    transactionInvolvesAddress(transaction, address) {
        // Verificar si una transacción involucra una dirección específica
        const contract = transaction.raw_data.contract[0];
        
        if (contract.type === 'TransferContract') {
            const parameter = contract.parameter.value;
            return parameter.owner_address === address || parameter.to_address === address;
        }
        
        // Agregar más tipos de contratos según sea necesario
        return false;
    }
}

module.exports = new TronService();
```

### Middleware de Seguridad

El sistema implementa múltiples capas de middleware de seguridad que protegen contra ataques comunes y garantizan que solo usuarios autenticados y autorizados puedan acceder a recursos protegidos.

```javascript
// middleware/auth.js
const jwt = require('jsonwebtoken');
const UserSession = require('../models/UserSession');
const User = require('../models/User');

const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                error: {
                    code: 'MISSING_TOKEN',
                    message: 'Token de acceso requerido'
                }
            });
        }

        // Verificar token JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Verificar que la sesión existe y está activa
        const session = await UserSession.findByToken(token);
        if (!session || session.revokedAt) {
            return res.status(401).json({
                success: false,
                error: {
                    code: 'INVALID_TOKEN',
                    message: 'Token inválido o revocado'
                }
            });
        }

        // Verificar que la sesión no haya expirado
        if (session.expiresAt < new Date()) {
            await UserSession.revoke(token, 'token_expired');
            return res.status(401).json({
                success: false,
                error: {
                    code: 'TOKEN_EXPIRED',
                    message: 'Token expirado'
                }
            });
        }

        // Verificar que el usuario existe y está activo
        const user = await User.findByUuid(decoded.userId);
        if (!user || user.accountStatus !== 'active') {
            return res.status(401).json({
                success: false,
                error: {
                    code: 'USER_NOT_ACTIVE',
                    message: 'Usuario no activo'
                }
            });
        }

        // Actualizar última actividad de la sesión
        await UserSession.updateLastActivity(session.id);

        // Agregar información del usuario y sesión al request
        req.user = decoded;
        req.session = session;
        req.token = token;

        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                error: {
                    code: 'INVALID_TOKEN',
                    message: 'Token inválido'
                }
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                error: {
                    code: 'TOKEN_EXPIRED',
                    message: 'Token expirado'
                }
            });
        }

        next(error);
    }
};

module.exports = { authenticateToken };
```

