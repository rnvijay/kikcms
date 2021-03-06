<?php
declare(strict_types=1);

namespace Forms;

use Helpers\Unit;
use KikCMS\Classes\Phalcon\Cache;
use KikCMS\Forms\LanguageForm;
use KikCMS\Models\Language;
use ReflectionMethod;

class LanguageFormTest extends Unit
{
    public function testGetModel()
    {
        $languageForm = new LanguageForm();

        $this->assertEquals(Language::class, $languageForm->getModel());
    }

    public function testOnSave()
    {
        $method = new ReflectionMethod(LanguageForm::class, 'onSave');
        $method->setAccessible(true);

        $languageForm = new LanguageForm();

        $cacheMock = $this->createMock(Cache::class);
        $cacheMock->expects($this->once())->method('delete');

        $languageForm->cache = $cacheMock;

        $method->invoke($languageForm);
    }
}
