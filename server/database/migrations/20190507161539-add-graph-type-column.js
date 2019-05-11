module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Graphs', 'type', {
      type: Sequelize.STRING
    })
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Graphs', 'type', {
      type: Sequelize.STRING
    })
  }
}
