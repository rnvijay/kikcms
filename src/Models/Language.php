<?php declare(strict_types=1);

namespace KikCMS\Models;

use KikCmsCore\Classes\Model;

class Language extends Model
{
    const TABLE = 'cms_language';

    const FIELD_ID     = 'id';
    const FIELD_NAME   = 'name';
    const FIELD_CODE   = 'code';
    const FIELD_ACTIVE = 'active';

    /**
     * @return string
     */
    public function getCode(): string
    {
        return (string) $this->code;
    }
}