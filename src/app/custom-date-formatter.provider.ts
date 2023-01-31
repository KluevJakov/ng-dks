import { CalendarDateFormatter, DateFormatterParams } from 'angular-calendar';
import { formatDate, FormatWidth } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable()
export class CustomDateFormatter extends CalendarDateFormatter {

    public override dayViewHour({ date, locale }: DateFormatterParams): string {
        return new Intl.DateTimeFormat("ru-RU", { hour: 'numeric', minute: 'numeric'}).format(date);
    }

    public override weekViewHour({ date, locale }: DateFormatterParams): string {
        return new Intl.DateTimeFormat("ru-RU", { hour: 'numeric', minute: 'numeric'}).format(date);
    }

    public override monthViewColumnHeader({ date, locale }: DateFormatterParams): string {
        return formatDate(date, "EEEE", "ru-RU");
    }

    public override monthViewTitle({ date, locale }: DateFormatterParams): string {
        return formatDate(date, "d MMMM", "ru-RU");
    }

    public override weekViewColumnHeader({ date, locale }: DateFormatterParams): string {
        return formatDate(date, "EEEE", "ru-RU");
    }

    public override weekViewColumnSubHeader({ date, locale, }: DateFormatterParams): string {
        return formatDate(date, "d MMM", "ru-RU");
    }
}