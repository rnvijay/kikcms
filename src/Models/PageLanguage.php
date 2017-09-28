<?php

namespace KikCMS\Models;

use KikCMS\Classes\Model\Model;

/**
 * @property Page $page
 */
class PageLanguage extends Model
{
    const TABLE = 'cms_page_language';
    const ALIAS = 'pl';

    const FIELD_ID              = 'id';
    const FIELD_PAGE_ID         = 'page_id';
    const FIELD_LANGUAGE_CODE   = 'language_code';
    const FIELD_ACTIVE          = 'active';
    const FIELD_NAME            = 'name';
    const FIELD_URL             = 'url';
    const FIELD_SEO_TITLE       = 'seo_title';
    const FIELD_SEO_DESCRIPTION = 'seo_description';
    const FIELD_SEO_KEYWORDS    = 'seo_keywords';

    /** @var string|null */
    private $aliasName;

    /**
     * @inheritdoc
     */
    public function initialize()
    {
        parent::initialize();

        $this->belongsTo("page_id", Page::class, "id", ["alias" => "page"]);
    }

    /**
     * @return int
     */
    public function getPageId(): int
    {
        return (int) $this->page_id;
    }

    /**
     * @return string
     */
    public function getLanguageCode(): string
    {
        return (string) $this->language_code;
    }

    /**
     * @return string
     */
    public function getName(): string
    {
        if ($this->aliasName && empty($this->name)) {
            return $this->aliasName;
        }

        return (string) $this->name;
    }

    /**
     * @param string $name
     */
    public function setAliasName(string $name)
    {
        $this->aliasName = $name;
    }
}