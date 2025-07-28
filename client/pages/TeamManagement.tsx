import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth, User } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { Plus, UserPlus, Shield, Edit2, Trash2, Mail, Calendar, Clock, Crown, Users, Key } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

export default function TeamManagement() {
  const { currentUser, teamMembers, inviteTeamMember, updateUserRole, removeTeamMember, updateProfile } = useAuth();
  const { toast } = useToast();
  const { addNotification } = useNotifications();
  
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<User['role']>('editor');
  const [isInviting, setIsInviting] = useState(false);
  
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', email: '' });

  const handleInviteMember = async () => {
    if (!inviteEmail) {
      toast({
        title: "Missing Email",
        description: "Please enter an email address to invite.",
        variant: "destructive"
      });
      return;
    }

    setIsInviting(true);
    try {
      // Generate invitation email content
      const inviteToken = btoa(inviteEmail + '-' + Date.now() + '-' + inviteRole);
      const inviteLink = `https://baatometrics.com/join?token=${inviteToken}`;

      console.log('📧 Sending invitation email...');
      console.log(`To: ${inviteEmail}`);
      console.log(`Role: ${inviteRole}`);
      console.log(`Invite Link: ${inviteLink}`);

      const success = await inviteTeamMember(inviteEmail, inviteRole);
      if (success) {
        toast({
          title: "Invitation Sent! 📧",
          description: `Email invitation sent to ${inviteEmail} as ${inviteRole}.`
        });

        addNotification({
          type: 'success',
          title: 'Team Member Invited',
          message: `${inviteEmail} invited as ${inviteRole.toUpperCase()}. They will receive an email with join instructions.`,
          actionType: 'team_update'
        });

        setInviteEmail('');
        setInviteRole('editor');
        setIsInviteOpen(false);
      } else {
        toast({
          title: "Invitation Failed",
          description: "Unable to send invitation. Please try again.",
          variant: "destructive"
        });
      }
    } finally {
      setIsInviting(false);
    }
  };

  const handleRoleChange = (userId: string, newRole: User['role']) => {
    updateUserRole(userId, newRole);
    toast({
      title: "Role Updated",
      description: `User role has been changed to ${newRole}.`
    });
  };

  const handleRemoveMember = (userId: string, userName: string) => {
    removeTeamMember(userId);
    toast({
      title: "Member Removed",
      description: `${userName} has been removed from the team.`
    });
  };

  const handleEditProfile = (userId: string) => {
    const user = teamMembers.find(m => m.id === userId) || currentUser;
    if (user) {
      setEditForm({ name: user.name, email: user.email });
      setEditingUser(userId);
    }
  };

  const handleSaveProfile = () => {
    if (editingUser && editForm.name && editForm.email) {
      updateProfile(editingUser, {
        name: editForm.name,
        email: editForm.email
      });
      setEditingUser(null);
      toast({
        title: "Profile Updated",
        description: "User profile has been updated successfully."
      });
    }
  };

  const getRoleColor = (role: User['role']) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 border-red-200';
      case 'editor': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'viewer': return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleIcon = (role: User['role']) => {
    switch (role) {
      case 'admin': return <Crown className="h-3 w-3" />;
      case 'editor': return <Edit2 className="h-3 w-3" />;
      case 'viewer': return <Shield className="h-3 w-3" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const allMembers = currentUser ? [currentUser, ...teamMembers] : teamMembers;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Team Management</h1>
          <p className="text-muted-foreground">Manage your team members, roles, and permissions</p>
        </div>
        {currentUser?.permissions.canInvite && (
          <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Invite Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite Team Member</DialogTitle>
                <DialogDescription>
                  Send an invitation to join your BaatoMetrics team.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="invite-email">Email Address</Label>
                  <Input
                    id="invite-email"
                    type="email"
                    placeholder="colleague@company.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invite-role">Role</Label>
                  <Select value={inviteRole} onValueChange={(value: User['role']) => setInviteRole(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="viewer">Viewer - Can view data only</SelectItem>
                      <SelectItem value="editor">Editor - Can edit and create data</SelectItem>
                      <SelectItem value="admin">Admin - Full access</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsInviteOpen(false)}>Cancel</Button>
                <Button onClick={handleInviteMember} disabled={isInviting}>
                  {isInviting ? "Sending..." : "Send Invitation"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Team Statistics */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{allMembers.length}</p>
                <p className="text-sm text-muted-foreground">Total Members</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Crown className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{allMembers.filter(m => m.role === 'admin').length}</p>
                <p className="text-sm text-muted-foreground">Administrators</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Edit2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{allMembers.filter(m => m.role === 'editor').length}</p>
                <p className="text-sm text-muted-foreground">Editors</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Shield className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{teamMembers.filter(m => 'status' in m && m.status === 'pending').length}</p>
                <p className="text-sm text-muted-foreground">Pending Invites</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Members List */}
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>Manage roles, permissions, and member profiles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {allMembers.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    {member.avatar ? (
                      <img src={member.avatar} alt={member.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <span className="text-white font-semibold text-sm">
                        {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{member.name}</h4>
                      {member.id === currentUser?.id && (
                        <Badge variant="outline" className="text-xs">You</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Mail className="h-3 w-3" />
                      {member.email}
                    </p>
                    <div className="flex items-center gap-4 mt-1">
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Joined {format(member.joinedAt, 'MMM dd, yyyy')}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Active {formatDistanceToNow(member.lastActive, { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={getRoleColor(member.role)}>
                      {getRoleIcon(member.role)}
                      {member.role}
                    </Badge>
                    {'status' in member && (
                      <Badge variant="outline" className={getStatusColor(member.status)}>
                        {member.status}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex gap-1">
                    {(currentUser?.permissions.canManageUsers || member.id === currentUser?.id) && (
                      <Dialog open={editingUser === member.id} onOpenChange={(open) => !open && setEditingUser(null)}>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditProfile(member.id)}
                          >
                            <Edit2 className="h-3 w-3" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Profile</DialogTitle>
                            <DialogDescription>Update member information</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="edit-name">Name</Label>
                              <Input
                                id="edit-name"
                                value={editForm.name}
                                onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit-email">Email</Label>
                              <Input
                                id="edit-email"
                                type="email"
                                value={editForm.email}
                                onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setEditingUser(null)}>Cancel</Button>
                            <Button onClick={handleSaveProfile}>Save Changes</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}
                    
                    {currentUser?.permissions.canManageUsers && member.id !== currentUser?.id && (
                      <>
                        <Select
                          value={member.role}
                          onValueChange={(value: User['role']) => handleRoleChange(member.id, value)}
                        >
                          <SelectTrigger className="w-24 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="viewer">Viewer</SelectItem>
                            <SelectItem value="editor">Editor</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remove Team Member</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to remove {member.name} from the team? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleRemoveMember(member.id, member.name)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Remove Member
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
