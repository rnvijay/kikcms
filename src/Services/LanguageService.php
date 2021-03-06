<?php declare(strict_types=1);

namespace KikCMS\Services;


use KikCMS\Classes\Phalcon\IniConfig;
use KikCmsCore\Services\DbService;
use KikCMS\Config\CacheConfig;
use KikCMS\Models\Language;
use Phalcon\Di\Injectable;

/**
 * Service for managing different languages for the website, and also for configuring these in the CMS
 *
 * @property IniConfig $config
 * @property CacheService $cacheService
 * @property DbService $dbService
 */
class LanguageService extends Injectable
{
    /**
     * @return string
     */
    public function getDefaultLanguageCode(): string
    {
        return $this->config->application->defaultLanguage;
    }

    /**
     * @return string
     */
    public function getDefaultCmsLanguageCode(): string
    {
        if (isset($this->config->application->defaultCmsLanguage)) {
            return $this->config->application->defaultCmsLanguage;
        }

        return $this->getDefaultLanguageCode();
    }

    /**
     * @param bool $activeOnly
     * @return Language[]
     */
    public function getLanguages(bool $activeOnly = false)
    {
        return $this->cacheService->cache(CacheConfig::LANGUAGES, function () use ($activeOnly){
            if ($activeOnly) {
                $results = Language::find([Language::FIELD_ACTIVE . ' = 1']);
            } else {
                $results = Language::find();
            }

            return $this->dbService->toMap($results, Language::FIELD_CODE);
        });
    }

    /**
     * @return string
     */
    public function getDefaultLanguageName(): string
    {
        foreach ($this->getLanguages() as $language){
            if($language->code == $this->getDefaultLanguageCode()){
                return (string) $language->name;
            }
        }

        return '';
    }
}