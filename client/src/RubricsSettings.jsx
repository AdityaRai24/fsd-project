import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Plus, Trash2, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const RubricsSettings = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const [criteria, setCriteria] = useState([
    {
      title: "Knowledge",
      description: "(Factual/Conceptual/Procedural/Metacognitive)",
      marks: 5
    },
    {
      title: "Describe",
      description: "(Factual/Conceptual/Procedural/Metacognitive)",
      marks: 5
    },
    {
      title: "Demonstration",
      description: "(Factual/Conceptual/Procedural/Metacognitive)",
      marks: 5
    },
    {
      title: "Strategy (Analyse & / or Evaluate)",
      description: "(Factual/Conceptual/Procedural/Metacognitive)",
      marks: 5
    },
    {
      title: "Attitude towards learning",
      description: "(receiving, attending, responding, valuing, organizing, characterization by value)",
      marks: 5
    }
  ]);

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleCriteriaChange = (index, field, value) => {
    const newCriteria = [...criteria];
    newCriteria[index] = { ...newCriteria[index], [field]: value };
    setCriteria(newCriteria);
  };

  const addCriteria = () => {
    if (criteria.length < 10) {
      setCriteria([...criteria, { title: '', description: '', marks: 5 }]);
    }
  };

  const removeCriteria = (index) => {
    if (criteria.length > 1) {
      const newCriteria = criteria.filter((_, i) => i !== index);
      setCriteria(newCriteria);
    }
  };

  useEffect(() => {
    const fetchRubrics = async () => {
      try {
        if (!subjectId) {
          setError('No subject selected');
          return;
        }

        const response = await axios.get(
          `http://localhost:8000/api/rubrics/${subjectId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        
        if (response.data && response.data.criteria) {
          setCriteria(response.data.criteria);
        }
      } catch (error) {
        console.error('Failed to fetch rubrics:', error);
        setError('Failed to fetch rubrics settings');
      }
    };

    fetchRubrics();
  }, [subjectId]);

  const handleSave = async () => {
    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      if (!subjectId) {
        throw new Error('No subject selected');
      }

      const orderedCriteria = criteria.map((criterion, index) => ({
        ...criterion,
        order: index + 1
      }));

      const response = await axios.post(
        'http://localhost:8000/api/rubrics',
        {
          subject: subjectId,
          criteria: orderedCriteria
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      setSuccess('Rubrics criteria updated successfully!');
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update rubrics criteria';
      setError(errorMessage);
      console.error('Error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (!subjectId) {
      navigate('/teacher-dashboard');
    }
  }, [subjectId, navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => window.history.back()}
                className="text-gray-600 hover:text-gray-900 flex items-center"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back
              </button>
              <h1 className="ml-4 text-xl font-medium text-gray-900">
                Rubrics Assessment Settings
              </h1>
            </div>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center text-green-700">
            <AlertCircle className="h-5 w-5 mr-2" />
            {success}
          </div>
        )}

        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-2">Assessment Criteria</h2>
              <p className="text-sm text-gray-500">
                Customize the assessment criteria for student evaluations. Each criterion can have a title, description, and maximum marks.
              </p>
            </div>

            <div className="space-y-6">
              {criteria.map((criterion, index) => (
                <div key={index} className="p-4 border rounded-lg bg-gray-50">
                  <div className="flex items-start justify-between mb-4">
                    <span className="bg-gray-200 text-gray-700 text-sm font-medium px-2 py-1 rounded">
                      Criterion {index + 1}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCriteria(index)}
                      disabled={criteria.length === 1}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid gap-4">
                    <div>
                      <Label htmlFor={`title-${index}`}>Title</Label>
                      <Input
                        id={`title-${index}`}
                        value={criterion.title}
                        onChange={(e) => handleCriteriaChange(index, 'title', e.target.value)}
                        placeholder="Enter criterion title"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor={`description-${index}`}>Description</Label>
                      <Textarea
                        id={`description-${index}`}
                        value={criterion.description}
                        onChange={(e) => handleCriteriaChange(index, 'description', e.target.value)}
                        placeholder="Enter criterion description"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor={`marks-${index}`}>Maximum Marks</Label>
                      <Input
                        id={`marks-${index}`}
                        type="number"
                        value={criterion.marks}
                        onChange={(e) => handleCriteriaChange(index, 'marks', parseInt(e.target.value))}
                        min="1"
                        max="10"
                        className="mt-1 w-24"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <Button
                onClick={addCriteria}
                disabled={criteria.length >= 10}
                variant="outline"
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Criterion
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RubricsSettings; 