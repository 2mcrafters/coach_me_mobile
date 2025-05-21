import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchSessions, joinSession } from '@/redux/slices/sessionSlice';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, Video } from 'lucide-react-native';
import { Alert } from '@/components/ui/Alert';

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
      // Open Zoom meeting in a new window using the join URL
      if (result.join_url) {
        window.open(result.join_url, '_blank');
      }
    } catch (error) {
      console.error('Failed to join session:', error);
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
                  <TableCell>{session.host?.user?.name}</TableCell>
                  <TableCell>{session.guest?.user?.name}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      session.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                      session.status === 'started' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {session.status === 'scheduled' ? 'Programmée' :
                       session.status === 'started' ? 'En cours' :
                       'Terminée'}
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