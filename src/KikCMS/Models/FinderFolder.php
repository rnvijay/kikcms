<?php

namespace KikCMS\Models;


class FinderFolder extends FinderFile
{
    public $is_folder = 1;

    /**
     * @inheritdoc
     *
     * @return FinderFolder
     */
    public static function getById($id)
    {
        return parent::getById($id);
    }
}