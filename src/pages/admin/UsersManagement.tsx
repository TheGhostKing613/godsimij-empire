import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, ShieldOff } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface User {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
}

interface UserRole {
  user_id: string;
  role: string;
}

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleAction, setRoleAction] = useState<{ userId: string; action: 'grant' | 'revoke' } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [profilesRes, rolesRes] = await Promise.all([
        supabase.from('profiles').select('*').order('created_at', { ascending: false }),
        supabase.from('user_roles').select('user_id, role'),
      ]);

      if (profilesRes.error) throw profilesRes.error;
      if (rolesRes.error) throw rolesRes.error;

      setUsers(profilesRes.data || []);
      setUserRoles(rolesRes.data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error loading users",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = (userId: string) => {
    return userRoles.some(r => r.user_id === userId && r.role === 'admin');
  };

  const handleRoleAction = async () => {
    if (!roleAction) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (roleAction.action === 'grant') {
        const { error } = await supabase
          .from('user_roles')
          .insert([{ user_id: roleAction.userId, role: 'admin', assigned_by: user?.id }]);

        if (error) throw error;

        toast({
          title: "Admin role granted",
          description: "The user now has admin privileges.",
        });
      } else {
        const { error } = await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', roleAction.userId)
          .eq('role', 'admin');

        if (error) throw error;

        toast({
          title: "Admin role revoked",
          description: "The user no longer has admin privileges.",
        });
      }

      loadData();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating role",
        description: error.message,
      });
    } finally {
      setRoleAction(null);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-glow-ember mb-2">Users Management</h1>
        <p className="text-muted-foreground">Manage user roles and permissions</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading users...</div>
      ) : users.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No users yet.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {users.map((user) => {
            const userIsAdmin = isAdmin(user.id);
            return (
              <Card key={user.id}>
                <CardHeader className="flex flex-row items-start justify-between space-y-0">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">
                      {user.full_name || user.email}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mb-2">{user.email}</p>
                    <div className="flex gap-2 items-center">
                      <Badge variant={userIsAdmin ? 'default' : 'secondary'}>
                        {userIsAdmin ? 'Admin' : 'User'}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Joined {new Date(user.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setRoleAction({
                        userId: user.id,
                        action: userIsAdmin ? 'revoke' : 'grant',
                      })
                    }
                  >
                    {userIsAdmin ? (
                      <>
                        <ShieldOff className="w-4 h-4 mr-2" />
                        Revoke Admin
                      </>
                    ) : (
                      <>
                        <Shield className="w-4 h-4 mr-2" />
                        Grant Admin
                      </>
                    )}
                  </Button>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      )}

      <AlertDialog open={!!roleAction} onOpenChange={() => setRoleAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {roleAction?.action === 'grant' ? 'Grant Admin Role?' : 'Revoke Admin Role?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {roleAction?.action === 'grant'
                ? 'This user will be able to manage all content and users.'
                : 'This user will lose admin privileges and access to the admin panel.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRoleAction}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
