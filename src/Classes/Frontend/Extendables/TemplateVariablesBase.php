<?php

namespace KikCMS\Classes\Frontend\Extendables;


use KikCMS\Classes\Frontend\WebsiteExtendable;

/**
 * Contains methods to set the view's variables
 */
class TemplateVariablesBase extends WebsiteExtendable
{
    /**
     * Override to return variables that should be available in any template
     *
     * @return array
     */
    public function getGlobalVariables(): array
    {
        return [];
    }

    /**
     * @param string $templateFile
     * @return array
     */
    public function getTemplateVariables(string $templateFile): array
    {
        $methodName = 'get' . ucfirst($templateFile) . 'Variables';

        if( ! method_exists($this, $methodName)){
            return [];
        }

        return $this->$methodName();
    }
}