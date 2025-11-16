import { useState } from 'react';

interface ContactFormState {
  isSubmitting: boolean;
  isSuccess: boolean;
  message: string;
  isSubmitSuccessful: boolean;
}

export function useContactForm() {
  const [state, setState] = useState<ContactFormState>({
    isSubmitting: false,
    isSuccess: false,
    message: '',
    isSubmitSuccessful: false,
  });

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    // Store form reference before async operation
    const form = event.currentTarget;
    
    setState(prev => ({ ...prev, isSubmitting: true }));

    try {
      const formData = new FormData(form);
      formData.append("access_key", import.meta.env.VITE_WEB3FORMS_ACCESS_KEY);

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setState({
          isSubmitting: false,
          isSuccess: true,
          message: "Thank you! Your message has been sent successfully.",
          isSubmitSuccessful: true,
        });
        form.reset();
      } else {
        setState({
          isSubmitting: false,
          isSuccess: false,
          message: data.message || "Something went wrong. Please try again.",
          isSubmitSuccessful: true,
        });
      }
    } catch (error) {
      setState({
        isSubmitting: false,
        isSuccess: false,
        message: "Network error. Please check your connection and try again.",
        isSubmitSuccessful: true,
      });
      console.error("Form submission error:", error);
    }
  };

  const reset = () => {
    setState({
      isSubmitting: false,
      isSuccess: false,
      message: '',
      isSubmitSuccessful: false,
    });
  };

  return {
    ...state,
    onSubmit,
    reset,
  };
}