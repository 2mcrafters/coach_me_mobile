import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, Video } from 'lucide-react-native';

const SessionsPage = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    // TODO: Fetch sessions from API
    // This will be implemented once we create the sessions slice
    setLoading(false);
  }, []);

  const handleCreateSession = () => {
    navigate('/sessions/create');
  };

  const handleJoinSession = (sessionId) => {
    navigate(`/sessions/${sessionId}/join`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Sessions de Coaching</h1>
        <Button onClick={handleCreateSession}>
          <Video className="mr-2 h-4 w-4" />
          Nouvelle Session
        </Button>
      </div>

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
                  <TableCell>{session.host?.name}</TableCell>
                  <TableCell>{session.guest?.name}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      session.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                      session.status === 'started' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {session.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleJoinSession(session.id)}
                      disabled={session.status === 'finished'}
                    >
                      <Video className="mr-2 h-4 w-4" />
                      Rejoindre
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default SessionsPage;