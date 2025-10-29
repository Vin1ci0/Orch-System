const User = require('./User');
const Project = require('./Project');
const Task = require('./Task');
const { Team, TeamMember } = require('./Team');
const Event = require('./Event');
const { Board, Card } = require('./Kanban');
const File = require('./File');
const { Budget, Transaction } = require('./Budget');

// User <-> Project (through ProjectMember)
User.belongsToMany(Project, { through: 'ProjectMember' });
Project.belongsToMany(User, { through: 'ProjectMember' });

// User <-> Team
User.belongsToMany(Team, { through: TeamMember });
Team.belongsToMany(User, { through: TeamMember });

// Project -> Tasks
Project.hasMany(Task);
Task.belongsTo(Project);

// Task -> Assignee (User)
Task.belongsTo(User, { as: 'assignee' });
User.hasMany(Task, { foreignKey: 'assigneeId' });

// Project -> Events
Project.hasMany(Event);
Event.belongsTo(Project);

// Project -> Board
Project.hasOne(Board);
Board.belongsTo(Project);

// Board -> Cards
Board.hasMany(Card);
Card.belongsTo(Board);

// Project -> Budget
Project.hasOne(Budget);
Budget.belongsTo(Project);

// Budget -> Transactions
Budget.hasMany(Transaction);
Transaction.belongsTo(Budget);

// Project -> Files
Project.hasMany(File);
File.belongsTo(Project);

module.exports = {
  User,
  Project,
  Task,
  Team,
  TeamMember,
  Event,
  Board,
  Card,
  File,
  Budget,
  Transaction
};