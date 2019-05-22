function download(res, fileName) {
  return new Promise((resolve, reject) => {
    res.download(fileName, error => {
      if (error) {
        reject(error)
      }

      resolve()
    })
  })
}

module.exports = {
  download
}
