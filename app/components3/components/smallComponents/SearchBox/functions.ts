export const getSuggestions = (searchText, array, extractFilterItem, filterMethods) => {
  return filterByWords(searchText, array, extractFilterItem)
}

export const filterByWords = (text: string, array, extractFilterItem) => {
  let words = text.split(" ")
  let newArray = [...array]
  words.forEach(word => {
    newArray = newArray.filter(item =>
      extractFilterItem(item)
        .toUpperCase()
        .includes(word.toUpperCase()),
    )
  })
  return newArray
}
