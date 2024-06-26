import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spinner from '@/komponenten/Spinner';

const Kontakt = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [feedbackForm, setFeedbackForm] = useState({
    email: '',
    name: '',
    feedback: ''
  });
  const [detailFormErrors, setDetailFormErrors] = useState({});
  const [feedbackFormErrors, setFeedbackFormErrors] = useState({});
  const [isSubmittingDetails, setIsSubmittingDetails] = useState(false);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  useEffect(() => {
    axios.get('/api/feedback')
      .then(response => setFeedbacks(response.data))
      .catch(error => {
        console.error('Error fetching feedbacks:', error);
        toast.error('Failed to fetch feedbacks');
      });
  }, []);

  const validateDetailForm = (formData) => {
    const errors = {};
    if (!formData.get('name')) errors.name = 'Name is required';
    if (!formData.get('email')) errors.email = 'Email is required';
    if (!formData.get('message')) errors.message = 'Message is required';
    return errors;
  };

  const validateFeedbackForm = (form) => {
    const errors = {};
    if (!form.email) errors.email = 'Email is required';
    if (!form.name) errors.name = 'Name is required';
    if (!form.feedback) errors.feedback = 'Feedback is required';
    return errors;
  };

  const handleDetailSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const errors = validateDetailForm(formData);
    setDetailFormErrors(errors);
    if (Object.keys(errors).length === 0) {
      setIsSubmittingDetails(true);
      try {
        await axios.post('/api/sendEmail', {
          name: formData.get('name'),
          email: formData.get('email'),
          message: formData.get('message')
        });
        toast.success('Details sent successfully!');
      } catch (error) {
        console.error('Error sending details:', error);
        toast.error('Failed to send details');
      } finally {
        setIsSubmittingDetails(false);
      }
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    const errors = validateFeedbackForm(feedbackForm);
    setFeedbackFormErrors(errors);
    if (Object.keys(errors).length === 0) {
      setIsSubmittingFeedback(true);
      try {
        await axios.post('/api/feedback', feedbackForm);
        setFeedbackForm({ email: '', name: '', feedback: '' });
        toast.success('Feedback submitted successfully!');
        const response = await axios.get('/api/feedback');
        setFeedbacks(response.data);
      } catch (error) {
        console.error('Error submitting feedback:', error);
        toast.error('Failed to submit feedback');
      } finally {
        setIsSubmittingFeedback(false);
      }
    }
  };

  const handleFeedbackChange = (e) => {
    const { name, value } = e.target;
    setFeedbackForm(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <ToastContainer />
      <h2 style={{ textAlign: 'center', color: '#333' }}>Contact Us</h2>
      <form onSubmit={handleDetailSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          style={{ padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        {detailFormErrors.name && <p style={{ color: 'red', marginTop: '-10px' }}>{detailFormErrors.name}</p>}
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          style={{ padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        {detailFormErrors.email && <p style={{ color: 'red', marginTop: '-10px' }}>{detailFormErrors.email}</p>}
        <textarea
          name="message"
          placeholder="Your Message"
          style={{ padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
        ></textarea>
        {detailFormErrors.message && <p style={{ color: 'red', marginTop: '-10px' }}>{detailFormErrors.message}</p>}
        <button type="submit" style={{ display: "flex", justifyContent: "center", alignItems:"center", padding: '10px', fontSize: '16px', borderRadius: '4px', border: 'none', backgroundColor: '#007BFF', color: 'white', cursor: 'pointer' }}>
          {isSubmittingDetails ? <Spinner /> : 'Submit'}
        </button>
      </form>

      <h2 style={{ textAlign: 'center', color: '#333' }}>Submit Feedback</h2>
      <form onSubmit={handleFeedbackSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
        <input
          type="email"
          name="email"
          value={feedbackForm.email}
          onChange={handleFeedbackChange}
          placeholder="Your Email"
          style={{ padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
          required
        />
        {feedbackFormErrors.email && <p style={{ color: 'red', marginTop: '-10px' }}>{feedbackFormErrors.email}</p>}
        <input
          type="text"
          name="name"
          value={feedbackForm.name}
          onChange={handleFeedbackChange}
          placeholder="Your Name"
          style={{ padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
          required
        />
        {feedbackFormErrors.name && <p style={{ color: 'red', marginTop: '-10px' }}>{feedbackFormErrors.name}</p>}
        <textarea
          name="feedback"
          value={feedbackForm.feedback}
          onChange={handleFeedbackChange}
          placeholder="Your Feedback"
          style={{ padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
          required
        ></textarea>
        {feedbackFormErrors.feedback && <p style={{ color: 'red', marginTop: '-10px' }}>{feedbackFormErrors.feedback}</p>}
        <button type="submit" style={{ display: "flex", justifyContent: "center", alignItems:"center", padding: '10px', fontSize: '16px', borderRadius: '4px', border: 'none', backgroundColor: '#007BFF', color: 'white', cursor: 'pointer' }}>
          {isSubmittingFeedback ? <Spinner /> : 'Submit'}
        </button>
      </form>

      <h2 style={{ textAlign: 'center' }}>Feedbacks</h2>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {feedbacks.map(feedback => (
          <li key={feedback._id} style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
            <p><strong>{feedback.name}:</strong> {feedback.feedback}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Kontakt;
