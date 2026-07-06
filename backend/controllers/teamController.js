import Team from '../models/teamModel.js';
import User from '../models/userModel.js';

// ✅ Create Team
export async function createTeam(req, res) {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ success: false, message: "Team name is required" });
  }

  try {
    const exists = await Team.findOne({ name });
    if (exists) {
      return res.status(400).json({ success: false, message: "Team name already exists" });
    }

    const team = await Team.create({
      name,
      description,
      owner: req.user.id,
      members: [req.user.id] // Owner is also a member
    });

    // Update user's teamId and set role to Team Manager if they were a Member
    const roleUpdate = req.user.role === 'Member' ? 'Team Manager' : req.user.role;
    
    await User.findByIdAndUpdate(req.user.id, { 
      teamId: team._id,
      role: roleUpdate
    });

    res.status(201).json({ success: true, team });

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

// ✅ Get My Team
export async function getMyTeam(req, res) {
  try {
    const user = await User.findById(req.user.id);
    if (!user.teamId) {
      return res.status(404).json({ success: false, message: "User is not in a team" });
    }

    const team = await Team.findById(user.teamId).populate('members', '-password');
    res.json({ success: true, team });

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

// ✅ Add Member to Team (Admin or Team Manager)
export async function addMember(req, res) {
  const { email } = req.body;

  try {
    const team = await Team.findById(req.params.teamId);
    if (!team) return res.status(404).json({ success: false, message: "Team not found" });

    // Check if requester is owner or Admin
    if (team.owner.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    const userToAdd = await User.findOne({ email });
    if (!userToAdd) return res.status(404).json({ success: false, message: "User not found" });

    if (team.members.includes(userToAdd._id)) {
      return res.status(400).json({ success: false, message: "User is already in the team" });
    }

    team.members.push(userToAdd._id);
    await team.save();

    userToAdd.teamId = team._id;
    await userToAdd.save();

    res.json({ success: true, team });

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

// ✅ Remove Member from Team
export async function removeMember(req, res) {
  const { memberId } = req.body;

  try {
    const team = await Team.findById(req.params.teamId);
    if (!team) return res.status(404).json({ success: false, message: "Team not found" });

    if (team.owner.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    if (team.owner.toString() === memberId) {
      return res.status(400).json({ success: false, message: "Cannot remove team owner" });
    }

    team.members = team.members.filter(id => id.toString() !== memberId);
    await team.save();

    await User.findByIdAndUpdate(memberId, { $unset: { teamId: 1 } });

    res.json({ success: true, team });

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}
