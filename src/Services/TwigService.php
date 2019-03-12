<?php


namespace KikCMS\Services;


use KikCMS\Classes\Phalcon\AccessControl;
use KikCMS\Classes\Translator;
use KikCMS\Config\PlaceholderConfig;
use Phalcon\Config;
use Phalcon\Di\Injectable;
use Phalcon\Tag;

/**
 * @property AccessControl $acl
 * @property Translator $translator
 * @property PlaceholderService $placeholderService
 */
class TwigService extends Injectable
{
    /**
     * @param string $resourceName
     * @param string $access
     * @param array|null $parameters
     * @return string
     */
    public function allowed(string $resourceName, $access = '*', array $parameters = null): string
    {
        return $this->acl->allowed($resourceName, $access, $parameters);
    }

    /**
     * @param string $string
     * @return string
     */
    public function config(string $string): string
    {
        $string = explode('.', $string);

        /** @var Config $configGroup */
        $configGroup = $this->config->get("config")->get($string[0]);

        if ( ! $configGroup) {
            return null;
        }

        return $configGroup->get($string[1]);
    }

    /**
     * @return string
     */
    public function endForm(): string
    {
        return Tag::endForm();
    }

    /**
     * @param int|null $fileId
     * @param string|null $thumb
     * @return string
     * @deprecated use mediaFile
     */
    public function file(?int $fileId, string $thumb = null): string
    {
        if( ! $fileId){
            return '';
        }

        if ( ! $thumb) {
            return $this->url->get('finderFile', $fileId);
        }

        return $this->url->get('finderFileTypedThumb', [$thumb, $fileId]);
    }

    /**
     * @param int|null $fileId
     * @param string|null $thumb
     * @param bool $private
     * @return string
     */
    public function mediaFile(?int $fileId, string $thumb = null, $private = false): string
    {
        if( ! $fileId){
            return '';
        }

        if ( ! $thumb) {
            return $this->placeholderService->getValue(PlaceholderConfig::FILE_URL, $fileId, $private);
        }

        return $this->placeholderService->getValue(PlaceholderConfig::FILE_THUMB_URL, $fileId, $thumb, $private);
    }

    /**
     * @param int|null $fileId
     * @param string|null $thumb
     * @return string
     * @deprecated use mediaFileBg
     */
    public function fileBg(?int $fileId, string $thumb = null): string
    {
        return "background-image: url('" . $this->file($fileId, $thumb) . "');";
    }

    /**
     * @param int|null $fileId
     * @param string|null $thumb
     * @param bool $private
     * @return string
     */
    public function mediaFileBg(?int $fileId, string $thumb = null, bool $private = false): string
    {
        return "background-image: url('" . $this->mediaFile($fileId, $thumb, $private) . "');";
    }

    /**
     * @param array $parameters
     * @return string
     */
    public function form(array $parameters = []): string
    {
        return Tag::form($parameters);
    }

    /**
     * @param string $url
     * @param bool $local
     * @return string
     */
    public function javascriptInclude(string $url, bool $local = true): string
    {
        $parameters = [$url, $local, 'nonce' => $this->view->cspNonce];

        return Tag::javascriptInclude($parameters);
    }

    /**
     * @param string $url
     * @param bool $local
     * @return string
     */
    public function stylesheetLink(string $url, bool $local = true): string
    {
        $parameters = [$url, $local, 'nonce' => $this->view->cspNonce];

        return Tag::stylesheetLink($parameters);
    }

    /**
     * @param string $value
     * @param array $parameters
     * @return string
     */
    public function submitButton(string $value, array $parameters): string
    {
        return Tag::submitButton(['value' => $value] + $parameters);
    }

    /**
     * @param string|int $value
     * @return string
     */
    public function svg($value): string
    {
        if (is_numeric($value)) {
            $filePath = SITE_PATH . 'storage/media/' . $value . '.svg';
        } else {
            $filePath = SITE_PATH . 'public_html/images/icons/' . $value . '.svg';
        }

        if ( ! file_exists($filePath)) {
            return '?';
        }

        return file_get_contents($filePath);
    }

    /**
     * @param string|null $string
     * @param array $parameters
     * @return string
     */
    public function tl(?string $string, array $parameters = []): string
    {
        return $this->translator->tl($string, $parameters);
    }

    /**
     * @param string $string
     * @return string
     */
    public function ucfirst(string $string): string
    {
        return ucfirst($string);
    }

    /**
     * @param string $route
     * @param null $args
     * @return string
     */
    public function url(string $route, $args = null): string
    {
        return $this->url->get($route, $args);
    }

}