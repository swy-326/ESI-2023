const abilities = [
    { value: "VIDEO_EDITOR", label: "Edição de Vídeo"},
    { value: "IMAGE_EDITOR", label: "Edição de Imagens"},
    { value: "GRAMATIC", label: "Noções de Gramática"},
    { value: "TEXT_EDITOR", label: "Edição de Texto"},
    { value: "SLIDES_EDITOR", label: "Edição de Slides"},
    { value: "SHEETS_EDITOR", label: "Edição de Planilhas"},
]

export const findAbility = (value) => abilities.filter( ability => ability.value === value).at(0)
export const getTagValue = (value) => findAbility(value)?.label 

export default abilities