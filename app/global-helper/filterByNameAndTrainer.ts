//helper function to search through clients. You can filter by client name/number, by trainer or by both. Returns array of clients

export const filterByStringAndTrainer = (clients, searchString = "", trainerIDString = "") => {
  if (trainerIDString !== "") {
    //filter by trainer
    const filter1 = []
    const filter1IDStrings = []
    clients.forEach(client => {
      client.Trainers.forEach(trainer => {
        if (trainer.ID === trainerIDString) {
          let addNewClient = true
          filter1IDStrings.forEach(IDstring => {
            if (IDstring === client.ID) addNewClient = false
          })
          if (addNewClient) {
            filter1.push(client)
            filter1IDStrings.push(client.ID)
          }
        }
      })
    })
    //filter by search text
    const filter2 = filter1.filter(client => {
      const clientString = client.ClientNumber
        ? client.Name.toUpperCase() + client.ClientNumber.toString()
        : client.Name.toUpperCase()
      return clientString.includes(searchString.toUpperCase())
    })
    console.log("filtered ", clients.length, " clients to ", filter2.length)
    return filter2
  } else {
    //filter by search text only
    const filter = clients.filter(client => {
      const clientString = client.ClientNumber
        ? client.Name.toUpperCase() + client.ClientNumber.toString()
        : client.Name.toUpperCase()
      return clientString.includes(searchString.toUpperCase())
    })
    console.log("filtered ", clients.length, " clients to ", filter.length)
    return filter
  }
}
