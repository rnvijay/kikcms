<?php declare(strict_types=1);

namespace KikCMS\Classes\WebForm\Fields;


use KikCMS\Classes\WebForm\Field;
use KikCMS\Models\File;
use Phalcon\Forms\Element\Hidden;

class FileField extends Field
{
    /** @var int|null */
    private $folderId;

    /**
     * @param string $key
     * @param string $label
     * @param array $validators
     */
    public function __construct(string $key, string $label, array $validators = [])
    {
        $element = (new Hidden($key))
            ->setLabel($label)
            ->addValidators($validators)
            ->setAttribute('class', 'fileId');

        $this->element = $element;
        $this->key     = $key;
    }

    /**
     * @inheritdoc
     */
    public function getType()
    {
        return Field::TYPE_FILE;
    }

    /**
     * @param int $fileId
     *
     * @return null|File
     */
    public function getFileById(int $fileId): ?File
    {
        return File::getById($fileId);
    }

    /**
     * @return int|null
     */
    public function getFolderId()
    {
        return $this->folderId;
    }

    /**
     * @param int|null $folderId
     * @return FileField
     */
    public function setFolderId(?int $folderId): FileField
    {
        $this->folderId = $folderId;
        return $this;
    }
}