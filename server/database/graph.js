module.exports = (sequelize, DataTypes) => {
  const Graph = sequelize.define(
    'Graph',
    {
      userId: DataTypes.INTEGER,
      title: DataTypes.STRING,
      data: DataTypes.TEXT,
      nodeCount: DataTypes.INTEGER,
      edgeCount: DataTypes.INTEGER
    },
    {}
  )

  Graph.associate = function(models) {}

  return Graph
}
