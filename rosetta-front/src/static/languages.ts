const languages = [
    { value: "ENGLISH", label: "Inglês" },
    { value: "SPANISH", label: "Espanhol" },
    { value: "PORTUGUESE", label: "Português" },
    { value: "ITALIAN", label: "Italiano" },
    { value: "GERMAN", label: "Alemão" },
    { value: "CHINESE", label: "Chinês" },
    { value: "JAPANESE", label: "Japonês" },
    { value: "KOREAN", label: "Coreano" },
    { value: "RUSSIA", label: "Russo" },
    { value: "NEATHERLANDS", label: "Holandes" },
    { value: "SLOVENIAN", label: "Esloveno" },
]

export const findLanguage = (value) => languages.filter( language => language.value === value ).at(0) ?? null
export const getLanguageLabel = (value) => findLanguage(value)?.label

export default languages