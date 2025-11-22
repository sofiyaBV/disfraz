// Транслітерація українських символів в латиницю для URL
const UA_TO_LAT = {
  а: "a",
  б: "b",
  в: "v",
  г: "h",
  ґ: "g",
  д: "d",
  е: "e",
  є: "ye",
  ж: "zh",
  з: "z",
  и: "y",
  і: "i",
  ї: "yi",
  й: "y",
  к: "k",
  л: "l",
  м: "m",
  н: "n",
  о: "o",
  п: "p",
  р: "r",
  с: "s",
  т: "t",
  у: "u",
  ф: "f",
  х: "kh",
  ц: "ts",
  ч: "ch",
  ш: "sh",
  щ: "shch",
  ь: "",
  ю: "yu",
  я: "ya",
};

export const transliterate = (text) => {
  return text
    .toLowerCase()
    .replace(/[а-яіїєґ]/g, (char) => UA_TO_LAT[char] || char)
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
};
