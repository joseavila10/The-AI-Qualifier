module.exports = {
    async doesTableExist(queryInterface, tableName) {
      const tables = await queryInterface.showAllTables();
      return tables.includes(tableName);
    },
    async doesFieldExist(queryInterface, tableName, columnName) {
      const desc = await queryInterface.describeTable(tableName);
      return Object.keys(desc).includes(columnName);
    },
};