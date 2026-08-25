import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import en from "../messages/en.json";
import ml from "../messages/ml.json";
import hi from "../messages/hi.json";
import bn from "../messages/bn.json";
import or from "../messages/or.json";

const messagesMap: Record<string, any> = {
  en,
  ml,
  hi,
  bn,
  or,
};

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: messagesMap[locale] || messagesMap.en,
  };
});
