import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, UserType } from "@/types";
import { userApi } from "@/services/api";
import UserAccessManagement from "@/components/UserAccessManagement";
import UserTypeGuard from "@/components/UserTypeGuard";
import { AlertCircle, CheckCircle, Search, UserPlus, Users } from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // Get the current user from storage
    const userJson = localStorage.getItem('stressSenseUser') || sessionStorage.getItem('stressSenseUser');
    if (userJson) {
      setCurrentUser(JSON.parse(userJson));
    }
    
    fetchUsers();
  }, []);
  
  useEffect(() => {
    if (searchTerm) {
      setFilteredUsers(
        users.filter(user => 
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (user.department && user.department.toLowerCase().includes(searchTerm.toLowerCase()))
        )
      );
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await userApi.getUsers();
      // Ensure the response data matches our User type
      const typedUsers = response.data.map((user: any) => ({
        ...user,
        type: user.type as UserType,
      }));
      
      setUsers(typedUsers);
      setFilteredUsers(typedUsers);
      
      // If we have users and none is selected, select the first one
      if (typedUsers.length && !selectedUser) {
        setSelectedUser(typedUsers[0]);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUserData = () => {
    fetchUsers();
  };

  const countNewUsers = () => {
    return users.filter(user => user.isNew).length;
  };

  const countPendingApprovals = () => {
    return users.filter(user => user.type === 'it_professional' && !user.hasAccess).length;
  };

  return (
    <UserTypeGuard user={currentUser} allowedTypes={['admin']}>
      <div className="container mx-auto py-6 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Manage users and their access to StressSense features
            </p>
          </div>
          <Button 
            onClick={() => navigate('/register')} 
            className="mt-4 md:mt-0"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Add New User
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Users</CardTitle>
                <Badge variant="outline">{users.length}</Badge>
              </div>
              <CardDescription>Manage system users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              {isLoading ? (
                <div className="flex items-center justify-center p-4">
                  <AlertCircle className="h-4 w-4 mr-2 animate-pulse" />
                  <span>Loading users...</span>
                </div>
              ) : (
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                  {filteredUsers.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground">
                      No users found
                    </div>
                  ) : (
                    filteredUsers.map(user => (
                      <div 
                        key={user.id} 
                        className={`p-2 rounded-md cursor-pointer hover:bg-accent flex justify-between items-center ${
                          selectedUser?.id === user.id ? 'bg-accent' : ''
                        }`}
                        onClick={() => setSelectedUser(user)}
                      >
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                        <div>
                          {user.isNew && (
                            <Badge className="ml-2">New</Badge>
                          )}
                          {user.type === 'it_professional' && !user.hasAccess && (
                            <Badge variant="destructive" className="ml-2">Pending</Badge>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="md:col-span-3">
            {selectedUser ? (
              <Tabs defaultValue="details">
                <TabsList className="mb-4">
                  <TabsTrigger value="details">User Details</TabsTrigger>
                  <TabsTrigger value="access">Access Management</TabsTrigger>
                  <TabsTrigger value="activity">Activity Log</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details">
                  <Card>
                    <CardHeader>
                      <CardTitle>User Details</CardTitle>
                      <CardDescription>
                        View and update information for {selectedUser.name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Full Name</Label>
                          <Input id="name" value={selectedUser.name} readOnly />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" value={selectedUser.email} readOnly />
                        </div>
                        <div>
                          <Label htmlFor="type">User Type</Label>
                          <Input id="type" value={selectedUser.type === 'admin' ? 'Admin (HR)' : 'IT Professional'} readOnly />
                        </div>
                        {selectedUser.department && (
                          <div>
                            <Label htmlFor="department">Department</Label>
                            <Input id="department" value={selectedUser.department} readOnly />
                          </div>
                        )}
                        {selectedUser.position && (
                          <div>
                            <Label htmlFor="position">Position</Label>
                            <Input id="position" value={selectedUser.position} readOnly />
                          </div>
                        )}
                        <div>
                          <Label htmlFor="status">Status</Label>
                          <div className="flex items-center mt-2">
                            {selectedUser.type === 'it_professional' ? (
                              selectedUser.hasAccess ? (
                                <>
                                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                  <span className="text-green-500">Approved Access</span>
                                </>
                              ) : (
                                <>
                                  <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                                  <span className="text-red-500">Pending Approval</span>
                                </>
                              )
                            ) : (
                              <>
                                <CheckCircle className="h-4 w-4 text-blue-500 mr-2" />
                                <span className="text-blue-500">Admin User</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="access">
                  <UserAccessManagement 
                    user={selectedUser} 
                    onAccessUpdated={refreshUserData} 
                  />
                </TabsContent>
                
                <TabsContent value="activity">
                  <Card>
                    <CardHeader>
                      <CardTitle>Activity Log</CardTitle>
                      <CardDescription>
                        Recent activity for this user
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-4 text-muted-foreground">
                        Activity log will be implemented in a future update
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No User Selected</h3>
                  <p className="text-muted-foreground mt-2">
                    Select a user from the list to view their details and manage access
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </UserTypeGuard>
  );
};

export default AdminDashboard;
