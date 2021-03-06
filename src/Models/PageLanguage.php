<?php declare(strict_types=1);

namespace KikCMS\Models;

use KikCmsCore\Classes\Model;

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
    const FIELD_SLUG            = 'slug';
    const FIELD_SEO_TITLE       = 'seo_title';
    const FIELD_SEO_DESCRIPTION = 'seo_description';
    const FIELD_SEO_KEYWORDS    = 'seo_keywords';

    /** @var string|null */
    private $aliasName;

    /** @var string|null */
    private $slug;

    /**
     * Remove cache
     */
    public function beforeDelete()
    {
        $this->getDI()->get('pageLanguageService')->removeCache($this);
    }

    /**
     * Create URL if needed
     */
    public function beforeSave()
    {
        $this->getDI()->get('pageLanguageService')->checkAndUpdateSlug($this);
    }

    /**
     * @inheritdoc
     */
    public function initialize()
    {
        parent::initialize();

        $pageClass = $this->getDI()->get('websiteSettings')->getPageClass() ?: Page::class;

        $this->belongsTo("page_id", $pageClass, "id", ["alias" => "page"]);
    }

    /**
     * @return int
     */
    public function getId(): int
    {
        return (int) $this->id;
    }

    /**
     * @return int
     */
    public function getPageId(): int
    {
        return (int) $this->page_id;
    }

    /**
     * Retrieve the parent pageLanguage, which has the same languageCode
     *
     * @return PageLanguage|null
     */
    public function getParent(): ?PageLanguage
    {
        if ( ! $parentPage = $this->page->parent) {
            return null;
        }

        return $parentPage->getPageLanguageByLangCode($this->getLanguageCode());
    }

    /**
     * Traverse up the page hierarchy (with this objects' language) until a parent PageLanguage is found with a slug
     *
     * @return null|PageLanguage
     */
    public function getParentWithSlug(): ?PageLanguage
    {
        return $this->page->getParentPageLanguageWithSlugByLangCode($this->getLanguageCode());
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

    /**
     * @return null|string
     */
    public function getSlug(): ?string
    {
        return $this->slug;
    }

    /**
     * @param null|string $slug
     * @return PageLanguage
     */
    public function setSlug(?string $slug): PageLanguage
    {
        $this->slug = $slug;
        return $this;
    }

    /**
     * @param string|null $name
     * @return PageLanguage
     */
    public function setName(?string $name): PageLanguage
    {
        $this->name = $name;
        return $this;
    }
}