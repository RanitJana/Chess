import i18nIsoCountries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
// Register the English locale for country names
i18nIsoCountries.registerLocale(enLocale);

export default function getCountryNameFlag(country = "") {
  if (country == "")
    return {
      name: "International",
      link: `https://upload.wikimedia.org/wikipedia/commons/2/2f/Flag_of_the_United_Nations.svg`,
    };
  return {
    name: i18nIsoCountries.getName(country, "en") || country,
    link: `http://purecatamphetamine.github.io/country-flag-icons/3x2/${country}.svg`,
  };
}
