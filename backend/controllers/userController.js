// controllers/userController.js

let users = [
{ id: 1, name: "Hien", role: "Frontend" },
{ id: 2, name: "An", role: "Backend" },
{ id: 3, name: "Phat", role: "Database" }
];

// GET /api/users
exports.getUsers = (req, res) => {
res.json(users);
};

// POST /api/users
exports.createUser = (req, res) => {
const newUser = {
    id: users.length + 1,
    name: req.body.name,
    role: req.body.role
};
users.push(newUser);
res.status(201).json(newUser);
};
