export const parseStringFloat = (text: string) => {
  const allowed = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ".", ","]
  let newText = text.split("")
  newText = newText.filter(char => allowed.includes(char))
  let returnText = ""

  newText.forEach(char => {
    if (char !== ",") returnText += char
    else returnText += "."
  })
  return returnText
}
