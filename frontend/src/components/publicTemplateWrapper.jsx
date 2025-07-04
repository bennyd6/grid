import React, { useEffect, useState, Suspense } from 'react'; // Import Suspense
import { useParams } from 'react-router-dom';

// Dynamically import template components
const templateComponents = {
  '1': React.lazy(() => import('../templates/template1')),
  '2': React.lazy(() => import('../templates/template2')),
  '3': React.lazy(() => import('../templates/template3')),
  '4': React.lazy(() => import('../templates/template4')),
  '5': React.lazy(() => import('../templates/template5')),
  '6': React.lazy(() => import('../templates/template6')),
};

const PublicTemplateWrapper = () => {
  const { id, userId } = useParams(); // Get template ID and userId from URL

  // Get the lazy component directly from the map
  const SelectedTemplate = templateComponents[id];

  if (!SelectedTemplate) {
    // If the template ID is invalid or not found in the map
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        Template not found.
      </div>
    );
  }

  // Render the selected template within a Suspense boundary
  // React.Suspense will handle the loading state while the lazy component loads
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        Loading template...
      </div>
    }>
      {/* Render the lazy component directly, passing the userId prop */}
      <SelectedTemplate userId={userId} />
    </Suspense>
  );
};

export default PublicTemplateWrapper;
