```typescript
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchSessions, joinSession } from '@/redux/slices/sessionSlice';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert } from '@/components/ui/Alert';
import { Calendar, Clock, Video, Users } from 'lucide-react-native';

const SessionsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { sessions, loading, error } = useSelector((state) => state.sessions);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchSessions());
  }, [dispatch]);

  const handleCreateSession = () => {
    navigate('/sessions/create');
  };

  const handleJoinSession = async (sessionId) => {
    try {
      const result = await dispatch(joinSession(sessionId)).unwrap();
      if (result.join_url) {
        window.open(result.join_url, '_blank');
      }
    } catch (error) {
      console.error('Failed to join session:', error);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'started':
        return 'bg-green-100 text-green-800';
      case 'finished':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'scheduled':
        return 'Programmée';
      case 'started':
        return 'En cours';
      case 'finished':
        return 'Terminée';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Sessions de Coaching</h1>
        {user?.role === 'coach' && (
          <Button onClick={handleCreateSession}>
            <Video className="mr-2 h-4 w-4" />
            Nouvelle Session
          </Button>
        )}
      </div>

      {error && (
        <Alert 
          variant="error" 
          title="Erreur" 
          description={error} 
          className="mb-4"
        />
      )}

      <Card>
        <CardHeader>
          <CardTitle>Sessions Programmées</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Heure</TableHead>
                <TableHead>Sujet</TableHead>
                <TableHead>Coach</TableHead>
                <TableHead>Coaché</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4" />
                      {new Date(session.start_time).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4" />
                      {new Date(session.start_time).toLocaleTimeString()}
                    </div>
                  </TableCell>
                  <TableCell>{session.topic}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Users className="mr-2 h-4 w-4" />
                      {session.host?.user?.name}
                    </div>
                  </TableCell>
                  <TableCell>{session.guest?.user?.name}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-sm ${getStatusBadgeClass(session.status)}`}>
                      {getStatusText(session.status)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleJoinSession(session.id)}
                      disabled={session.status === 'finished'}
                      variant={session.status === 'started' ? 'primary' : 'secondary'}
                    >
                      <Video className="mr-2 h-4 w-4" />
                      {session.status === 'started' ? 'Rejoindre' : 'Démarrer'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {sessions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Aucune session programmée
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default SessionsPage;
```