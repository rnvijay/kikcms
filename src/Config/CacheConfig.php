<?php

namespace KikCMS\Config;

/**
 * Contains various constants for globally used cache keys
 */
class CacheConfig
{
    const ONE_DAY = 86400;

    const LANGUAGES         = 'languages';
    const TRANSLATION       = 'translation';
    const USER_TRANSLATIONS = 'userTranslations';

    const PAGE_LANGUAGE_FOR_URL = 'pageLanguageForUrl';
    const URL                   = 'url';
    const MENU                  = 'menu';
    const MENU_FULL_PAGE_MAP    = 'menuFullPageMap';

    const STATS_REQUIRE_UPDATE     = 'statsRequireUpdate';
    const STATS_UPDATE_IN_PROGRESS = 'statsUpdateInProgress';
}