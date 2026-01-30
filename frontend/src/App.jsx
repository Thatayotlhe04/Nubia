import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Topic from './pages/Topic';
import Calculators from './pages/Calculators';
import Examples from './pages/Examples';
import Uploads from './pages/Uploads';
import Resources from './pages/Resources';
import Search from './pages/Search';
import PDFSummarizer from './pages/PDFSummarizer';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="topic/:topicId" element={<Topic />} />
        <Route path="calculators" element={<Calculators />} />
        <Route path="examples" element={<Examples />} />
        <Route path="uploads" element={<Uploads />} />
        <Route path="resources" element={<Resources />} />
        <Route path="search" element={<Search />} />
        <Route path="summarizer" element={<PDFSummarizer />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
