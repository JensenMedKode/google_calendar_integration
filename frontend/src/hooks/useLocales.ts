import { Locale } from "i18n/Locale";
import { useI18n } from "next-rosetta";
import { useRouter } from "next/router";
import { useState } from "react";
import "ts-array-ext/reduceAsync";
import { useEffectAsync } from "./useEffectAsync";

export const useLocales = () => {
  const [localeNameMap, setLocaleNameMap] = useState<Record<string, string>>();
  const { locale, locales } = useRouter();

  const { t } = useI18n<Locale>();

  useEffectAsync(async () => {
    const localeNameMap = await locales.reduceAsync<Record<string, string>>(async (acc, cur) => {
      const localeFile = await require("../i18n/" + cur);

      acc[cur] = (localeFile.table as Locale).locale;

      return acc;
    }, {});

    setLocaleNameMap(localeNameMap);
  }, []);

  return { t, locale, locales, localeNameMap };
};
