<?php
declare(strict_types=1);

namespace functional;

use FunctionalTester;

class FrontendCest
{
    public function resourcesExceededWorks(FunctionalTester $I)
    {
        $I->amOnPage('/test/resourcesexceeded');
        $I->see('Your request could not be completed due to insufficient resources. Please try again later.');
    }

    public function unauthorizedWorks(FunctionalTester $I)
    {
        $I->amOnPage('/test/unauthorized');
        $I->see('You are not allowed to view this page');
    }

    public function objectNotFoundWorks(FunctionalTester $I)
    {
        $I->amOnPage('/object-not-found');
        $I->see('Page not found');
    }

    public function pageWorks(FunctionalTester $I)
    {
        $I->amOnPage('/');
        $I->see('Home');

        $I->amOnPage('/nonexistingpage');
        $I->see('Page not found');
    }

    public function pageByIdWorks(FunctionalTester $I)
    {
        $I->amOnPage('/page/nl/3');
        $I->seeInCurrentUrl('/home');
        $I->see('Lorem ipsum');

        $I->amOnPage('/page/nl/999');
        $I->see('Helaas! De door uw opgevraagde pagina kon niet worden gevonden.');
    }

    public function pageByKeyWorks(FunctionalTester $I)
    {
        $I->amOnPage('/page/nl/default');
        $I->seeInCurrentUrl('/home');
        $I->see('Lorem ipsum');

        $I->amOnPage('/page/nl/nonexistingkey');
        $I->see('Helaas! De door uw opgevraagde pagina kon niet worden gevonden.');
    }
}