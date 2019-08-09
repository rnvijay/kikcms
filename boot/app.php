<?php

use KikCMS\Plugins\PlaceholderConverterPlugin;
use Phalcon\Events\Manager;
use Phalcon\Mvc\Application;

if ( ! isset($sitePath)){
    throw new Exception('Variable $sitePath must be set');
}

require_once($sitePath . 'vendor/autoload.php');
require_once($sitePath . 'vendor/kiksaus/kikcms-core/src/functions.php');

$cli         = false;
$services    = require(__DIR__ . '/services.php');
$application = new Application($services);

$application->registerModules([
    "frontend" => [
        "className" => "KikCMS\\Modules\\Frontend",
    ],
    "backend"  => [
        "className" => "KikCMS\\Modules\\Backend",
    ],
    "websiteFrontend"  => [
        "className" => "KikCMS\\Modules\\WebsiteFrontend",
    ],
    "websiteBackend"  => [
        "className" => "KikCMS\\Modules\\WebsiteBackend",
    ],
]);

// add application event manager
$eventsManager = new Manager();
$eventsManager->attach("application:beforeSendResponse", new PlaceholderConverterPlugin);
$application->setEventsManager($eventsManager);

// make sure the errorHandler is initialized
$application->errorHandler;

return $application;