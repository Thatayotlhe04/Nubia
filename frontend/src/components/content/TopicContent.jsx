import React from 'react';

/**
 * Renders topic content with proper formatting
 * Handles basic markdown-like syntax
 */
function TopicContent({ content }) {
  if (!content) return null;

  // Parse content into sections
  const sections = parseContent(content);

  return (
    <div className="nubia-prose">
      {sections.map((section, index) => (
        <ContentSection key={index} section={section} />
      ))}
    </div>
  );
}

/**
 * Parse content string into structured sections
 */
function parseContent(content) {
  const lines = content.split('\n');
  const sections = [];
  let currentSection = { type: 'paragraph', content: [] };

  lines.forEach(line => {
    const trimmed = line.trim();

    // Heading 2
    if (trimmed.startsWith('## ')) {
      if (currentSection.content.length > 0) {
        sections.push(currentSection);
      }
      sections.push({ type: 'h2', content: trimmed.slice(3) });
      currentSection = { type: 'paragraph', content: [] };
      return;
    }

    // Heading 3
    if (trimmed.startsWith('### ')) {
      if (currentSection.content.length > 0) {
        sections.push(currentSection);
      }
      sections.push({ type: 'h3', content: trimmed.slice(4) });
      currentSection = { type: 'paragraph', content: [] };
      return;
    }

    // Table detection
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      if (currentSection.type !== 'table') {
        if (currentSection.content.length > 0) {
          sections.push(currentSection);
        }
        currentSection = { type: 'table', content: [] };
      }
      currentSection.content.push(trimmed);
      return;
    }

    // List item
    if (trimmed.match(/^(\d+\.|-)/) ) {
      if (currentSection.type !== 'list') {
        if (currentSection.content.length > 0) {
          sections.push(currentSection);
        }
        const isOrdered = trimmed.match(/^\d+\./);
        currentSection = { type: 'list', ordered: !!isOrdered, content: [] };
      }
      const itemContent = trimmed.replace(/^(\d+\.|-)\s*/, '');
      currentSection.content.push(itemContent);
      return;
    }

    // Empty line - end current section
    if (trimmed === '') {
      if (currentSection.content.length > 0) {
        sections.push(currentSection);
        currentSection = { type: 'paragraph', content: [] };
      }
      return;
    }

    // Regular paragraph content
    if (currentSection.type !== 'paragraph') {
      if (currentSection.content.length > 0) {
        sections.push(currentSection);
      }
      currentSection = { type: 'paragraph', content: [] };
    }
    currentSection.content.push(trimmed);
  });

  // Push final section
  if (currentSection.content.length > 0) {
    sections.push(currentSection);
  }

  return sections;
}

/**
 * Render a single content section
 */
function ContentSection({ section }) {
  switch (section.type) {
    case 'h2':
      return <h2>{formatInlineContent(section.content)}</h2>;
    
    case 'h3':
      return <h3>{formatInlineContent(section.content)}</h3>;
    
    case 'paragraph':
      return (
        <p>
          {section.content.map((line, i) => (
            <React.Fragment key={i}>
              {formatInlineContent(line)}
              {i < section.content.length - 1 && ' '}
            </React.Fragment>
          ))}
        </p>
      );
    
    case 'list':
      const ListTag = section.ordered ? 'ol' : 'ul';
      return (
        <ListTag>
          {section.content.map((item, i) => (
            <li key={i}>{formatInlineContent(item)}</li>
          ))}
        </ListTag>
      );
    
    case 'table':
      return <ContentTable rows={section.content} />;
    
    default:
      return null;
  }
}

/**
 * Format inline content (bold, code, etc.)
 */
function formatInlineContent(text) {
  if (typeof text !== 'string') return text;

  // Split by bold markers and code markers
  const parts = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    // Check for bold
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    // Check for code
    const codeMatch = remaining.match(/`(.+?)`/);

    let firstMatch = null;
    let matchType = null;

    if (boldMatch && (!codeMatch || boldMatch.index < codeMatch.index)) {
      firstMatch = boldMatch;
      matchType = 'bold';
    } else if (codeMatch) {
      firstMatch = codeMatch;
      matchType = 'code';
    }

    if (firstMatch) {
      // Add text before match
      if (firstMatch.index > 0) {
        parts.push(remaining.slice(0, firstMatch.index));
      }
      
      // Add formatted content
      if (matchType === 'bold') {
        parts.push(<strong key={key++}>{firstMatch[1]}</strong>);
      } else {
        parts.push(<code key={key++}>{firstMatch[1]}</code>);
      }
      
      remaining = remaining.slice(firstMatch.index + firstMatch[0].length);
    } else {
      parts.push(remaining);
      remaining = '';
    }
  }

  return parts.length === 1 ? parts[0] : parts;
}

/**
 * Render a markdown table
 */
function ContentTable({ rows }) {
  if (rows.length < 2) return null;

  // Parse header
  const headerCells = rows[0]
    .split('|')
    .filter(cell => cell.trim())
    .map(cell => cell.trim());

  // Skip separator row (row 1)
  const bodyRows = rows.slice(2).map(row =>
    row
      .split('|')
      .filter(cell => cell.trim())
      .map(cell => cell.trim())
  );

  return (
    <table>
      <thead>
        <tr>
          {headerCells.map((cell, i) => (
            <th key={i}>{formatInlineContent(cell)}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {bodyRows.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => (
              <td key={j}>{formatInlineContent(cell)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default TopicContent;
