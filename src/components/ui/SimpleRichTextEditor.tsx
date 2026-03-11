import { useState, useRef, useCallback } from 'react';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Quote, 
  Link,
  Underline
} from 'lucide-react';

interface SimpleRichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
}

export function SimpleRichTextEditor({ 
  value, 
  onChange, 
  placeholder = "Enter text...", 
  className = "",
  minHeight = "120px"
}: SimpleRichTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isPreview, setIsPreview] = useState(false);

  const insertText = useCallback((before: string, after: string = '') => {
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    
    const newText = 
      textarea.value.substring(0, start) + 
      before + selectedText + after + 
      textarea.value.substring(end);
    
    onChange(newText);
    
    // Set cursor position after the inserted text
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + before.length + selectedText.length + after.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  }, [onChange]);

  const formatText = useCallback((type: string) => {
    switch (type) {
      case 'bold':
        insertText('**', '**');
        break;
      case 'italic':
        insertText('*', '*');
        break;
      case 'underline':
        insertText('<u>', '</u>');
        break;
      case 'h1':
        insertText('# ');
        break;
      case 'h2':
        insertText('## ');
        break;
      case 'h3':
        insertText('### ');
        break;
      case 'ul':
        insertText('- ');
        break;
      case 'ol':
        insertText('1. ');
        break;
      case 'quote':
        insertText('> ');
        break;
      case 'link':
        const url = prompt('Enter URL:');
        if (url) {
          insertText('[', `](${url})`);
        }
        break;
      default:
        break;
    }
  }, [insertText]);

  const convertToHtml = useCallback((text: string) => {
    return text
      // Headers
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
      // Lists
      .replace(/^- (.*$)/gm, '<li>$1</li>')
      .replace(/^1\. (.*$)/gm, '<li>$1</li>')
      // Quotes
      .replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>')
      // Line breaks
      .replace(/\n/g, '<br>');
  }, []);

  const toolbarButtons = [
    { icon: Bold, action: () => formatText('bold'), title: 'Bold (**text**)' },
    { icon: Italic, action: () => formatText('italic'), title: 'Italic (*text*)' },
    { icon: Underline, action: () => formatText('underline'), title: 'Underline' },
    { icon: List, action: () => formatText('ul'), title: 'Bullet List (- item)' },
    { icon: ListOrdered, action: () => formatText('ol'), title: 'Numbered List (1. item)' },
    { icon: Quote, action: () => formatText('quote'), title: 'Quote (> text)' },
    { icon: Link, action: () => formatText('link'), title: 'Link ([text](url))' },
  ];

  return (
    <div className={`border border-gray-300 rounded-md ${className}`}>
      {/* Toolbar */}
      <div className="border-b border-gray-300 p-2 bg-gray-50 flex flex-wrap gap-1 items-center">
        {/* Format Buttons */}
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => formatText('h1')}
            className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-200 transition-colors"
            title="Heading 1 (# text)"
          >
            H1
          </button>
          <button
            type="button"
            onClick={() => formatText('h2')}
            className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-200 transition-colors"
            title="Heading 2 (## text)"
          >
            H2
          </button>
          <button
            type="button"
            onClick={() => formatText('h3')}
            className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-200 transition-colors"
            title="Heading 3 (### text)"
          >
            H3
          </button>
        </div>

        <div className="w-px bg-gray-300 h-6 mx-1" />

        {/* Formatting Buttons */}
        {toolbarButtons.map((button, index) => {
          const Icon = button.icon;
          return (
            <button
              key={index}
              type="button"
              onClick={button.action}
              className="p-1 hover:bg-gray-200 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              title={button.title}
            >
              <Icon className="h-4 w-4" />
            </button>
          );
        })}

        <div className="w-px bg-gray-300 h-6 mx-1" />

        {/* Preview Toggle */}
        <button
          type="button"
          onClick={() => setIsPreview(!isPreview)}
          className={`px-3 py-1 text-sm rounded transition-colors ${
            isPreview 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {isPreview ? 'Edit' : 'Preview'}
        </button>
      </div>

      {/* Editor/Preview */}
      {isPreview ? (
        <div 
          className="w-full p-3 rich-text-preview"
          style={{ minHeight }}
          dangerouslySetInnerHTML={{ __html: convertToHtml(value) }}
        />
      ) : (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-3 border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset resize-none"
          style={{ minHeight }}
          placeholder={placeholder}
          rows={6}
        />
      )}

      {/* Help Text */}
      {!isPreview && (
        <div className="px-3 py-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-600">
          <strong>Formatting:</strong> **bold**, *italic*, # Heading 1, ## Heading 2, - List item, [link](url), &gt; Quote
        </div>
      )}
    </div>
  );
}