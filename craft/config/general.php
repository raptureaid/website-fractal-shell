<?php
/**
 * General Configuration
 *
 * All of your system's general configuration settings go in here. You can see a
 * list of the available settings in vendor/craftcms/cms/src/config/GeneralConfig.php.
 *
 * @see craft\config\GeneralConfig
 */

return [
    // Global settings
    '*' => [
        // Default Week Start Day (0 = Sunday, 1 = Monday...)
        'defaultWeekStartDay' => 0,

        // Enable CSRF Protection (recommended)
        'enableCsrfProtection' => true,

        // Whether generated URLs should omit "index.php"
        'omitScriptNameInUrls' => true,

        // Control Panel trigger word
        'cpTrigger' => getenv('CP_TRIGGER'),

        // The secure key Craft will use for hashing and encrypting data
        'securityKey' => getenv('SECURITY_KEY'),

        // Prevent user enumration
        'preventUserEnumeration' => true,

        // Define the root location
        'aliases' => [
            '@webroot' => dirname(__DIR__).'/web',
        ],
    ],

    // Dev environment settings
    'dev' => [
        // Base site URL
        'siteUrl' => '@web',

        // Dev Mode (see https://craftcms.com/support/dev-mode)
        'devMode' => true,

        // Disable template caching
        'enableTemplateCaching' => false,
    ],

    // Staging environment settings
    'staging' => [
        // Base site URL
        'siteUrl' => '@web',
    ],

    // Production environment settings
    'production' => [
        // Base site URL
        'siteUrl' => 'http://www.raptureaid.com',
    ],
];
