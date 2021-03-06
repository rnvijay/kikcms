<?php declare(strict_types=1);

namespace KikCMS\Services\Util;


use DateInterval;
use DateTime;
use KikCMS\Classes\Translator;
use Phalcon\Di\Injectable;
use Phalcon\Validation\Validator\Date;

/**
 * Utility Service for handling DateTime objects
 *
 * @property Translator $translator
 */
class DateTimeService extends Injectable
{
    /**
     * Converts a date string (like 2017-12-31) to the default display format
     *
     * @param null|string $dateString
     * @return string
     */
    public function stringToDateFormat(?string $dateString): string
    {
        if( ! $dateString){
            return '';
        }

        return strftime($this->translator->tl('system.dateDisplayFormat'), strtotime($dateString));
    }

    /**
     * Converts a datetime string (like 2017-12-31 12:51) to the default display format
     *
     * @param null|string $dateTimeString
     * @return string
     */
    public function stringToDateTimeFormat(?string $dateTimeString): string
    {
        if( ! $dateTimeString){
            return '';
        }

        return strftime($this->translator->tl('system.dateTimeDisplayFormat'), strtotime($dateTimeString));
    }

    /**
     * @return Date
     */
    public function getValidator(): Date
    {
        $phpDateFormat = $this->translator->tl('system.phpDateFormat');

        return new Date([
            "format"     => $phpDateFormat,
            "allowEmpty" => true,
        ]);
    }

    /**
     * Convert a datetime string, generated by a datepicker, to DateTime
     *
     * @param string $dateTime
     * @return null|DateTime
     */
    public function getFromDatePickerValue(?string $dateTime): ?DateTime
    {
        if ( ! $dateTime) {
            return null;
        }

        return DateTime::createFromFormat($this->getDateFormat(), $dateTime);
    }

    /**
     * Get the date one year ago, with the first day of that month
     *
     * @return DateTime
     */
    public function getOneYearAgoFirstDayOfMonth(): DateTime
    {
        $dateTime     = (new DateTime())->sub(new DateInterval('P1Y'));
        $subtractDays = (int) $dateTime->format('d') - 1;

        $dateTime->sub(new DateInterval('P' . $subtractDays . 'D'));

        return $dateTime;
    }

    /**
     * Get the default date format for the current language
     *
     * @return string
     */
    public function getDateFormat(): string
    {
        return $this->translator->tl('system.phpDateFormat');
    }
}