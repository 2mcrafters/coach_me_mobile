```typescript
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createSession, getZoomToken } from '@/redux/slices/sessionSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert } from '@/components/ui/Alert';
import { Calendar, Clock, Users } from 'lucide-react-native';

const CreateSession = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.sessions);
  const [formData, setFormData] = useState({
    topic: '',
    start_time: '',
    duration: 60,
    guest_id: '',
  });

  useEffect(() => {
    // Get Zoom token when component mounts
    dispatch(getZoomToken());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createSession(formData)).unwrap();
      navigate('/sessions');
    } catch (error) {
      console.error('Failed to create session:', error);
    }
  };

  const minDateTime = new Date();
  minDateTime.setMinutes(minDateTime.getMinutes() + 10); // Minimum 10 minutes from now

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Programmer une Nouvelle Session</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert 
              variant="error" 
              title="Erreur" 
              description={error} 
              className="mb-4"
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="topic">Sujet de la Session</Label>
              <Input
                id="topic"
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                placeholder="Ex: Session de coaching en développement personnel"
                required
                minLength={5}
                maxLength={100}
              />
            </div>

            <div>
              <Label htmlFor="start_time">Date et Heure</Label>
              <Input
                id="start_time"
                type="datetime-local"
                value={formData.start_time}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                required
                min={minDateTime.toISOString().slice(0, 16)}
              />
            </div>

            <div>
              <Label htmlFor="duration">Durée (minutes)</Label>
              <Input
                id="duration"
                type="number"
                min="30"
                max="240"
                step="15"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                required
              />
            </div>

            <div>
              <Label htmlFor="guest_id">ID du Coaché</Label>
              <Input
                id="guest_id"
                value={formData.guest_id}
                onChange={(e) => setFormData({ ...formData, guest_id: e.target.value })}
                placeholder="ID du coaché"
                required
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/sessions')}
                disabled={loading}
              >
                Annuler
              </Button>
              <Button 
                type="submit"
                disabled={loading}
              >
                {loading ? 'Création en cours...' : 'Programmer la Session'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateSession;
```